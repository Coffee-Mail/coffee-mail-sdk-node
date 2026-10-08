import {
  AuthenticationError,
  createErrorFromResponse,
  NetworkError,
} from "./errors.js";
import { getI18nMessage } from "./i18n/index.js";

import type { CoffeeMailError } from "./errors.js";
import type { CoffeeMailLocale } from "./i18n/types.js";
import type {
  ApiKeyIntrospection,
  CoffeeMailClientOptions,
  CoffeeMailResponse,
  HttpRequestOptions,
} from "./types.js";

const SDK_VERSION = "0.2.1";
const DEFAULT_BASE_URL = "https://api.coffeemail.com.br";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_LOCALE: CoffeeMailLocale = "pt-BR";

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly locale: CoffeeMailLocale;
  private readonly customFetch: typeof globalThis.fetch;

  private introspectionCache:
    | { readonly data: ApiKeyIntrospection; readonly expiresAt: number }
    | null = null;

  constructor(apiKey?: string, options: CoffeeMailClientOptions = {}) {
    const locale = options.locale ?? DEFAULT_LOCALE;

    if (!apiKey || apiKey.trim().length === 0) {
      throw new AuthenticationError(getI18nMessage("missingApiKey", locale));
    }

    this.apiKey = apiKey.trim();
    this.baseUrl = DEFAULT_BASE_URL;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.locale = locale;
    this.customFetch = options.fetch ?? globalThis.fetch;
  }

  public getLocale(): CoffeeMailLocale {
    return this.locale;
  }

  public async introspect(
    forceRefresh = false,
  ): Promise<CoffeeMailResponse<ApiKeyIntrospection>> {
    if (!forceRefresh && this.introspectionCache) {
      const cached = this.introspectionCache;
      if (cached.expiresAt > Date.now()) {
        return { data: cached.data, error: null };
      }
      this.introspectionCache = null;
    }

    const result = await this.get<ApiKeyIntrospection>(
      "/v1/product/auth/me/api-key",
    );

    if (result.data) {
      this.introspectionCache = {
        data: result.data,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
    }

    return result;
  }

  public invalidateIntrospectionCache(): void {
    this.introspectionCache = null;
  }

  public async request<T>(
    options: HttpRequestOptions,
  ): Promise<CoffeeMailResponse<T>> {
    const url = this.buildUrl(options.path, options.query);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": this.locale,
      "User-Agent": `coffeemail-node/${SDK_VERSION}`,
      ...options.headers,
    };

    try {
      const init: RequestInit = {
        method: options.method ?? "GET",
        headers,
        signal: controller.signal,
      };

      if (options.body !== undefined) {
        init.body = JSON.stringify(options.body);
      }

      const response = await this.customFetch(url, init);

      clearTimeout(timeoutId);

      const isNoContent = response.status === 204;
      let responsePayload: unknown = null;

      if (!isNoContent) {
        const text = await response.text();
        if (text.trim().length > 0) {
          try {
            responsePayload = JSON.parse(text);
          } catch {
            responsePayload = { message: text };
          }
        }
      }

      if (!response.ok) {
        const retryAfterHeader = response.headers?.get("retry-after") ?? null;
        const retryAfterSeconds =
          retryAfterHeader !== null && /^\d+$/.test(retryAfterHeader)
            ? Number(retryAfterHeader)
            : undefined;
        const error = createErrorFromResponse(
          response.status,
          responsePayload,
          this.locale,
          retryAfterSeconds,
        );
        return { data: null, error };
      }

      return { data: responsePayload as T, error: null };
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === "AbortError") {
        const error: CoffeeMailError = new NetworkError(
          getI18nMessage("requestTimeout", this.locale, {
            timeoutMs: this.timeoutMs,
          }),
        );
        return { data: null, error };
      }

      const errorMessage = err instanceof Error ? err.message : String(err);
      const error: CoffeeMailError = new NetworkError(
        getI18nMessage("networkError", this.locale, { details: errorMessage }),
        err,
      );
      return { data: null, error };
    }
  }

  public get<T>(
    path: string,
    query?: HttpRequestOptions["query"],
    headers?: Record<string, string>,
  ): Promise<CoffeeMailResponse<T>> {
    return this.request<T>({ method: "GET", path, query, headers });
  }

  public post<T>(
    path: string,
    body?: unknown,
    query?: HttpRequestOptions["query"],
    headers?: Record<string, string>,
  ): Promise<CoffeeMailResponse<T>> {
    return this.request<T>({ method: "POST", path, body, query, headers });
  }

  public put<T>(
    path: string,
    body?: unknown,
    query?: HttpRequestOptions["query"],
    headers?: Record<string, string>,
  ): Promise<CoffeeMailResponse<T>> {
    return this.request<T>({ method: "PUT", path, body, query, headers });
  }

  public delete<T>(
    path: string,
    query?: HttpRequestOptions["query"],
    headers?: Record<string, string>,
  ): Promise<CoffeeMailResponse<T>> {
    return this.request<T>({ method: "DELETE", path, query, headers });
  }

  public patch<T>(
    path: string,
    body?: unknown,
    query?: HttpRequestOptions["query"],
    headers?: Record<string, string>,
  ): Promise<CoffeeMailResponse<T>> {
    return this.request<T>({ method: "PATCH", path, body, query, headers });
  }

  private buildUrl(path: string, query?: HttpRequestOptions["query"]): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const fullUrl = new URL(`${this.baseUrl}${cleanPath}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          fullUrl.searchParams.append(key, String(value));
        }
      }
    }

    return fullUrl.toString();
  }
}
