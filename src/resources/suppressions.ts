import type { HttpClient } from "../core/http-client.js";
import { toQueryParams } from "../core/query.js";
import type { CoffeeMailResponse } from "../core/types.js";
import type {
  CreateSuppressionPayload,
  ListSuppressionsQuery,
  ListSuppressionsResponse,
  SuppressionDetail,
} from "../types/suppressions.types.js";

export class Suppressions {
  constructor(private readonly http: HttpClient) {}

  public async list(
    query?: ListSuppressionsQuery,
  ): Promise<CoffeeMailResponse<ListSuppressionsResponse>> {
    return this.http.get<ListSuppressionsResponse>(
      "/v1/product/suppressions",
      toQueryParams(query),
    );
  }

  public async get(id: string): Promise<CoffeeMailResponse<SuppressionDetail>> {
    return this.http.get<SuppressionDetail>(`/v1/product/suppressions/${id}`);
  }

  public async create(
    payload: CreateSuppressionPayload,
  ): Promise<CoffeeMailResponse<SuppressionDetail>> {
    return this.http.post<SuppressionDetail>(
      "/v1/product/suppressions",
      payload,
    );
  }

  /**
   * Remove a supressão definitivamente. Não retorna corpo na resposta (204 No Content).
   */
  public async delete(id: string): Promise<CoffeeMailResponse<void>> {
    return this.http.delete<void>(`/v1/product/suppressions/${id}`);
  }

  /**
   * Desfaz a supressão, permitindo que o email volte a receber envios.
   * Não retorna corpo na resposta (204 No Content).
   */
  public async reactivate(id: string): Promise<CoffeeMailResponse<void>> {
    return this.http.post<void>(`/v1/product/suppressions/${id}/reactivate`);
  }

  /**
   * Cria supressões em lote.
   */
  public async bulkCreate(
    suppressions: ReadonlyArray<Record<string, unknown>>,
  ): Promise<CoffeeMailResponse<unknown>> {
    return this.http.post<unknown>("/v1/product/suppressions/bulk", { suppressions });
  }
}
