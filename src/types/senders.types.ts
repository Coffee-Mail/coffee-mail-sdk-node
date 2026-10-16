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
 * Remetente recém-criado. O token de verificação é enviado por e-mail ao
 * próprio endereço cadastrado e não aparece mais na resposta.
 */
export interface CreatedSenderDetail extends SenderDetail {
  /**
   * @deprecated A API não devolve mais o token na resposta; a verificação é
   * concluída pelo link enviado ao e-mail do remetente.
   */
  readonly verificationToken?: string;
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
