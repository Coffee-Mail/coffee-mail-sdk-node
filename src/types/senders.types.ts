/**
 * Parâmetros de `senders.create()`.
 */
export interface CreateSenderPayload {
  readonly email: string;
  readonly displayName?: string;
}

/**
 * Remetente verificado por endereço.
 */
export interface SenderDetail {
  readonly id: string;
  readonly email: string;
  readonly displayName: string | null;
  readonly verifiedAt: string | null;
  readonly active: boolean;
  readonly createdAt: string;
}

/**
 * Remetente recém-criado, com o token enviado por e-mail para verificação.
 */
export interface CreatedSenderDetail extends SenderDetail {
  readonly verificationToken: string;
}

export interface ListSendersResponse {
  readonly senders: ReadonlyArray<SenderDetail>;
}

/**
 * Resultado de `senders.verify()`.
 */
export interface VerifySenderResult {
  readonly id: string;
  readonly email: string;
}
