import type { HttpClient } from "../core/http-client.js";
import type { CoffeeMailResponse } from "../core/types.js";
import type {
  CreatedSenderDetail,
  CreateSenderPayload,
  ListSendersResponse,
  VerifySenderResult,
} from "../types/senders.types.js";

/**
 * Remetentes verificados por endereço, alternativa ao domínio completo.
 */
export class Senders {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Cadastra um remetente e dispara o e-mail de verificação.
   */
  public async create(
    payload: CreateSenderPayload,
  ): Promise<CoffeeMailResponse<CreatedSenderDetail>> {
    return this.http.post<CreatedSenderDetail>("/v1/product/senders", payload);
  }

  /**
   * Lista os remetentes da organização.
   */
  public async list(): Promise<CoffeeMailResponse<ListSendersResponse>> {
    return this.http.get<ListSendersResponse>("/v1/product/senders");
  }

  /**
   * Confirma a verificação de um remetente com o token recebido por e-mail.
   */
  public async verify(token: string): Promise<CoffeeMailResponse<VerifySenderResult>> {
    return this.http.post<VerifySenderResult>("/v1/product/senders/verify", { token });
  }

  /**
   * Reenvia o e-mail de verificação com um token novo (o anterior expira).
   * Não retorna corpo na resposta.
   */
  public async resendVerification(senderId: string): Promise<CoffeeMailResponse<void>> {
    return this.http.post<void>(
      `/v1/product/senders/${encodeURIComponent(senderId)}/resend-verification`,
    );
  }

  /**
   * Remove um remetente verificado. Não retorna corpo na resposta.
   */
  public async delete(senderId: string): Promise<CoffeeMailResponse<void>> {
    return this.http.delete<void>(`/v1/product/senders/${encodeURIComponent(senderId)}`);
  }
}
