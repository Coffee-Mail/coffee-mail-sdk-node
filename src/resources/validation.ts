import type { HttpClient } from "../core/http-client.js";
import type { CoffeeMailResponse } from "../core/types.js";
import type { ValidateEmailsResponse } from "../types/validation.types.js";

/**
 * Validação de endereços de e-mail (formato, MX e domínio descartável).
 */
export class Validation {
  constructor(private readonly http: HttpClient) {}

  /**
   * Valida de 1 a 100 endereços (até 320 caracteres cada), consumindo créditos
   * mensais de validação. Com os créditos do mês esgotados, a API responde
   * `RateLimitError` com `apiCode` `VALIDATION_CREDITS_EXHAUSTED`: não é limite
   * de requisições, então repetir a chamada não resolve até o próximo ciclo.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.validation.validate([
   *   'ana@empresa.com.br',
   *   'teste@mailinator.com',
   * ]);
   * console.log(data?.validCount, data?.credits.remaining);
   * ```
   */
  public async validate(
    emails: ReadonlyArray<string>,
  ): Promise<CoffeeMailResponse<ValidateEmailsResponse>> {
    return this.http.post<ValidateEmailsResponse>("/v1/product/validate", {
      emails,
    });
  }
}
