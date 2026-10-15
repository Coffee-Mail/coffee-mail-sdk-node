# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui. O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

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
