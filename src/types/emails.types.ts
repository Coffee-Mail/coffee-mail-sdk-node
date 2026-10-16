import type { BinaryData } from "../core/types.js";

/**
 * Objeto representando um endereço de e-mail com nome amigável opcional.
 */
export interface EmailParticipant {
  /**
   * Endereço de e-mail (ex: contato@seudominio.com).
   */
  readonly email: string;
  /**
   * Nome de exibição opcional (ex: Suporte CoffeeMail).
   */
  readonly name?: string;
}

/**
 * Tipo unificado para aceitar string pura ("contato@empresa.com") ou objeto detalhado.
 */
export type EmailAddressInput = string | EmailParticipant;

/**
 * Anexo de e-mail.
 */
export interface EmailAttachment {
  /**
   * Nome do arquivo exibido no cliente de e-mail (ex: fatura.pdf).
   */
  readonly filename: string;
  /**
   * Conteúdo do anexo. Aceita string (Base64 ou texto puro) ou `Uint8Array`
   * (que é o supertipo de `Buffer` em Node — então `Buffer` também funciona
   * sem aparecer no `.d.ts`).
   *
   * @see BinaryData
   */
  readonly content: BinaryData;
  /**
   * MIME Type do arquivo (ex: application/pdf, image/png).
   */
  readonly contentType?: string;
  /**
   * Modo de anexação: download convencional ('attachment') ou embutido ('inline').
   */
  readonly disposition?: "attachment" | "inline";
  /**
   * Content-ID para imagens embutidas no corpo HTML (cid:...).
   */
  readonly cid?: string;
}

/**
 * Tag personalizada para rastreamento e segmentação.
 */
export interface EmailTag {
  readonly name: string;
  readonly value: string;
}

export type EmailStatus =
  | "queued"
  | "processing"
  | "sent"
  | "delivered"
  | "bounced"
  | "complained"
  | "failed"
  | "skipped"
  | "scheduled"
  | "cancelled";

/**
 * Parâmetros de entrada para envio de e-mail transacional.
 */
export interface SendEmailPayload {
  /**
   * Endereço do remetente. O domínio deve pertencer à sua organização e estar verificado.
   * Aceita string simples ("nome@dominio.com") ou objeto ({ email: "nome@dominio.com", name: "Empresa" }).
   * @example "contato@seudominio.com.br"
   * @example { email: "suporte@seudominio.com.br", name: "Equipe de Suporte" }
   */
  readonly from: EmailAddressInput;

  /**
   * Destinatário único do e-mail transacional (1-para-1).
   * @example "cliente@gmail.com"
   * @example { email: "cliente@gmail.com", name: "Cliente Exemplo" }
   */
  readonly to: EmailAddressInput;

  /**
   * Destinatários em cópia (CC).
   */
  readonly cc?: EmailAddressInput | ReadonlyArray<EmailAddressInput>;

  /**
   * Destinatários em cópia oculta (BCC).
   */
  readonly bcc?: EmailAddressInput | ReadonlyArray<EmailAddressInput>;

  /**
   * Endereço de resposta quando o cliente clica em "Responder".
   */
  readonly replyTo?: EmailAddressInput;

  /**
   * Assunto do e-mail. Obrigatório quando não há `templateId`.
   * @example "Seu pedido foi confirmado!"
   */
  readonly subject?: string;

  /**
   * Conteúdo em formato HTML.
   * @example "<h1>Olá!</h1><p>Seu código é 123456.</p>"
   */
  readonly html?: string;

  /**
   * Conteúdo alternativo em texto puro (fallback para leitores simples).
   */
  readonly text?: string;

  /**
   * ID ou alias de um modelo pré-cadastrado na plataforma. Não pode ser usado junto com `html`/`text`.
   * @example "boas-vindas"
   */
  readonly templateId?: string;

  /**
   * Variáveis para substituição dinâmica no template (ex: {{ nome }}).
   */
  readonly variables?: Record<string, unknown>;

  /**
   * Data e hora programada para envio futuro (ISO 8601 ou objeto Date).
   */
  readonly scheduledAt?: Date | string;

  /**
   * Cabeçalhos adicionais customizados (Headers MIME).
   */
  readonly headers?: Record<string, string>;

  /**
   * Lista de arquivos anexos.
   */
  readonly attachments?: ReadonlyArray<EmailAttachment>;

  /**
   * Tags para métricas e categorização.
   */
  readonly tags?: ReadonlyArray<EmailTag>;

