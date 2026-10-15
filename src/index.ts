export const COFFEEMAIL_VERSION = "0.3.0";

export { CoffeeMail } from "./client.js";

export {
  CoffeeMailError,
  ValidationError,
  AuthenticationError,
  PaymentRequiredError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  NetworkError,
  InternalServerError,
  PermissionError,
} from "./core/errors.js";

export type { CoffeeMailErrorContext } from "./core/errors.js";

export type {
  ApiKeyIntrospection,
  ApiKeyPermission,
  CoffeeMailClientOptions,
  CoffeeMailResponse,
} from "./core/types.js";

export type { CoffeeMailLocale } from "./core/i18n/types.js";

export { Emails } from "./resources/emails.js";
export { Domains } from "./resources/domains.js";
export { Templates } from "./resources/templates.js";
export { Audiences, Contacts } from "./resources/audiences.js";
export { Broadcasts } from "./resources/broadcasts.js";
export { Senders } from "./resources/senders.js";
export { Suppressions } from "./resources/suppressions.js";
export { Webhooks } from "./resources/webhooks.js";
export { Stats } from "./resources/stats.js";

export type {
  EmailAddressInput,
  EmailParticipant,
  EmailAttachment,
  EmailTag,
  EmailStatus,
  SendEmailPayload,
  SendEmailResponse,
  BatchSendEmailResult,
  ApiKeyRef,
  EmailDetail,
  ListEmailsQuery,
  ListEmailsResponse,
  EmailTagsSummary,
  ListEmailTagsResponse,
  EmailTimelineEvent,
  EmailEventsResponse,
} from "./types/emails.types.js";

export type {
  DomainDnsRecord,
  DomainSummary,
  DomainDetail,
  ListDomainsResponse,
  CreateDomainPayload,
  CreateDomainResponse,
  DeleteDomainResponse,
  DomainDnsCheck,
  DomainDnsResolution,
  DomainSendingIdentity,
  DomainStatusReason,
  VerifyDomainResponse,
  DomainHealthCheckResult,
  DomainHealthResponse,
  DomainWarmupStatus,
} from "./types/domains.types.js";

export type {
  TemplateFormat,
  TemplateVariable,
  TemplateDetail,
  ListTemplatesQuery,
  ListTemplatesResponse,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  PreviewTemplatePayload,
  PreviewTemplateResponse,
  FormatTemplatePayload,
  FormatTemplateResponse,
  TestRenderTemplatePayload,
  TestRenderTemplateResponse,
  TestSendTemplatePayload,
  TestSendTemplateResponse,
} from "./types/templates.types.js";

export type {
  ContactDetail,
  CreateContactPayload,
  UpdateContactPayload,
  UpdateContactResult,
  ListContactsResponse,
  BulkAddContactInput,
  BulkAddContactsPayload,
  BulkAddContactsResult,
  AudienceDetail,
  ListAudiencesResponse,
  CreateAudiencePayload,
  UpdateAudiencePayload,
  UpdateAudienceResult,
} from "./types/audiences.types.js";

export type {
  BroadcastStatus,
  BroadcastDetail,
  ListBroadcastsResponse,
  ListBroadcastsQuery,
  SendBroadcastResult,
  CancelBroadcastResult,
  CreateBroadcastPayload,
  TestSendBroadcastPayload,
  TestSendBroadcastResult,
} from "./types/broadcasts.types.js";

export type {
  CreateSenderPayload,
  SenderDetail,
  CreatedSenderDetail,
  ListSendersResponse,
  VerifySenderResult,
} from "./types/senders.types.js";

export type {
  SuppressionReason,
  SuppressionSource,
  SuppressionStatus,
  SuppressionDetail,
  ListSuppressionsQuery,
  ListSuppressionsResponse,
  CreateSuppressionPayload,
  BulkCreateSuppressionInput,
  BulkCreateSuppressionsResult,
} from "./types/suppressions.types.js";

export type {
  WebhookEventType,
  WebhookStatus,
  ToggleableWebhookStatus,
  WebhookDetail,
  CreatedWebhookDetail,
  WebhookSummary,
  ListWebhooksResponse,
  ListWebhooksQuery,
  CreateWebhookPayload,
  UpdateWebhookPayload,
  ToggleWebhookPayload,
  ToggleWebhookResult,
  RotateWebhookSecretResult,
  TestWebhookResult,
  WebhookDeliveryStatus,
  WebhookDelivery,
  ListWebhookDeliveriesResponse,
  ListWebhookDeliveriesQuery,
  VerifyWebhookSignatureOptions,
  VerifyWebhookSignatureBase,
  VerifyWebhookSignatureFromHeaders,
  VerifyWebhookSignatureFromValues,
  WebhookRequestHeaders,
} from "./types/webhooks.types.js";

export type {
  GetStatsQuery,
  StatsDataPoint,
  StatsResponse,
} from "./types/stats.types.js";
