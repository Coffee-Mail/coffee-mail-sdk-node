import type { HttpClient } from "../core/http-client.js";
import type { CoffeeMailResponse } from "../core/types.js";

/**
 * Remetentes verificados por endereço, alternativa ao domínio completo.
 */
export class Senders {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Cadastra um remetente e dispara o e-mail de verificação.
   */
  public async create(payload: {
    readonly email: string;
    readonly displayName: string;
  }): Promise<CoffeeMailResponse<unknown>> {
    return this.http.post<unknown>("/v1/product/senders", payload);
  }

  /**
   * Lista os remetentes da organização.
   */
  public async list(): Promise<CoffeeMailResponse<unknown>> {
    return this.http.get<unknown>("/v1/product/senders");
  }

  /**
   * Confirma a verificação de um remetente com o token recebido por e-mail.
   */
  public async verify(token: string): Promise<CoffeeMailResponse<unknown>> {
    return this.http.post<unknown>("/v1/product/senders/verify", { token });
  }

  /**
   * Remove um remetente verificado.
   */
  public async delete(senderId: string): Promise<CoffeeMailResponse<unknown>> {
    return this.http.delete<unknown>(`/v1/product/senders/${encodeURIComponent(senderId)}`);
  }
}
