# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui. O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado

- `broadcasts.create()` aceita `scheduledAt` (ISO 8601, no futuro): a campanha nasce `scheduled` e é disparada automaticamente no horário.
- `broadcasts.get()` expõe `metrics` (entregues, abertos, cliques, bounces, falhas e suprimidos); tipo `BroadcastMetrics` exportado.
- `senders.resendVerification(id)` reenvia o e-mail de verificação com um token novo.
- `ContactDetail.subscribed`: `false` quando o contato se descadastrou dos broadcasts.
- `domains.rotateDkim(id)` inicia a rotação da chave DKIM (idempotente) e devolve `DomainDkimRotation` (`domainId`, `selector`, `startedAt`, `record`). Domínio não verificado responde `ConflictError` com `apiCode` `DOMAIN_NOT_VERIFIED`.
- `domains.setTrackingDomain(id, { host })` e `domains.removeTrackingDomain(id)` cadastram e removem o host de tracking próprio; respondem `DomainCustomHostStatus` (`host`, `target`, `verified`, `verifiedAt`, `record`). Erros: `ValidationError` (`INVALID_TRACKING_HOST`) e `ConflictError` (`TRACKING_DOMAINS_DISABLED`).
- `domains.get()` expõe `dkimRotation`, `returnPath`, `trackingDomain` e `trackingDomainsAvailable`.
- `domains.getWarmupStatus()` expõe `status` (`warming` | `completed`), `totalDays`, `startedAt` e `completedAt`.
- `DomainDnsRecord.isInfrastructure`. Tipos `DomainDkimRotation`, `DomainCustomHostStatus`, `DomainWarmupState` e `SetTrackingDomainPayload` exportados e conferidos em tempo de compilação contra o OpenAPI da API.
- `templates.listVersions(id, { limit?, offset? })`, `templates.getVersion(id, version)` e `templates.restoreVersion(id, version)`: histórico de versões do template, conteúdo de uma versão e restauração (devolve o template). Versão inexistente responde `NotFoundError` com `apiCode` `TEMPLATE_VERSION_NOT_FOUND`. Tipos `ListTemplateVersionsQuery`, `ListTemplateVersionsResponse`, `TemplateVersionSummary` e `TemplateVersionDetail` exportados.
- Recurso `validation` com `validate(emails)`: valida de 1 a 100 endereços (formato, MX, descartável) e devolve o saldo de créditos do mês. Créditos esgotados respondem `RateLimitError` com `apiCode` `VALIDATION_CREDITS_EXHAUSTED`, que não deve ser repetido. Tipos `ValidateEmailsResponse`, `EmailValidationItem` e `EmailValidationCredits` exportados.
- `webhooks.getDelivery(id, deliveryId)` devolve a entrega com o corpo enviado (`requestPayload`) e `webhooks.replayDelivery(id, deliveryId)` reenvia a entrega, devolvendo a nova (`status: "pending"`). Erros: `NotFoundError` (`WEBHOOK_NOT_FOUND`, `WEBHOOK_DELIVERY_NOT_FOUND`) e `ConflictError` (`WEBHOOK_DELIVERY_PENDING`, `WEBHOOK_NOT_ACTIVE`). Tipo `WebhookDeliveryDetail` exportado.
- `templateId` em `emails.send()` e `emails.sendBatch()` aceita o id ou o alias do template.

### Alterado

- `broadcasts.send()` passa a responder assim que o envio é enfileirado (`status: "sending"`, `recipientsQueued: 0`); o progresso acompanha-se por `broadcasts.get()`.

### Depreciado

- `CreatedSenderDetail.verificationToken`: a API não devolve mais o token na resposta de `senders.create()`; a verificação acontece pelo link enviado ao e-mail do remetente. O campo continua no tipo, agora opcional.

### Corrigido

- `pnpm generate:types` aceita caminho local em `COFFEEMAIL_OPENAPI_SPEC` (antes o caminho era tratado como conteúdo do spec).

## [0.3.0] - Não publicado

Correções de contrato com a API. Como o SDK ainda não tinha usuários ativos, os comportamentos errados foram corrigidos diretamente, sem camada de depreciação.

### Corrigido

- **`webhooks.verifySignature` valida as entregas reais da API.** A assinatura é `sha256=` + HMAC-SHA256 de `timestamp + "." + idempotencyKey + "." + corpoBruto`, comparada em tempo constante e com janela de tolerância de 300 segundos. O método passa a exigir `headers` (objeto do Node ou `Headers` da Fetch API) ou `signature` + `timestamp` + `idempotencyKey`, e aceita `toleranceSeconds` e `now`. Validado com os vetores de teste compartilhados entre os SDKs.
- `emails.send()` e `emails.sendBatch()` enviam `emailType` e `suppressionCategory`, antes descartados em silêncio.
- `error.details` une `error.meta` e `error.details` da resposta da API (antes chegava vazio).

### Adicionado

- `emails.send()` aceita `metadata`.
- `CoffeeMailError.apiCode` (código original da API, ex.: `PLAN_QUOTA_EXCEEDED`) e `CoffeeMailError.requestId` (header `x-request-id`). O tipo `CoffeeMailErrorContext` é exportado.
- Tipos `CreateSenderPayload`, `SenderDetail`, `CreatedSenderDetail`, `ListSendersResponse`, `VerifySenderResult`, `BulkCreateSuppressionInput`, `BulkCreateSuppressionsResult`, `TestSendBroadcastPayload` e `TestSendBroadcastResult`, conferidos em tempo de compilação contra o OpenAPI da API.
- Tipos `VerifyWebhookSignatureBase`, `VerifyWebhookSignatureFromHeaders`, `VerifyWebhookSignatureFromValues` e `WebhookRequestHeaders`.

### Alterado (incompatível)

- `VerifyWebhookSignatureOptions` não aceita mais só `{ payload, signature, secret }`: inclua os headers da entrega ou `timestamp` e `idempotencyKey`. Assinaturas calculadas pelo algoritmo antigo passam a ser rejeitadas.
- `senders.*`, `suppressions.bulkCreate()` e `broadcasts.testSend()` retornam tipos do contrato em vez de `unknown`. `senders.create()` aceita `displayName` opcional; `senders.delete()` retorna `CoffeeMailResponse<void>`; `broadcasts.testSend()` recebe `{ to, variables? }`; `suppressions.bulkCreate()` recebe `{ email, reason? }[]`.
- `PermissionError.status` passa de `0` para `403`; `details` passa a ser os detalhes da API mais `operation`, em vez de `{ operation, details }`.
- Construtores das classes de erro ganham o parâmetro final `context` (`apiCode`, `requestId`); `createErrorFromResponse` recebe `{ retryAfterSeconds, requestId }` no lugar de `retryAfterSeconds`.
