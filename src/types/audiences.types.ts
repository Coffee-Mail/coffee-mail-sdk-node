export interface ContactDetail {
  readonly id: string;
  readonly email: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly metadata: Record<string, unknown>;
  /**
   * `false` quando o contato se descadastrou dos broadcasts da organização.
   */
  readonly subscribed?: boolean;
  readonly createdAt: string;
}

export interface CreateContactPayload {
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Atualização de contato — pelo menos um campo deve ser enviado.
 */
export interface UpdateContactPayload {
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly metadata?: Record<string, unknown>;
}

export interface UpdateContactResult {
  readonly id: string;
}

export interface ListContactsResponse {
  readonly contacts: ReadonlyArray<ContactDetail>;
  readonly total: number;
}

export interface BulkAddContactInput {
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly metadata?: Record<string, unknown>;
}

export interface BulkAddContactsPayload {
  readonly contacts: ReadonlyArray<BulkAddContactInput>;
}

export interface BulkAddContactsResult {
  readonly inserted: number;
  readonly skipped: number;
  readonly errors: ReadonlyArray<{
    readonly email: string;
    readonly reason: string;
  }>;
}

/**
 * Uma audiência (lista segmentada de contatos).
 */
export interface AudienceDetail {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly active: boolean;
  readonly totalContacts: number;
  /**
   * @deprecated Utilize `totalContacts`. Mantido para retrocompatibilidade.
   */
  readonly contactsCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ListAudiencesResponse {
  readonly audiences: ReadonlyArray<AudienceDetail>;
  readonly total: number;
}

export interface CreateAudiencePayload {
  readonly name: string;
  readonly description?: string;
}

/**
 * Atualização de audiência — pelo menos um campo deve ser enviado.
 */
export interface UpdateAudiencePayload {
  readonly name?: string;
  readonly description?: string | null;
  readonly active?: boolean;
}

export interface UpdateAudienceResult {
  readonly id: string;
}
