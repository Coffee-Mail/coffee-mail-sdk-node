import { Buffer } from "node:buffer";

import { ValidationError } from "../core/errors.js";
import type { HttpClient } from "../core/http-client.js";
import { normalizeScheduledAt } from "../core/normalizers.js";
import type { SendEmailWireBodyKey } from "../generated/contract-check.js";
import { toQueryParams } from "../core/query.js";
import type { CoffeeMailResponse } from "../core/types.js";
import type {
  BatchSendEmailResult,
  EmailAddressInput,
  EmailAttachment,
  EmailDetail,
  EmailEventsResponse,
  EmailParticipant,
  ListEmailsQuery,
  ListEmailsResponse,
  ListEmailTagsResponse,
  SendEmailPayload,
  SendEmailResponse,
} from "../types/emails.types.js";
const isPresent = (value: unknown): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const NAMED_EMAIL_PATTERN = /^(?:(?<name>.*?)\s*<)?(?<email>[^<>\s]+)>?$/;

const parseEmailString = (input: string): EmailParticipant => {
  const trimmed = input.trim();
  const match = NAMED_EMAIL_PATTERN.exec(trimmed);
  if (!match) {
    return { email: trimmed };
  }

  const email = match.groups?.email?.trim();
  const rawName = match.groups?.name?.trim();
  const name = rawName ? rawName.replace(/^["']|["']$/g, '').trim() : undefined;

  if (email && name) {
    return { email, name };
  }

  return { email: email ?? trimmed };
};

const normalizeParticipant = (input: EmailAddressInput): EmailParticipant => {
  if (typeof input === "string") {
    return parseEmailString(input);
  }

  const isValidObject =
    input !== null &&
    typeof input === "object" &&
    typeof (input as { email?: unknown }).email === "string";

  if (!isValidObject) {
    throw new ValidationError(
      "Invalid email participant: expected a string email address or an object with an `email` string field.",
      { received: input },
    );
  }

  return {
    email: input.email.trim(),
    ...(input.name ? { name: input.name.trim() } : {}),
  };
};

const normalizeList = (
  input?: EmailAddressInput | ReadonlyArray<EmailAddressInput>,
): EmailParticipant[] | undefined => {
  if (!input) return undefined;
  if (Array.isArray(input)) {
    return input.map(normalizeParticipant);
  }
  return [normalizeParticipant(input as EmailAddressInput)];
};

const serializeAttachment = (
  attachment: EmailAttachment,
): Record<string, unknown> => {
  const content =
    typeof attachment.content === "string"
      ? attachment.content
      : Buffer.isBuffer(attachment.content)
        ? attachment.content.toString("base64")
        : String(attachment.content);

  return {
    filename: attachment.filename,
    content,
    contentType: attachment.contentType ?? "application/octet-stream",
    disposition: attachment.disposition ?? "attachment",
    ...(attachment.cid ? { cid: attachment.cid } : {}),
  };
};
type PayloadEntry = {
  readonly source: keyof SendEmailPayload;
  readonly target: SendEmailWireBodyKey;
  readonly map?: (value: unknown) => unknown;
};

const PAYLOAD_ENTRIES: ReadonlyArray<PayloadEntry> = [
  {
    source: "cc",
    target: "cc",
    map: (v) =>
      normalizeList(v as EmailAddressInput | ReadonlyArray<EmailAddressInput>),
  },
  {
    source: "bcc",
    target: "bcc",
    map: (v) =>
      normalizeList(v as EmailAddressInput | ReadonlyArray<EmailAddressInput>),
  },
  {
    source: "replyTo",
    target: "replyTo",
    map: (v) => normalizeParticipant(v as EmailAddressInput),
  },
  { source: "html", target: "html" },
  { source: "text", target: "text" },
  { source: "templateId", target: "templateId" },
  { source: "variables", target: "variables" },
  { source: "headers", target: "headers" },
  {
    source: "attachments",
    target: "attachments",
    map: (v) => (v as ReadonlyArray<EmailAttachment>).map(serializeAttachment),
  },
  { source: "tags", target: "tags" },
];

const formatSendBody = (payload: SendEmailPayload): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    from: normalizeParticipant(payload.from),
    to: [normalizeParticipant(payload.to)],
    subject: payload.subject,
  };

  for (const entry of PAYLOAD_ENTRIES) {
    const raw = payload[entry.source];
    if (!isPresent(raw)) continue;

    const value = entry.map ? entry.map(raw) : raw;
    if (!isPresent(value)) continue;
    body[entry.target] = value;
  }

  const scheduledAt = normalizeScheduledAt(payload.scheduledAt);
  if (scheduledAt !== undefined) {
    body["scheduledAt"] = scheduledAt;
  }

  return body;
};