  /**
   * Chave de idempotência para evitar envios duplicados em caso de retentativa de rede.
   */
  readonly idempotencyKey?: string;

  /**
   * Classifica o e-mail como transacional ou broadcast para fins de supressão/relatórios.
   */
  readonly emailType?: "transactional" | "broadcast";

  /**
   * Categoria de supressão a considerar no envio.
   */
  readonly suppressionCategory?: string;

  /**
   * Metadados livres guardados com o e-mail (não são enviados ao destinatário).
   */
  readonly metadata?: Record<string, unknown>;

  /**
   * Se verdadeiro, o e-mail não é entregue de fato, simulando entrega para testes (sandbox).
   */
  readonly isSandbox?: boolean;
}

/**
 * Resposta de sucesso ao enfileirar um e-mail.
 */
export interface SendEmailResponse {
  readonly id: string;
  readonly status: "queued" | "scheduled";
  readonly queuedAt: string;
}

/**
 * Resultado de um item dentro de um envio em lote (`sendBatch`).
 */
export type BatchSendEmailResult =
  | { readonly ok: true; readonly data: SendEmailResponse }
  | { readonly ok: false; readonly error: string };

export interface ApiKeyRef {
  readonly id: string;
  readonly name: string;
}

/**
 * Detalhes completos de um e-mail já processado ou em andamento.
 */
export interface EmailDetail {
  readonly id: string;
  readonly from: string;
  readonly to: ReadonlyArray<string>;
  readonly cc: ReadonlyArray<string> | null;
  readonly bcc: ReadonlyArray<string> | null;
  readonly subject: string | null;
  readonly status: EmailStatus;
  readonly attempts: number;
  readonly lastError: string | null;
  readonly messageId: string | null;
  readonly createdAt: string;
  readonly scheduledAt: string | null;
  readonly sentAt: string | null;
  readonly deliveredAt: string | null;
  readonly bouncedAt: string | null;
  readonly failedAt: string | null;
  readonly complainedAt: string | null;
  readonly suppressedAt: string | null;
  readonly openedAt: string | null;
  readonly firstClickedAt: string | null;
  readonly openCount: number;
  readonly clickCount: number;
  readonly tags: ReadonlyArray<EmailTag> | null;
  readonly html: string | null;
  readonly text: string | null;
  /**
   * Só aparece na listagem (`list()`), ausente no detalhe (`get()`).
   */
  readonly apiKey?: ApiKeyRef | null;
}

/**
 * Parâmetros de consulta para listagem de e-mails.
 */
export interface ListEmailsQuery {
  /**
   * Filtra por status de envio.
   */
  readonly status?: EmailStatus;
  /**
   * Busca parcial por destinatário em to/cc/bcc.
   */
  readonly recipient?: string;
  /**
   * Filtra por endereço do remetente.
   */
  readonly fromEmail?: string;
  /**
   * Busca parcial no assunto do e-mail.
   */
  readonly subjectContains?: string;
  /**
   * Filtra e-mails enviados por uma API key específica.
   */
  readonly apiKeyId?: string;
  /**
   * Filtra e-mails que possuem esta tag.
   */
  readonly tag?: string;
  /**
   * Data/hora inicial do período de busca (ISO 8601) — NÃO é um endereço de e-mail.
   */
  readonly from?: string;
  /**
   * Data/hora final do período de busca (ISO 8601) — NÃO é um endereço de e-mail.
   */
  readonly to?: string;
  /**
   * Cursor de paginação para buscar os próximos registros.
   */
  readonly after?: string;
  /**
   * Quantidade máxima de e-mails retornados (padrão 50, máximo 100).
   */
  readonly limit?: number;
}

/**
 * Resposta paginada de listagem de e-mails.
 */
export interface ListEmailsResponse {
  readonly emails: ReadonlyArray<EmailDetail>;
  readonly nextCursor: string | null;
}

export interface EmailTagsSummary {
  readonly name: string;
  readonly values: ReadonlyArray<string>;
}

export interface ListEmailTagsResponse {
  readonly tags: ReadonlyArray<EmailTagsSummary>;
}

/**
 * Evento individual da linha do tempo do e-mail.
 */
export interface EmailTimelineEvent {
  readonly type: string;
  readonly timestamp: string;
  readonly metadata?: Record<string, unknown>;
}

export interface EmailEventsResponse {
  readonly id: string;
  readonly events: ReadonlyArray<EmailTimelineEvent>;
}
