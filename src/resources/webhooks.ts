import { createHmac, timingSafeEqual } from "node:crypto";

import type { HttpClient } from "../core/http-client.js";
import { toQueryParams } from "../core/query.js";
import type { BinaryData, CoffeeMailResponse } from "../core/types.js";
import type {
  CreateWebhookPayload,
  CreatedWebhookDetail,
  ListWebhookDeliveriesQuery,
  ListWebhookDeliveriesResponse,
  ListWebhooksQuery,
  ListWebhooksResponse,
  RotateWebhookSecretResult,
  TestWebhookResult,
  ToggleWebhookPayload,
  ToggleWebhookResult,
  UpdateWebhookPayload,
  VerifyWebhookSignatureOptions,
  WebhookDetail,
  WebhookRequestHeaders,
} from "../types/webhooks.types.js";

const SIGNATURE_HEADER = "x-webhook-signature";
const TIMESTAMP_HEADER = "x-webhook-timestamp";
const IDEMPOTENCY_KEY_HEADER = "x-webhook-idempotency-key";
const SIGNATURE_PREFIX = "sha256=";
const SEPARATOR = ".";
const DEFAULT_TOLERANCE_SECONDS = 300;
const MILLISECONDS_PER_SECOND = 1000;
const UNIX_SECONDS = /^-?\d{1,18}$/;

interface SignedDelivery {
  readonly signature: string;
  readonly timestamp: string;
  readonly idempotencyKey: string;
}

const firstValue = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
};

const readHeader = (headers: WebhookRequestHeaders, name: string): string => {
  if (typeof headers.get === "function") {
    return headers.get(name) ?? "";
  }
  const entries = Object.entries(headers as Record<string, unknown>);
  const match = entries.find(([key]) => key.toLowerCase() === name);
  return firstValue(match?.[1]);
};

const signedDelivery = (options: VerifyWebhookSignatureOptions): SignedDelivery => {
  if ("headers" in options) {
    return {
      signature: readHeader(options.headers, SIGNATURE_HEADER),
      timestamp: readHeader(options.headers, TIMESTAMP_HEADER),
      idempotencyKey: readHeader(options.headers, IDEMPOTENCY_KEY_HEADER),
    };
  }
  return {
    signature: options.signature,
    timestamp: options.timestamp,
    idempotencyKey: options.idempotencyKey,
  };
};

const isFilled = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const hasPayload = (payload: unknown): payload is BinaryData =>
  isFilled(payload) || payload instanceof Uint8Array;

const withinTolerance = (
  timestamp: string,
  toleranceSeconds: number,
  now: () => number,
): boolean => {
  if (!UNIX_SECONDS.test(timestamp)) return false;
  const nowSeconds = Math.floor(now() / MILLISECONDS_PER_SECOND);
  return Math.abs(nowSeconds - Number(timestamp)) <= toleranceSeconds;
};

const sign = (secret: string, delivery: SignedDelivery, payload: BinaryData): string =>
  SIGNATURE_PREFIX +
  createHmac("sha256", secret)
    .update(delivery.timestamp + SEPARATOR + delivery.idempotencyKey + SEPARATOR)
    .update(payload)
    .digest("hex");

const constantTimeEquals = (expected: string, received: string): boolean => {
  const expectedBuffer = Buffer.from(expected, "utf-8");
  const receivedBuffer = Buffer.from(received, "utf-8");
  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, receivedBuffer);
};

/**
 * Recurso de gerenciamento e verificação criptográfica de Webhooks do CoffeeMail.
 */
export class Webhooks {
  constructor(private readonly http: HttpClient) {}

  /**
   * Cadastra um novo endpoint de webhook na plataforma.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.create({
   *   url: 'https://minha-api.com.br/api/webhooks/coffeemail',
   *   events: ['email.delivered', 'email.bounced'],
   * });
   * // Guarde data.secret: ele só é devolvido nesta resposta.
   * ```
   */
  public async create(
    payload: CreateWebhookPayload,
  ): Promise<CoffeeMailResponse<CreatedWebhookDetail>> {
    return this.http.post<CreatedWebhookDetail>(
      "/v1/product/webhooks",
      payload,
    );
  }

  /**
   * Lista todos os webhooks cadastrados na organização.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.list();
   * console.log(data?.webhooks);
   * ```
   */
  public async list(
    query?: ListWebhooksQuery,
  ): Promise<CoffeeMailResponse<ListWebhooksResponse>> {
    return this.http.get<ListWebhooksResponse>(
      "/v1/product/webhooks",
      toQueryParams(query),
    );
  }

