export type SuppressionReason =
  | "manual"
  | "bounce"
  | "isp_block"
  | "mailbox_not_found"
  | "complaint"
  | "unsubscribe";

export type SuppressionSource = "manual" | "auto";

export type SuppressionStatus = "active" | "expired" | "inactive";

/**
 * Uma entrada na lista de supressão — um endereço que não deve receber e-mails.
 */
export interface SuppressionDetail {
  readonly id: string;
  readonly email: string;
  readonly reason: SuppressionReason;
  readonly source: SuppressionSource;
  /**
   * Categoria de classificação definida pelo servidor — string livre, não um
   * enum fixo do lado do cliente.
   */
  readonly category: string;
  readonly status: SuppressionStatus;
  readonly expiresAt: string | null;
  readonly createdAt: string;
}

export interface ListSuppressionsQuery {
  readonly status?: SuppressionStatus;
  readonly reason?: SuppressionReason;
  readonly source?: SuppressionSource;
  readonly category?:
    | "manual"
    | "bounce"
    | "block"
    | "complaint"
    | "unsubscribe"
    | "invalid_email"
    | "global";
  /**
   * Cursor para a próxima página, retornado em `nextCursor`.
   */
  readonly after?: string;
  /**
   * Máximo 200. Padrão do servidor é 50 se omitido.
   */
  readonly limit?: number;
}

export interface ListSuppressionsResponse {
  readonly suppressions: ReadonlyArray<SuppressionDetail>;
  readonly nextCursor: string | null;
}

export interface CreateSuppressionPayload {
  readonly email: string;
  /**
   * No momento da criação, apenas este subconjunto restrito é aceito —
   * motivos automáticos (isp_block, mailbox_not_found, unsubscribe) são
   * atribuídos pelo próprio sistema.
   */
  readonly reason?: "manual" | "bounce" | "complaint";
  readonly expiresAt?: string;
}

/**
 * Item de `bulkCreate()`.
 */
export interface BulkCreateSuppressionInput {
  readonly email: string;
  readonly reason?: "manual" | "bounce" | "complaint";
}

/**
 * Resultado de `bulkCreate()`.
 */
export interface BulkCreateSuppressionsResult {
  readonly insertedCount: number;
}
