import { HttpClient } from "./core/http-client.js";
import { Audiences } from "./resources/audiences.js";
import { Broadcasts } from "./resources/broadcasts.js";
import { Domains } from "./resources/domains.js";
import { Emails } from "./resources/emails.js";
import { Stats } from "./resources/stats.js";
import { Senders } from "./resources/senders.js";
import { Suppressions } from "./resources/suppressions.js";
import { Templates } from "./resources/templates.js";
import { Webhooks } from "./resources/webhooks.js";

import type { CoffeeMailClientOptions } from "./core/types.js";

/**
 * Cliente oficial do CoffeeMail para Node.js e TypeScript.
 *
 * Fornece acesso strongly-typed a todos os recursos da API de Produto:
 * - `emails`: Envio transacional e em lote, consulta de status e cancelamento.
 * - `domains`: Registro e verificação de DNS (SPF, DKIM, DMARC).
 * - `templates`: Gestão de modelos e renderização de prévias.
 * - `audiences`: Listas de contatos e audiências.
 * - `broadcasts`: Campanhas em massa.
 * - `senders`: Remetentes verificados por endereço.
 * - `suppressions`: Gestão de descadastros e bounces.
 * - `webhooks`: Endpoints de eventos e validação criptográfica de assinatura HMAC.
 * - `stats`: Métricas e taxas de entrega.
 *
 * @example
 * ```typescript
 * import { CoffeeMail } from '@coffeemail/node';
 *
 * const coffeemail = new CoffeeMail('cm_live_sua_chave', {
 *   locale: 'pt-BR', // 'pt-BR' (padrão) ou 'en'
 * });
 *
 * const { data, error } = await coffeemail.emails.send({
 *   from: 'contato@seudominio.com.br',
 *   to: 'cliente@gmail.com',
 *   subject: 'Bem-vindo!',
 *   html: '<h1>Olá!</h1>'
 * });
 * ```
 */
export class CoffeeMail {
  private readonly http: HttpClient;

  /**
   * Operações com e-mails transacionais e em lote.
   */
  public readonly emails: Emails;

  /**
   * Gerenciamento e verificação de domínios.
   */
  public readonly domains: Domains;

  /**
   * Modelos de e-mail e renderização de prévia.
   */
  public readonly templates: Templates;

  /**
   * Audiências e listas de contatos.
   */
  public readonly audiences: Audiences;

  /**
   * Campanhas e envios em massa (Broadcasts).
   */
  public readonly broadcasts: Broadcasts;

  /**
   * Lista de supressão (unsubscribes e bounces).
   */
  public readonly senders: Senders;
  public readonly suppressions: Suppressions;

  /**
   * Endpoints de webhook e utilitário de verificação de assinatura HMAC.
   */
  public readonly webhooks: Webhooks;

  /**
   * Estatísticas e métricas de entregabilidade.
   */
  public readonly stats: Stats;

  /**
   * Cria uma nova instância do cliente CoffeeMail.
   *
   * @param apiKey Chave de API de Produto (ex: `cm_live_...`). Se não informada, tenta ler da variável de ambiente `COFFEEMAIL_API_KEY`.
   * @param options Opções adicionais como `locale` ('pt-BR' | 'en') e `timeoutMs`.
   */
  constructor(apiKey?: string, options: CoffeeMailClientOptions = {}) {
    const key =
      apiKey ??
      (typeof process !== "undefined"
        ? process.env?.["COFFEEMAIL_API_KEY"]
        : undefined);

    this.http = new HttpClient(key, options);

    this.emails = new Emails(this.http);
    this.domains = new Domains(this.http);
    this.templates = new Templates(this.http);
    this.audiences = new Audiences(this.http);
    this.broadcasts = new Broadcasts(this.http);
    this.senders = new Senders(this.http);
    this.suppressions = new Suppressions(this.http);
    this.webhooks = new Webhooks(this.http);
    this.stats = new Stats(this.http);
  }

  public introspect(forceRefresh = false) {
    return this.http.introspect(forceRefresh);
  }

  public invalidateApiKeyCache(): void {
    this.http.invalidateIntrospectionCache();
  }
}
