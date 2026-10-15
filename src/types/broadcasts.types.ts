export type BroadcastStatus =
  "draft" | "scheduled" | "sending" | "sent" | "failed" | "cancelled";

/**
 * Uma campanha (broadcast) enviada a uma audiência.
 */
export interface BroadcastDetail {
  readonly id: string;
  readonly audienceId: string;
  readonly audienceName: string | null;
  readonly templateId: string | null;
  readonly subject: string;
  readonly fromEmail: string;
  readonly replyTo: string | null;
  readonly status: BroadcastStatus;
  readonly scheduledAt: string | null;
  readonly sentAt: string | null;
  readonly cancelledAt: string | null;
  readonly recipientsTotal: number;
  readonly recipientsQueued: number;
  readonly recipientsFailed: number;
  readonly metrics?: BroadcastMetrics;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Métricas agregadas de entrega, presentes em `broadcasts.get()`.
 */
export interface BroadcastMetrics {
  readonly delivered: number;
  readonly opened: number;
  readonly clicked: number;
  readonly bounced: number;
  readonly failed: number;
  readonly suppressed: number;
}

export interface ListBroadcastsResponse {
  readonly broadcasts: ReadonlyArray<BroadcastDetail>;
  readonly nextCursor: string | null;
}

export interface ListBroadcastsQuery {
  readonly status?: BroadcastStatus;
  readonly from?: string;
  readonly to?: string;
  readonly after?: string;
  readonly limit?: number;
}

export interface SendBroadcastResult {
  readonly id: string;
  readonly status: BroadcastStatus;
  readonly recipientsTotal: number;
  readonly recipientsQueued: number;
}

export interface CancelBroadcastResult {
  readonly id: string;
  readonly status: BroadcastStatus;
  readonly cancelledAt: string | null;
}

/**
 * Payload para criar uma campanha. É preciso fornecer exatamente um de
 * `templateId` ou `html` (a API rejeita ambos ou nenhum). `subject` é
 * obrigatório apenas quando `html` é usado (templates já têm assunto padrão).
 *
 * `scheduledAt` (ISO 8601, no futuro) agenda o envio: a campanha nasce
 * `scheduled` e é disparada automaticamente no horário.
 */
export type CreateBroadcastPayload =
  | {
      readonly audienceId: string;
      readonly fromEmail: string;
      readonly templateId: string;
      readonly subject?: string;
      readonly replyTo?: string;
      readonly scheduledAt?: string;
      readonly variables?: Record<string, unknown>;
    }
  | {
      readonly audienceId: string;
      readonly fromEmail: string;
      readonly html: string;
      readonly subject: string;
      readonly text?: string;
      readonly replyTo?: string;
      readonly scheduledAt?: string;
      readonly variables?: Record<string, unknown>;
    };

/**
 * Parâmetros de `testSend()`: o destinatário do teste e variáveis opcionais.
 */
export interface TestSendBroadcastPayload {
  readonly to: string;
  readonly variables?: Record<string, unknown>;
}

/**
 * Resultado de `testSend()`.
 */
export interface TestSendBroadcastResult {
  readonly success: boolean;
  readonly messageId: string;
  readonly recipient: string;
}
