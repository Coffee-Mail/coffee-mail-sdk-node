export type TemplateFormat = "html" | "react";

export interface TemplateVariable {
  readonly name: string;
  readonly type?: "string" | "number" | "color";
  readonly fallbackValue?: string;
  readonly description?: string;
}

/**
 * Modelo de e-mail cadastrado na plataforma.
 */
export interface TemplateDetail {
  readonly id: string;
  readonly organisationId: string;
  readonly name: string;
  readonly alias: string | null;
  readonly subject: string | null;
  readonly preheader: string | null;
  readonly html: string;
  readonly contentJson: Record<string, unknown> | null;
  readonly textPayload: string | null;
  readonly variables: ReadonlyArray<TemplateVariable>;
  readonly isActive: boolean;
  readonly format: TemplateFormat;
  readonly sourceLocale: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ListTemplatesQuery {
  readonly limit?: number;
  readonly after?: string;
}

export interface ListTemplatesResponse {
  readonly templates: ReadonlyArray<TemplateDetail>;
  /**
   * @deprecated Utilize a propriedade padronizada `templates`. Mantido para retrocompatibilidade.
   */
  readonly data: ReadonlyArray<TemplateDetail>;
  readonly nextCursor?: string | null;
}

/**
 * Payload para criar um template na plataforma ou no Playground.
 */
export interface CreateTemplatePayload {
  readonly name: string;
  readonly alias?: string | null;
  readonly subject?: string | null;
  readonly preheader?: string | null;
  readonly html: string;
  readonly contentJson?: Record<string, unknown> | null;
  readonly textPayload?: string | null;
  readonly variables?: ReadonlyArray<TemplateVariable>;
  readonly format?: TemplateFormat;
  readonly sourceLocale?: string;
}

/**
 * Atualização de template — todos os campos são independentes e opcionais.
 */
export interface UpdateTemplatePayload {
  readonly name?: string;
  readonly alias?: string | null;
  readonly subject?: string | null;
  readonly preheader?: string | null;
  readonly html?: string;
  readonly contentJson?: Record<string, unknown> | null;
  readonly textPayload?: string | null;
  readonly variables?: ReadonlyArray<TemplateVariable>;
  readonly format?: TemplateFormat;
  readonly isActive?: boolean;
  readonly sourceLocale?: string;
}

export interface PreviewTemplatePayload {
  readonly html: string;
  readonly format?: TemplateFormat | undefined;
  readonly variables?: Record<string, unknown> | undefined;
}

export interface PreviewTemplateResponse {
  readonly html: string;
  readonly text: string;
}

export interface FormatTemplatePayload {
  readonly html: string;
  readonly format?: TemplateFormat;
}

export interface FormatTemplateResponse {
  readonly html: string;
}

export interface TestRenderTemplatePayload {
  readonly html: string;
  readonly format?: TemplateFormat;
  readonly variables?: Record<string, unknown>;
}

/**
 * Resultado de `testRender()` — igual a `preview()`, mas com o HTML
 * sanitizado (scripts, iframes, links javascript: e handlers de evento
 * inline removidos) e um relatório do que foi removido.
 */
export interface TestRenderTemplateResponse {
  readonly html: string;
  readonly text: string;
  readonly sanitizeReport: {
    readonly scripts: number;
    readonly iframes: number;
    readonly javascriptHrefs: number;
    readonly eventHandlers: number;
  };
}

export interface TestSendTemplatePayload {
  readonly to: string;
  readonly variables?: Record<string, unknown>;
}

export interface TestSendTemplateResponse {
  readonly messageId: string;
  readonly to: string;
  readonly subject: string;
  readonly sentAt: string;
}

export interface ListTemplateVersionsQuery {
  /**
   * Versões por página, de 1 a 100.
   * @default 20
   */
  readonly limit?: number;
  /**
   * Deslocamento da página.
   * @default 0
   */
  readonly offset?: number;
}

/**
 * Resumo de uma versão gravada de um template. `createdBy` é `null` quando a
 * versão foi gerada por uma API key.
 */
export interface TemplateVersionSummary {
  readonly version: number;
  readonly name: string;
  readonly subject: string | null;
  readonly createdBy: string | null;
  readonly createdAt: string;
}

export interface ListTemplateVersionsResponse {
  /**
   * Versões, da mais recente para a mais antiga.
   */
  readonly data: ReadonlyArray<TemplateVersionSummary>;
  readonly total: number;
}

/**
 * Conteúdo completo de uma versão gravada de um template.
 */
export interface TemplateVersionDetail extends TemplateVersionSummary {
  readonly templateId: string;
  readonly preheader: string | null;
  readonly html: string;
  readonly contentJson: Record<string, unknown> | null;
  readonly textPayload: string | null;
  readonly variables: ReadonlyArray<TemplateVariable>;
  readonly format: TemplateFormat;
  readonly sourceLocale: string;
}
