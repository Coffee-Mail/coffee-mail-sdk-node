/**
 * Checagem em tempo de compilação: garante que os tipos de resposta
 * escritos à mão em src/types/*.ts continuam compatíveis com o que a API
 * real promete no spec gerado (openapi.d.ts). Não existe código em runtime
 * aqui — é puramente `tsc --noEmit` (já parte de `npm run typecheck`/CI).
 *
 * Para RESPONSES a checagem é estrutural. Para REQUESTS checamos apenas as
 * CHAVES que vão para a rede, não seus tipos: o payload de entrada do SDK é
 * deliberadamente mais ergonômico que o formato de rede (anexos aceitam
 * `Uint8Array` e viajam como base64), então comparar tipos geraria alarme
 * falso. Comparar chaves pega o drift real — um campo que o SDK envia e a
 * API não conhece.
 *
 * Direção do check: o que a API promete (`ApiType`) precisa satisfazer o que
 * o SDK promete ao consumidor (`OurType`) — se a API deixar de entregar um
 * campo que documentamos, isso quebra aqui. Campos extras na API não quebram
 * (são apenas ignorados pelo tipo do SDK).
 *
 * Se um destes `Assert<...>` falhar, NÃO relaxe o tipo do SDK sem entender
 * por quê — normalmente significa que o schema real mudou e o types/*.ts
 * correspondente precisa ser atualizado.
 */
import type { paths } from "./openapi.js";
import type { AudienceDetail } from "../types/audiences.types.js";
import type {
  BroadcastDetail,
  TestSendBroadcastResult,
} from "../types/broadcasts.types.js";
import type { DomainDetail } from "../types/domains.types.js";
import type { EmailDetail } from "../types/emails.types.js";
import type { StatsResponse } from "../types/stats.types.js";
import type {
  BulkCreateSuppressionsResult,
  SuppressionDetail,
} from "../types/suppressions.types.js";
import type {
  CreatedSenderDetail,
  ListSendersResponse,
  VerifySenderResult,
} from "../types/senders.types.js";
import type { TemplateDetail } from "../types/templates.types.js";
import type { WebhookDetail } from "../types/webhooks.types.js";

type Assert<T extends true> = T;
type Extends<A, B> = A extends B ? true : false;

type Json200<
  Path extends keyof paths,
  Method extends keyof paths[Path],
> = paths[Path][Method] extends {
  responses: { 200: { content: { "application/json": infer R } } };
}
  ? R
  : never;

export type _CheckEmailDetail = Assert<
  Extends<Json200<"/v1/product/emails/{id}", "get">, EmailDetail>
>;
export type _CheckDomainDetail = Assert<
  Extends<Json200<"/v1/product/domains/{id}", "get">, DomainDetail>
>;
export type _CheckTemplateDetail = Assert<
  Extends<Json200<"/v1/product/templates/{id}", "get">, TemplateDetail>
>;
export type _CheckAudienceDetail = Assert<
  Extends<Json200<"/v1/product/audiences/{id}", "get">, AudienceDetail>
>;
export type _CheckBroadcastDetail = Assert<
  Extends<Json200<"/v1/product/broadcasts/{id}", "get">, BroadcastDetail>
>;
export type _CheckWebhookDetail = Assert<
  Extends<Json200<"/v1/product/webhooks/{id}", "get">, WebhookDetail>
>;
export type _CheckSuppressionDetail = Assert<
  Extends<Json200<"/v1/product/suppressions/{id}", "get">, SuppressionDetail>
>;
export type _CheckStatsResponse = Assert<
  Extends<Json200<"/v1/product/stats", "get">, StatsResponse>
>;

type Json201<
  Path extends keyof paths,
  Method extends keyof paths[Path],
> = paths[Path][Method] extends {
  responses: { 201: { content: { "application/json": infer R } } };
}
  ? R
  : never;

export type _CheckCreatedSender = Assert<
  Extends<Json201<"/v1/product/senders", "post">, CreatedSenderDetail>
>;
export type _CheckListSenders = Assert<
  Extends<Json200<"/v1/product/senders", "get">, ListSendersResponse>
>;
export type _CheckVerifySender = Assert<
  Extends<Json200<"/v1/product/senders/verify", "post">, VerifySenderResult>
>;
export type _CheckBulkCreateSuppressions = Assert<
  Extends<Json200<"/v1/product/suppressions/bulk", "post">, BulkCreateSuppressionsResult>
>;
export type _CheckTestSendBroadcast = Assert<
  Extends<Json200<"/v1/product/broadcasts/{id}/test-send", "post">, TestSendBroadcastResult>
>;

type JsonRequestBody<
  Path extends keyof paths,
  Method extends keyof paths[Path],
> = paths[Path][Method] extends {
  requestBody: { content: { "application/json": infer B } };
}
  ? B
  : never;

export type SendEmailWireBodyKey = keyof JsonRequestBody<"/v1/product/emails", "post">;

export type CreateBroadcastWireBodyKey = keyof JsonRequestBody<
  "/v1/product/broadcasts",
  "post"
>;
