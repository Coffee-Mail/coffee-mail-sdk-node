import type { HttpClient } from "../core/http-client.js";
import type { CoffeeMailResponse } from "../core/types.js";
import type {
  CreateDomainPayload,
  CreateDomainResponse,
  DeleteDomainResponse,
  DomainCustomHostStatus,
  DomainDetail,
  DomainDkimRotation,
  DomainHealthResponse,
  DomainWarmupStatus,
  ListDomainsResponse,
  SetTrackingDomainPayload,
  VerifyDomainResponse,
} from "../types/domains.types.js";

/**
 * Recurso de gerenciamento e verificação de domínios na plataforma CoffeeMail.
 */
export class Domains {
  constructor(private readonly http: HttpClient) {}

  /**
   * Adiciona um novo domínio à sua organização e gera as entradas DNS necessárias (SPF, DKIM, DMARC).
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.create({
   *   name: 'empresa.com.br'
   * });
   * if (data) {
   *   console.log('Insira estes registros no seu provedor de DNS:', data.dkimRecordsToPublish);
   * }
   * ```
   */
  public async create(
    payload: CreateDomainPayload,
  ): Promise<CoffeeMailResponse<CreateDomainResponse>> {
    const response = await this.http.post<CreateDomainResponse>(
      "/v1/product/domains",
      payload,
    );
    if (response.error) {
      return response;
    }
    return {
      data: {
        ...response.data,
        createdAt: response.data.createdAt ?? new Date().toISOString(),
      },
      error: null,
    };
  }

  /**
   * Lista todos os domínios pertencentes à organização autenticada.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.list();
   * console.log(data?.domains);
   * ```
   */
  public async list(): Promise<CoffeeMailResponse<ListDomainsResponse>> {
    return this.http.get<ListDomainsResponse>("/v1/product/domains");
  }

  /**
   * Obtém detalhes e entradas DNS pendentes de um domínio específico pelo ID.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.get('dom_123');
   * ```
   */
  public async get(id: string): Promise<CoffeeMailResponse<DomainDetail>> {
    return this.http.get<DomainDetail>(`/v1/product/domains/${id}`);
  }

  /**
   * Dispara a verificação das entradas DNS do domínio nos servidores globais de nomes.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.verify('dom_123');
   * if (data?.status === 'verified') {
   *   console.log('Domínio pronto para envio!');
   * }
   * ```
   */
  public async verify(
    id: string,
  ): Promise<CoffeeMailResponse<VerifyDomainResponse>> {
    return this.http.post<VerifyDomainResponse>(
      `/v1/product/domains/${id}/verify`,
    );
  }

  /**
   * Remove um domínio da organização.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.delete('dom_123');
   * ```
   */
  public async delete(
    id: string,
  ): Promise<CoffeeMailResponse<DeleteDomainResponse>> {
    return this.http.delete<DeleteDomainResponse>(`/v1/product/domains/${id}`);
  }

  /**
   * Executa um diagnóstico em tempo real de SPF/DKIM/DMARC do domínio.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.getHealth('dom_123');
   * ```
   */
  public async getHealth(
    id: string,
  ): Promise<CoffeeMailResponse<DomainHealthResponse>> {
    return this.http.post<DomainHealthResponse>(
      `/v1/product/domains/${id}/health`,
    );
  }

  /**
   * Consulta o progresso do aquecimento (warmup) de IP/domínio.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.getWarmupStatus('dom_123');
   * ```
   */
  public async getWarmupStatus(
    id: string,
  ): Promise<CoffeeMailResponse<DomainWarmupStatus | null>> {
    return this.http.get<DomainWarmupStatus | null>(
      `/v1/product/domains/${id}/warmup`,
    );
  }

  /**
   * Inicia a rotação da chave DKIM do domínio. Idempotente: se já houver uma
   * rotação pendente, devolve a mesma. A chave em uso só muda depois que o
   * registro TXT de `record` for publicado e encontrado no DNS.
   *
   * Retorna `NotFoundError` para domínio inexistente e `ConflictError`
   * (`apiCode` `DOMAIN_NOT_VERIFIED`) quando o domínio ainda não foi verificado.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.rotateDkim('dom_123');
   * if (data) {
   *   console.log('Publique o registro:', data.record);
   * }
   * ```
   */
  public async rotateDkim(
    id: string,
  ): Promise<CoffeeMailResponse<DomainDkimRotation>> {
    return this.http.post<DomainDkimRotation>(
      `/v1/product/domains/${id}/dkim/rotate`,
    );
  }

  /**
   * Cadastra (ou troca) o host de tracking próprio do domínio, usado nos links
   * de abertura e clique. O host passa a valer depois que o CNAME de `record`
   * apontar para `target`.
   *
   * Retorna `ValidationError` (`apiCode` `INVALID_TRACKING_HOST`) para host
   * inválido, `ConflictError` (`apiCode` `TRACKING_DOMAINS_DISABLED`) quando o
   * recurso está desligado na plataforma e `NotFoundError` para domínio inexistente.
   *
   * @example
   * ```typescript
   * const { data, error } = await coffeemail.domains.setTrackingDomain('dom_123', {
   *   host: 'links.empresa.com.br'
   * });
   * ```
   */
  public async setTrackingDomain(
    id: string,
    payload: SetTrackingDomainPayload,
  ): Promise<CoffeeMailResponse<DomainCustomHostStatus>> {
    return this.http.put<DomainCustomHostStatus>(
      `/v1/product/domains/${id}/tracking-domain`,
      payload,
    );
  }

  /**
   * Remove o host de tracking próprio do domínio; os links voltam a usar o
   * host padrão da plataforma. Em caso de sucesso, `data` é `null`.
   *
   * @example
   * ```typescript
   * const { error } = await coffeemail.domains.removeTrackingDomain('dom_123');
   * ```
   */
  public async removeTrackingDomain(
    id: string,
  ): Promise<CoffeeMailResponse<DomainCustomHostStatus | null>> {
    return this.http.delete<DomainCustomHostStatus | null>(
      `/v1/product/domains/${id}/tracking-domain`,
    );
  }
}
