/**
 * Resultado da validação de um endereço. `reason` explica a reprovação
 * quando o endereço não passa em alguma checagem.
 */
export interface EmailValidationItem {
  readonly email: string;
  readonly formatValid: boolean;
  readonly mxValid: boolean;
  readonly isDisposable: boolean;
  readonly reason?: string;
}

/**
 * Saldo mensal de créditos de validação da organização após a chamada.
 * `limit` e `remaining` são `null` quando o plano não tem limite.
 */
export interface EmailValidationCredits {
  readonly limit: number | null;
  readonly used: number;
  readonly remaining: number | null;
}

export interface ValidateEmailsResponse {
  readonly items: ReadonlyArray<EmailValidationItem>;
  readonly validCount: number;
  readonly invalidCount: number;
  readonly credits: EmailValidationCredits;
}
