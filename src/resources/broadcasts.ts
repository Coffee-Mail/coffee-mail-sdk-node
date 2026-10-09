import type { HttpClient } from "../core/http-client.js";
import { ForbiddenError, PermissionError } from "../core/errors.js";
import type { CreateBroadcastWireBodyKey } from "../generated/contract-check.js";
import { getI18nMessage } from "../core/i18n/index.js";
import { toQueryParams } from "../core/query.js";
import type { CoffeeMailResponse } from "../core/types.js";
import type {
  BroadcastDetail,
  CancelBroadcastResult,
  CreateBroadcastPayload,
  ListBroadcastsQuery,
  ListBroadcastsResponse,
  SendBroadcastResult,
} from "../types/broadcasts.types.js";

const REQUIRES_FULL_ACCESS = "full_access";

const CREATE_BROADCAST_WIRE_KEYS: ReadonlyArray<CreateBroadcastWireBodyKey> = [
  "audienceId",
  "fromEmail",
  "templateId",
  "subject",
  "html",
  "text",
  "replyTo",
  "variables",
];

const formatCreateBody = (
  payload: CreateBroadcastPayload,
): Record<string, unknown> => {
  const source = payload as Record<string, unknown>;
  const body: Record<string, unknown> = {};
  for (const key of CREATE_BROADCAST_WIRE_KEYS) {
    if (source[key] === undefined) continue;
    body[key] = source[key];
  }
  return body;
};

export class Broadcasts {
  constructor(private readonly http: HttpClient) {}

  public async create(
    payload: CreateBroadcastPayload,
  ): Promise<CoffeeMailResponse<BroadcastDetail>> {
    const result = await this.http.post<BroadcastDetail>(
      "/v1/product/broadcasts",
      formatCreateBody(payload),
    );
    return this.remapForbidden(result, "broadcasts.create");
  }

  public async list(
    query?: ListBroadcastsQuery,
  ): Promise<CoffeeMailResponse<ListBroadcastsResponse>> {
    const result = await this.http.get<ListBroadcastsResponse>(
      "/v1/product/broadcasts",
      toQueryParams(query),
    );
    return this.remapForbidden(result, "broadcasts.list");
  }

  public async get(id: string): Promise<CoffeeMailResponse<BroadcastDetail>> {
    const result = await this.http.get<BroadcastDetail>(
      `/v1/product/broadcasts/${id}`,
    );
    return this.remapForbidden(result, "broadcasts.get");
  }

  public async send(
    id: string,
  ): Promise<CoffeeMailResponse<SendBroadcastResult>> {
    const result = await this.http.post<SendBroadcastResult>(
      `/v1/product/broadcasts/${id}/send`,
    );
    return this.remapForbidden(result, "broadcasts.send");
  }

  public async cancel(
    id: string,
  ): Promise<CoffeeMailResponse<CancelBroadcastResult>> {
    const result = await this.http.post<CancelBroadcastResult>(
      `/v1/product/broadcasts/${id}/cancel`,
    );
    return this.remapForbidden(result, "broadcasts.cancel");
  }
  /**
   * Dispara um envio de teste da campanha para os destinatários informados.
   */
  public async testSend(
    broadcastId: string,
    payload: Record<string, unknown>,
  ): Promise<CoffeeMailResponse<unknown>> {
    const result = await this.http.post<unknown>(
      `/v1/product/broadcasts/${encodeURIComponent(broadcastId)}/test-send`,
      payload,
    );
    return this.remapForbidden(result, "broadcasts.testSend");
  }

  private remapForbidden<T>(
    result: CoffeeMailResponse<T>,
    operation: string,
  ): CoffeeMailResponse<T> {
    if (!(result.error instanceof ForbiddenError)) return result;

    return {
      data: null,
      error: new PermissionError(
        getI18nMessage("permissionDenied", this.http.getLocale(), {
          requiredPermission: `${REQUIRES_FULL_ACCESS} (called by ${operation})`,
        }),
        REQUIRES_FULL_ACCESS,
        { operation, details: result.error.details },
      ),
    };
  }
}
