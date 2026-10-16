import type { BinaryData } from "../core/types.js";

/**
 * Eventos emitidos pela plataforma CoffeeMail através de webhooks.
 */
export type WebhookEventType =
  | "email.queued"
  | "email.processing"
  | "email.sent"
  | "email.delivered"
  | "email.delivery_delayed"
  | "email.opened"
  | "email.clicked"
  | "email.bounced"
  | "email.complained"
  | "email.failed"
  | "email.suppressed"
  | "email.scheduled"
  | "email.cancelled"
  | "email.unsubscribed"
  | "billing.plan_changed";

/**
 * Situação de um webhook. `disabled` é atribuído pelo sistema (ex: após
 * falhas repetidas) e não pode ser definido diretamente via `toggle()`,
 * que só aceita `active`/`paused`.
 */
export type WebhookStatus = "active" | "paused" | "disabled";

export type ToggleableWebhookStatus = "active" | "paused";

/**
 * Detalhes de um webhook, como retornado por `get()` e `update()`.
 * `secret` é sempre `null` aqui — depois da criação, o segredo completo só é
 * exibido de novo através de `rotateSecret()`. Use `secretPreview` para exibição.
 */
export interface WebhookDetail {
  readonly id: string;
  readonly url: string;
  readonly events: ReadonlyArray<WebhookEventType>;
  readonly status: WebhookStatus;
  readonly description: string | null;
  readonly createdAt: string;
  readonly secret: string | null;
  readonly secretPreview: string | null;
}

/**
 * Detalhe retornado imediatamente após `create()`, com o segredo completo —
 * essa é a única vez que o valor completo é exposto.
 */
export interface CreatedWebhookDetail {
  readonly id: string;
  readonly url: string;
  readonly events: ReadonlyArray<WebhookEventType>;
  readonly status: WebhookStatus;
  readonly description: string | null;
  readonly createdAt: string;
  readonly secret: string;
}

/**
 * Resumo de um webhook, como retornado por `list()`. Não inclui o segredo —
 * apenas um indicador de que um segredo está configurado.
 */
export interface WebhookSummary {
  readonly id: string;
  readonly url: string;
  readonly events: ReadonlyArray<WebhookEventType>;
  readonly status: WebhookStatus;
  readonly description: string | null;
  readonly hasSecret: boolean;
  readonly createdAt: string;
}

export interface ListWebhooksResponse {
  readonly webhooks: ReadonlyArray<WebhookSummary>;
}

export interface ListWebhooksQuery {
  readonly status?: WebhookStatus;
}

export interface CreateWebhookPayload {
  readonly url: string;
  readonly events: ReadonlyArray<WebhookEventType>;
  readonly description?: string;
}

export interface UpdateWebhookPayload {
  readonly url?: string;
  readonly events?: ReadonlyArray<WebhookEventType>;
  readonly description?: string | null;
}

export interface ToggleWebhookPayload {
  readonly status: ToggleableWebhookStatus;
}

export interface ToggleWebhookResult {
  readonly id: string;
  readonly status: ToggleableWebhookStatus;
}

/**
 * Resultado de `rotateSecret()`. O novo segredo é exibido por completo uma
 * única vez — não pode ser recuperado depois.
 */
export interface RotateWebhookSecretResult {
  readonly webhookId: string;
  readonly secret: string;
}

export interface TestWebhookResult {
  readonly status: "success" | "failed";
  readonly statusCode: number | null;
  readonly body: string | null;
  readonly error: string | null;
}

export type WebhookDeliveryStatus =
  "pending" | "success" | "failed" | "exhausted";

export interface WebhookDelivery {
  readonly id: string;
  readonly webhookId: string;
  readonly emailEventId: string | null;
  readonly eventType: string;
  readonly responseStatus: number | null;
  readonly responseBody: string | null;
  readonly attempts: number;
  readonly lastError: string | null;
  readonly status: WebhookDeliveryStatus;
  readonly nextRunAt: string;
  readonly createdAt: string;
}

/**
 * Entrega de webhook com o corpo exato enviado ao endpoint, como retornada por
 * `getDelivery()` e `replayDelivery()`.
 */
export interface WebhookDeliveryDetail extends WebhookDelivery {
  readonly requestPayload: string;
}

export interface ListWebhookDeliveriesResponse {
  readonly deliveries: ReadonlyArray<WebhookDelivery>;
}

export interface ListWebhookDeliveriesQuery {
  readonly eventType?: string;
  readonly status?: WebhookDeliveryStatus;
  readonly from?: string;
  readonly to?: string;
  readonly limit?: number;
}

/**
 * Headers de uma entrega de webhook. Aceita o objeto de headers do Node
 * (`IncomingHttpHeaders`, chaves minúsculas) ou um `Headers` da Fetch API.
 */
export type WebhookRequestHeaders =
  | { readonly get: (name: string) => string | null }
  | Readonly<Record<string, string | ReadonlyArray<string> | undefined>>;

/**
 * Campos comuns às duas formas de verificar uma entrega.
 */
export interface VerifyWebhookSignatureBase {
  /**
   * Corpo bruto da requisição HTTP (string ou Uint8Array), exatamente como
   * recebido. Nunca passe o JSON já parseado e re-serializado.
   *
   * `Buffer` (Node) também é aceito em runtime pois estende `Uint8Array`.
   *
   * @see BinaryData
   */
  readonly payload: BinaryData;
  /**
   * Segredo do webhook (`whsec_...`), devolvido em `create()` e `rotateSecret()`.
   */
  readonly secret: string;
  /**
   * Janela aceita entre o `x-webhook-timestamp` e o relógio local, em segundos.
   * @default 300
   */
  readonly toleranceSeconds?: number;
  /**
   * Relógio usado na checagem da janela, em milissegundos desde a época Unix.
   * Útil em testes.
   * @default Date.now
   */
  readonly now?: () => number;
}

/**
 * Verificação a partir dos headers da requisição recebida.
 */
export interface VerifyWebhookSignatureFromHeaders
  extends VerifyWebhookSignatureBase {
  readonly headers: WebhookRequestHeaders;
}

/**
 * Verificação a partir dos valores dos headers já extraídos.
 */
export interface VerifyWebhookSignatureFromValues
  extends VerifyWebhookSignatureBase {
  /**
   * Valor do header `x-webhook-signature` (`sha256=<hex>`).
   */
  readonly signature: string;
  /**
   * Valor do header `x-webhook-timestamp` (segundos Unix).
   */
  readonly timestamp: string;
  /**
   * Valor do header `x-webhook-idempotency-key`.
   */
  readonly idempotencyKey: string;
}

/**
 * Parâmetros de `verifySignature()`: os headers da requisição ou os valores
 * de assinatura, timestamp e chave de idempotência.
 */
export type VerifyWebhookSignatureOptions =
  | VerifyWebhookSignatureFromHeaders
  | VerifyWebhookSignatureFromValues;
