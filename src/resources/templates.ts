import { toQueryParams } from "../core/query.js";
import type { HttpClient } from "../core/http-client.js";
import type { CoffeeMailResponse } from "../core/types.js";
import type {
  CreateTemplatePayload,
  FormatTemplatePayload,
  FormatTemplateResponse,
  ListTemplateVersionsQuery,
  ListTemplateVersionsResponse,
  ListTemplatesQuery,
  ListTemplatesResponse,
  PreviewTemplatePayload,
  PreviewTemplateResponse,
  TemplateDetail,
  TemplateVersionDetail,
  TestRenderTemplatePayload,
  TestRenderTemplateResponse,
  TestSendTemplatePayload,
  TestSendTemplateResponse,
  UpdateTemplatePayload,
} from "../types/templates.types.js";

export class Templates {
  constructor(private readonly http: HttpClient) {}

  public async create(
    payload: CreateTemplatePayload,
  ): Promise<CoffeeMailResponse<TemplateDetail>> {
    return this.http.post<TemplateDetail>("/v1/product/templates", payload);
  }

  public async list(
    query?: ListTemplatesQuery,
  ): Promise<CoffeeMailResponse<ListTemplatesResponse>> {
    const response = await this.http.get<{
      readonly data?: ReadonlyArray<TemplateDetail>;
      readonly templates?: ReadonlyArray<TemplateDetail>;
    }>("/v1/product/templates", toQueryParams(query));

    if (response.error) {
      return response;
    }

    const items = response.data.templates ?? response.data.data ?? [];
    return {
      data: {
        templates: items,
        data: items,
      },
      error: null,
    };
  }

  public async get(id: string): Promise<CoffeeMailResponse<TemplateDetail>> {
    return this.http.get<TemplateDetail>(`/v1/product/templates/${id}`);
  }

  public async update(
    id: string,
    payload: UpdateTemplatePayload,
  ): Promise<CoffeeMailResponse<TemplateDetail>> {
    return this.http.patch<TemplateDetail>(
      `/v1/product/templates/${id}`,
      payload,
    );
  }

  /**
   * Remove um template definitivamente. Não retorna corpo na resposta (204 No Content).
   */
  public async delete(id: string): Promise<CoffeeMailResponse<void>> {
    return this.http.delete<void>(`/v1/product/templates/${id}`);
  }

  /**
   * Renderiza HTML/JSX com variáveis, sem persistir nada. Não sanitiza o HTML
   * resultante — para conteúdo não confiável, use `testRender()`.
   */
  public async preview(
    payload: PreviewTemplatePayload,
  ): Promise<CoffeeMailResponse<PreviewTemplateResponse>> {
    return this.http.post<PreviewTemplateResponse>(
      "/v1/product/templates/preview",
      payload,
    );
  }

  /**
   * Renderiza a pré-visualização de um template existente a partir do seu ID.
   */
  public async previewById(
    templateId: string,
    variables?: Record<string, unknown>,
  ): Promise<CoffeeMailResponse<PreviewTemplateResponse>> {
    const templateResult = await this.get(templateId);
    if (templateResult.error) {
      return templateResult;
    }

    const payload: PreviewTemplatePayload = {
      html: templateResult.data.html,
      ...(templateResult.data.format !== undefined ? { format: templateResult.data.format } : {}),
      ...(variables !== undefined ? { variables } : {}),
    };

    return this.preview(payload);
  }

  /**
   * Formata o código-fonte de um template (HTML ou JSX) via Prettier, sem persistir nada.
   */
  public async format(
    payload: FormatTemplatePayload,
  ): Promise<CoffeeMailResponse<FormatTemplateResponse>> {
    return this.http.post<FormatTemplateResponse>(
      "/v1/product/templates/format",
      payload,
    );
  }

  /**
   * Renderiza com variáveis e sanitiza o HTML resultante (remove scripts,
   * iframes, links javascript: e handlers de evento inline).
   */
  public async testRender(
    payload: TestRenderTemplatePayload,
  ): Promise<CoffeeMailResponse<TestRenderTemplateResponse>> {
    return this.http.post<TestRenderTemplateResponse>(
      "/v1/product/templates/test-render",
      payload,
    );
  }

  /**
   * Dispara um e-mail de teste real usando o template cadastrado, mesclando
   * as variáveis informadas com os valores de fallback.
   */
  public async testSend(
    id: string,
    payload: TestSendTemplatePayload,
  ): Promise<CoffeeMailResponse<TestSendTemplateResponse>> {
    return this.http.post<TestSendTemplateResponse>(
      `/v1/product/templates/${id}/test-send`,
      payload,
    );
  }

  /**
   * Lista as versões gravadas de um template, da mais recente para a mais antiga.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.templates.listVersions('tpl_123', { limit: 10 });
   * console.log(data?.total, data?.data[0]?.version);
   * ```
   */
  public async listVersions(
    id: string,
    query?: ListTemplateVersionsQuery,
  ): Promise<CoffeeMailResponse<ListTemplateVersionsResponse>> {
    return this.http.get<ListTemplateVersionsResponse>(
      `/v1/product/templates/${id}/versions`,
      toQueryParams(query),
    );
  }

  /**
   * Obtém o conteúdo completo de uma versão gravada do template.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.templates.getVersion('tpl_123', 3);
   * ```
   */
  public async getVersion(
    id: string,
    version: number,
  ): Promise<CoffeeMailResponse<TemplateVersionDetail>> {
    return this.http.get<TemplateVersionDetail>(
      `/v1/product/templates/${id}/versions/${version}`,
    );
  }

  /**
   * Restaura o template para o conteúdo de uma versão gravada e devolve o
   * template atualizado.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.templates.restoreVersion('tpl_123', 3);
   * ```
   */
  public async restoreVersion(
    id: string,
    version: number,
  ): Promise<CoffeeMailResponse<TemplateDetail>> {
    return this.http.post<TemplateDetail>(
      `/v1/product/templates/${id}/versions/${version}/restore`,
    );
  }
}