  /**
   * Obtém detalhes de um webhook cadastrado.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.get('wh_123');
   * ```
   */
  public async get(id: string): Promise<CoffeeMailResponse<WebhookDetail>> {
    return this.http.get<WebhookDetail>(`/v1/product/webhooks/${id}`);
  }

  /**
   * Atualiza configurações de um webhook.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.update('wh_123', {
   *   events: ['email.delivered', 'email.bounced', 'email.complained']
   * });
   * ```
   */
  public async update(
    id: string,
    payload: UpdateWebhookPayload,
  ): Promise<CoffeeMailResponse<WebhookDetail>> {
    return this.http.put<WebhookDetail>(`/v1/product/webhooks/${id}`, payload);
  }

  /**
   * Ativa ou pausa um webhook, sem alterar url, events ou description.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.toggle('wh_123', { status: 'paused' });
   * ```
   */
  public async toggle(
    id: string,
    payload: ToggleWebhookPayload,
  ): Promise<CoffeeMailResponse<ToggleWebhookResult>> {
    return this.http.patch<ToggleWebhookResult>(
      `/v1/product/webhooks/${id}`,
      payload,
    );
  }

  /**
   * Remove um webhook da organização. Não retorna corpo na resposta (204 No Content).
   *
   * @example
   * ```typescript
   * const { error } = await coffeemail.webhooks.delete('wh_123');
   * ```
   */
  public async delete(id: string): Promise<CoffeeMailResponse<void>> {
    return this.http.delete<void>(`/v1/product/webhooks/${id}`);
  }

  /**
   * Gera um novo segredo HMAC para o webhook, invalidando o anterior.
   * O valor completo só é retornado nesta resposta — guarde-o com segurança.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.rotateSecret('wh_123');
   * ```
   */
  public async rotateSecret(
    id: string,
  ): Promise<CoffeeMailResponse<RotateWebhookSecretResult>> {
    return this.http.post<RotateWebhookSecretResult>(
      `/v1/product/webhooks/${id}/rotate-secret`,
    );
  }

  /**
   * Lista as tentativas de entrega de eventos para um webhook.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.listDeliveries('wh_123', { status: 'failed' });
   * ```
   */
  public async listDeliveries(
    id: string,
    query?: ListWebhookDeliveriesQuery,
  ): Promise<CoffeeMailResponse<ListWebhookDeliveriesResponse>> {
    return this.http.get<ListWebhookDeliveriesResponse>(
      `/v1/product/webhooks/${id}/deliveries`,
      toQueryParams(query),
    );
  }

  /**
   * Dispara um envio de teste simulado para o endpoint do webhook.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.webhooks.test('wh_123');
   * ```
   */
  public async test(
    id: string,
  ): Promise<CoffeeMailResponse<TestWebhookResult>> {
    return this.http.post<TestWebhookResult>(`/v1/product/webhooks/${id}/test`);
  }

  /**
   * Valida a autenticidade de uma entrega de webhook.
   *
   * A assinatura (`x-webhook-signature`) é `sha256=` seguido do HMAC-SHA256 em
   * hexadecimal de `timestamp + "." + idempotencyKey + "." + corpoBruto`,
   * comparada em tempo constante. Entregas com `x-webhook-timestamp` fora da
   * janela de tolerância (padrão 300s) são rejeitadas para impedir replay.
   *
   * @example
   * ```typescript
   * // Express, com express.raw({ type: 'application/json' }):
   * const isValid = coffeemail.webhooks.verifySignature({
   *   payload: req.body,
   *   headers: req.headers,
   *   secret: process.env.COFFEEMAIL_WEBHOOK_SECRET!,
   * });
   *
   * if (!isValid) {
   *   return res.status(401).send('Assinatura inválida');
   * }
   * ```
   */
  public verifySignature(options: VerifyWebhookSignatureOptions): boolean {
    return Webhooks.verifySignature(options);
  }

  /**
   * Mesma verificação de `verifySignature()`, sem instanciar o cliente.
   */
  public static verifySignature(
    options: VerifyWebhookSignatureOptions,
  ): boolean {
    const delivery = signedDelivery(options);
    const complete =
      hasPayload(options.payload) &&
      isFilled(options.secret) &&
      isFilled(delivery.signature) &&
      isFilled(delivery.timestamp) &&
      isFilled(delivery.idempotencyKey);
    if (!complete) return false;

    const tolerance = options.toleranceSeconds ?? DEFAULT_TOLERANCE_SECONDS;
    if (!withinTolerance(delivery.timestamp, tolerance, options.now ?? Date.now)) {
      return false;
    }
    return constantTimeEquals(sign(options.secret, delivery, options.payload), delivery.signature);
  }
}
