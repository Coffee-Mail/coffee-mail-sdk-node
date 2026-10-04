<div align="center">

# @coffeemail/node

**SDK oficial do CoffeeMail para Node.js e TypeScript**

[![npm version](https://img.shields.io/npm/v/@coffeemail/node?style=flat-square&color=3178C6)](https://www.npmjs.com/package/@coffeemail/node)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![ESM and CJS](https://img.shields.io/badge/Modules-ESM%20%2B%20CJS-orange?style=flat-square)](https://nodejs.org/api/packages.html)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat-square)](./LICENSE)

[Instalação](#-instalação) · [Início Rápido](#-início-rápido) · [Padrão de Resposta](#-retorno-seguro--data-error-) · [Recursos Cobertos](#-recursos-disponíveis) · [Validação de Webhooks](#-validação-criptográfica-de-webhooks)

</div>

---

## ✨ Visão Geral

O `@coffeemail/node` é a biblioteca cliente oficial para integração com a API de Produto da **CoffeeMail**. Construído para oferecer uma experiência de desenvolvimento (DX) de primeira linha, o SDK possui:

- **Tipagem Estrita de Ponta a Ponta**: Tipos gerados diretamente da especificação OpenAPI da plataforma, sem `any`.
- **Suporte Dual (ESM e CommonJS)**: Compatível com projetos legados e aplicações modernas.
- **Padrão de Retorno Seguro `{ data, error }`**: Elimina a necessidade de blocos `try/catch` para erros esperados da API.
- **Localização em Português do Brasil**: Mensagens de erro e documentação TSDoc formatadas em `pt-BR` por padrão.
- **Introspecção Dinâmica**: Validação automática de chaves e permissões em cache na memória.

---

## 📦 Instalação

```bash
# via pnpm (recomendado)
pnpm add @coffeemail/node

# via npm
npm install @coffeemail/node

# via yarn
yarn add @coffeemail/node
```

---

## 🚀 Início Rápido

```typescript
import { CoffeeMail } from "@coffeemail/node";

// Inicialize informando sua API Key (ou configure COFFEEMAIL_API_KEY no ambiente)
const coffeemail = new CoffeeMail("cm_live_sua_chave_aqui", {
  locale: "pt-BR", // 'pt-BR' (padrão) ou 'en'
});

// Envie um e-mail transacional
const { data, error } = await coffeemail.emails.send({
  from: "contato@seudominio.com.br",
  to: "cliente@exemplo.com.br",
  subject: "Confirmação do Pedido #4521",
  html: "<h1>Obrigado pela sua compra!</h1><p>Seu pedido está em processamento.</p>",
});

if (error) {
  console.error(`Falha no envio [${error.code}]:`, error.message);
  return;
}

console.log("E-mail enfileirado com sucesso! ID:", data.id);
```

---

## 🛡️ Retorno Seguro `{ data, error }`

Todas as operações retornam um envelope padronizado. As falhas são mapeadas em classes de erro fortemente tipadas:

```typescript
const { data, error } = await coffeemail.emails.get("eml_123456");

if (error) {
  // Classes: ValidationError, NotFoundError, RateLimitError, AuthenticationError, etc.
  console.error(`Erro ${error.status} [${error.code}]: ${error.message}`);
  return;
}

console.log("Status da mensagem:", data.status); // 'delivered', 'bounced', etc.
```

---

## 📚 Recursos Disponíveis

### 1. E-mails (`coffeemail.emails`)
- `send(payload)` — Envia um e-mail transacional único
- `sendBatch(items)` — Envia múltiplos e-mails em lote
- `get(id)` — Consulta detalhes e status de entrega
- `list(query)` — Consulta histórico com filtros e paginação
- `getEvents(id)` — Linha do tempo completa de eventos de entrega
- `cancel(id)` — Cancela o envio de um e-mail agendado
- `resend(id)` — Reenvia uma mensagem existente
- `tags(query)` — Lista as tags utilizadas nos envios

### 2. Domínios (`coffeemail.domains`)
- `create(payload)` — Registra um novo domínio de envio
- `list()` — Lista todos os domínios da organização
- `get(id)` — Consulta entradas DNS para configuração (SPF, DKIM, DMARC)
- `verify(id)` — Dispara verificação ativa dos registros DNS nos servidores de nomes
- `getHealth(id)` — Diagnóstico de reputação e entregabilidade do domínio
- `getWarmup(id)` & `updateWarmup(id, payload)` — Gerenciamento do plano de IP warmup
- `delete(id)` — Remove um domínio cadastrado

### 3. Modelos de E-mail (`coffeemail.templates`)
- `create(payload)` — Cadastra novo modelo (HTML ou React Email TSX)
- `list(query)` — Lista templates disponíveis
- `get(id)` & `update(id, payload)` — Consulta e atualiza conteúdo
- `delete(id)` — Remove template
- `preview(payload)` — Renderiza prévia com dados dinâmicos em sandbox
- `format(payload)` — Formata código com Prettier
- `testRender(payload)` — Renderiza e sanitiza o código
- `testSend(id, payload)` — Dispara envio real de teste para um destinatário

### 4. Audiências e Contatos (`coffeemail.audiences`)
- `create(payload)`, `list()`, `get(id)`, `update(id, payload)`, `delete(id)` — Gestão de listas
- Gestão de contatos por sub-recurso (`coffeemail.audiences.contacts`) ou atalhos:
  - `audiences.listContacts(audienceId, query)`
  - `audiences.createContact(audienceId, payload)`
  - `audiences.bulkAddContacts(audienceId, payload)`
  - `audiences.deleteContact(audienceId, contactId)`

### 5. Campanhas em Massa (`coffeemail.broadcasts`)
- `create(payload)` — Cria campanha com agendamento e cabeçalhos RFC 8058
- `list(query)`, `get(id)`, `update(id, payload)`, `delete(id)` — Gestão de campanhas
- `send(id)` — Dispara a campanha para toda a audiência
- `testSend(id, payload)` — Envia uma prévia da campanha para um destinatário de teste
- `cancel(id)` — Cancela uma campanha agendada

### 6. Supressões (`coffeemail.suppressions`)
- `create(payload)` — Adiciona endereço à lista de bloqueio
- `bulkAdd(payload)` — Inclusão de supressões em lote
- `list(query)` & `get(id)` — Consulta histórico de supressões
- `delete(id)` — Remove supressão
- `reactivate(id)` — Reativa e-mail que estava bloqueado por bounce ou descadastro

### 7. Webhooks (`coffeemail.webhooks`)
- `create(payload)`, `list(query)`, `get(id)`, `update(id, payload)`, `delete(id)` — Gestão de endpoints
- `toggle(id, payload)` — Pausa ou reativa um webhook
- `rotateSecret(id)` — Gera nova chave de assinatura HMAC
- `test(id)` — Envia evento de teste para o endpoint cadastrado
- `listDeliveries(id, query)` — Histórico de tentativas de entrega e status codes HTTP

### 8. Métricas e Estatísticas (`coffeemail.stats`)
- `get(query)` — Métricas agregadas por período (taxas de entrega, rejeição, aberturas e cliques)

### 9. Introspecção de Chave de API
- `coffeemail.introspect(forceRefresh?)` — Retorna dados do proprietário da chave, ambiente (`live` ou `test`) e escopos autorizados
- `coffeemail.invalidateApiKeyCache()` — Limpa cache local de introspecção

---

## 🔒 Validação Criptográfica de Webhooks

Para garantir que os eventos recebidos no seu servidor foram realmente enviados pelo CoffeeMail, utilize o método utilitário `Webhooks.verifySignature`:

```typescript
import { Webhooks } from "@coffeemail/node";

// Exemplo em um endpoint Fastify / Express / Next.js API Route:
export async function handleWebhook(req, res) {
  const isValid = Webhooks.verifySignature({
    payload: req.rawBody, // String ou Buffer original do corpo da requisição
    signature: req.headers["x-coffeemail-signature"],
    secret: process.env.COFFEEMAIL_WEBHOOK_SECRET,
  });

  if (!isValid) {
    return res.status(401).json({ error: "Assinatura de webhook inválida" });
  }

  // Prosseguir com o processamento do evento...
}
```

---

## 🛠️ Scripts de Desenvolvimento

```bash
# Compilar Dual ESM + CommonJS
pnpm run build

# Executar verificação de tipos
pnpm run typecheck

# Executar testes automatizados
pnpm run test

# Regenerar tipos a partir do OpenAPI
pnpm run generate:types

# Checar conformidade de código e padrões
pnpm run check:standards
```

---

## 📄 Licença

Software proprietário. Todos os direitos reservados à equipe **CoffeeMail**. Consulte [LICENSE](./LICENSE) para mais detalhes.