const IDEMPOTENCY_HEADER = "x-idempotency-key";
const SANDBOX_HEADER = "x-coffeemail-sandbox";

const formatSendHeaders = (payload: SendEmailPayload): Record<string, string> => ({
  ...(payload.idempotencyKey ? { [IDEMPOTENCY_HEADER]: payload.idempotencyKey } : {}),
  ...(payload.isSandbox === true ? { [SANDBOX_HEADER]: "true" } : {}),
});

/**
 * Recurso de gerenciamento e disparo de e-mails da API CoffeeMail.
 */
export class Emails {
  constructor(private readonly http: HttpClient) {}

  /**
   * Envia um e-mail transacional único.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.emails.send({
   *   from: 'contato@seudominio.com.br',
   *   to: 'cliente@gmail.com',
   *   subject: 'Pedido #123 Confirmado',
   *   html: '<h1>Obrigado por sua compra!</h1>'
   * });
   * ```
   */
  public async send(
    payload: SendEmailPayload,
  ): Promise<CoffeeMailResponse<SendEmailResponse>> {
    return this.http.post<SendEmailResponse>(
      "/v1/product/emails",
      formatSendBody(payload),
      undefined,
      formatSendHeaders(payload),
    );
  }

  /**
   * Envia múltiplos e-mails transacionais em uma única requisição (em lote).
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.emails.sendBatch([
   *   { from: 'alertas@seudominio.com', to: 'user1@gmail.com', subject: 'Aviso', html: '<p>Mensagem 1</p>' },
   *   { from: 'alertas@seudominio.com', to: 'user2@gmail.com', subject: 'Aviso', html: '<p>Mensagem 2</p>' }
   * ]);
   * ```
   */
  public async sendBatch(
    items: ReadonlyArray<SendEmailPayload>,
  ): Promise<CoffeeMailResponse<ReadonlyArray<BatchSendEmailResult>>> {
    const formatted = items.map(formatSendBody);
    const batchHeaders = items.reduce<Record<string, string>>(
      (headers, item) => Object.assign(headers, formatSendHeaders(item)),
      {},
    );
    return this.http.post<ReadonlyArray<BatchSendEmailResult>>(
      "/v1/product/emails/batch",
      formatted,
      undefined,
      batchHeaders,
    );
  }

  /**
   * Obtém os detalhes completos de um e-mail específico pelo ID.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.emails.get('eml_8f92b7c4');
   * if (data) {
   *   console.log(`Status do e-mail: ${data.status}`);
   * }
   * ```
   */
  public async get(id: string): Promise<CoffeeMailResponse<EmailDetail>> {
    return this.http.get<EmailDetail>(`/v1/product/emails/${id}`);
  }

  /**
   * Lista o histórico de e-mails enviados com suporte a paginação e filtros.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.emails.list({ limit: 50, status: 'delivered' });
   * ```
   */
  public async list(
    query?: ListEmailsQuery,
  ): Promise<CoffeeMailResponse<ListEmailsResponse>> {
    return this.http.get<ListEmailsResponse>(
      "/v1/product/emails",
      toQueryParams(query),
    );
  }

  /**
   * Consulta a linha do tempo completa de eventos de entrega (queued -> sent -> delivered / bounced).
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.emails.getEvents('eml_8f92b7c4');
   * ```
   */
  public async getEvents(
    id: string,
  ): Promise<CoffeeMailResponse<EmailEventsResponse>> {
    return this.http.get<EmailEventsResponse>(
      `/v1/product/emails/${id}/events`,
    );
  }

  /**
   * Retorna as tags distintas já usadas em e-mails enviados pela organização.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.emails.getTags();
   * ```
   */
  public async getTags(): Promise<CoffeeMailResponse<ListEmailTagsResponse>> {
    return this.http.get<ListEmailTagsResponse>("/v1/product/emails/tags");
  }

  /**
   * Cancela o envio de um e-mail previamente agendado (`scheduled`).
   * Não retorna corpo na resposta (204 No Content).
   *
   * @example
   * ```typescript
   * const { error } = await coffeemail.emails.cancel('eml_8f92b7c4');
   * ```
   */
  public async cancel(id: string): Promise<CoffeeMailResponse<void>> {
    return this.http.post<void>(`/v1/product/emails/${id}/cancel`);
  }

  /**
   * Reenvia um e-mail existente.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.emails.resend('eml_8f92b7c4');
   * ```
   */
  public async resend(
    id: string,
  ): Promise<CoffeeMailResponse<SendEmailResponse>> {
    return this.http.post<SendEmailResponse>(`/v1/product/emails/${id}/resend`);
  }
}
