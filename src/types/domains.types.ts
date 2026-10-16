/**
 * Registro DNS que o cliente precisa publicar para ativar/verificar um domínio.
 */
export interface DomainDnsRecord {
  readonly type: "TXT" | "CNAME";
  /**
   * Nome do host/subdomínio onde o registro deve ser criado.
   */
  readonly host: string;
  readonly value: string;
  readonly ttl?: number;
  /**
   * Indica se o registro pertence à infraestrutura global da plataforma.
   */
  readonly isInfrastructure?: boolean;
}

/**
 * Rotação de DKIM pendente. A chave em uso só muda quando o registro TXT do
 * novo seletor for encontrado no DNS.
 */
export interface DomainDkimRotation {
  readonly domainId: string;
  /**
   * Seletor DKIM pendente, que passa a valer após a propagação do DNS.
   */
  readonly selector: string;
  readonly startedAt: string;
  /**
   * Registro TXT que precisa ser publicado para concluir a rotação.
   */
  readonly record: DomainDnsRecord;
}

/**
 * Situação de um host próprio (return-path ou tracking) que precisa de um
 * CNAME apontando para a plataforma.
 */
export interface DomainCustomHostStatus {
  /**
   * Host do domínio do cliente que precisa apontar para a plataforma.
   */
  readonly host: string;
  /**
   * Host da plataforma para onde o CNAME deve apontar.
   */
  readonly target: string;
  readonly verified: boolean;
  readonly verifiedAt: string | null;
  /**
   * Registro CNAME a publicar.
   */
  readonly record: DomainDnsRecord;
}

/**
 * Corpo de `setTrackingDomain()`.
 */
export interface SetTrackingDomainPayload {
  /**
   * Subdomínio do domínio de envio usado nos links de abertura e clique.
   */
  readonly host: string;
}

export type DomainStatusReason =
  | "dns_records_missing"
  | "provider_pending"
  | "provider_failed";

export type DomainWarmupState = "warming" | "completed";

export type DomainDnsResolution = "found" | "absent" | "unknown";

/**
 * Situação do domínio no provedor de envio responsável pela assinatura DKIM.
 */
export interface DomainSendingIdentity {
  readonly provider: "aws_ses" | "none";
  readonly state: "not_provisioned" | "pending" | "ready" | "failed";
  readonly lastSyncedAt: string | null;
}

/**
 * Resumo de um domínio, como retornado por `list()`.
 */
export interface DomainSummary {
  readonly id: string;
  readonly name: string;
  readonly status: "pending" | "verified" | "failed";
  readonly statusReason?: DomainStatusReason | null;
  readonly dkimSelector: string;
  readonly dkimPublicKey: string | null;
  readonly verifiedAt: string | null;
  readonly lastCheckAt: string | null;
  readonly createdAt: string;
}

/**
 * Detalhe completo de um domínio, como retornado por `get()`.
 */
export interface DomainDetail {
  readonly id: string;
  readonly name: string;
  readonly status: "pending" | "verified" | "failed";
  readonly statusReason?: DomainStatusReason | null;
  readonly sendingIdentity?: DomainSendingIdentity | null;
  readonly dkimSelector: string;
  readonly dkimPublicKey: string | null;
  readonly verifiedAt: string | null;
  readonly lastCheckAt: string | null;
  readonly createdAt: string;
  /**
   * Registros DNS pendentes que ainda precisam ser publicados no provedor.
   */
  readonly dnsRecordsToPublish: ReadonlyArray<DomainDnsRecord>;
  /**
   * Rotação de DKIM em andamento, ou `null` quando não há rotação pendente.
   */
  readonly dkimRotation?: DomainDkimRotation | null;
  /**
   * Return-path próprio, ou `null` quando a plataforma não oferece return-path.
   */
  readonly returnPath?: DomainCustomHostStatus | null;
  /**
   * Host de tracking próprio, ou `null` quando não há host cadastrado ou o recurso está desligado.
   */
  readonly trackingDomain?: DomainCustomHostStatus | null;
  /**
   * Indica se a plataforma permite cadastrar um host de tracking próprio.
   */
  readonly trackingDomainsAvailable?: boolean;
}

/**
 * Envelope de resposta de `list()`.
 */
export interface ListDomainsResponse {
  readonly domains: ReadonlyArray<DomainSummary>;
}

export interface CreateDomainPayload {
  readonly name: string;
}

/**
 * Resposta de `create()` — não é o mesmo formato de `DomainDetail`.
 */
export interface CreateDomainResponse {
  readonly id: string;
  readonly name: string;
  readonly status: "pending" | "verified" | "failed";
  readonly dkimRecordsToPublish: ReadonlyArray<DomainDnsRecord>;
  readonly createdAt: string;
}

export interface DeleteDomainResponse {
  readonly ok: boolean;
}

export interface DomainDnsCheck {
  readonly ok: boolean;
  readonly resolution?: DomainDnsResolution;
  readonly expected: string;
  readonly got: string | null;
  readonly matches: ReadonlyArray<string>;
}

export interface VerifyDomainResponse {
  readonly id: string;
  readonly name: string;
  readonly status: "pending" | "verified" | "failed";
  readonly statusReason?: DomainStatusReason | null;
  readonly sendingIdentity?: DomainSendingIdentity | null;
  readonly verifiedAt: string | null;
  readonly checks: {
    readonly spf: DomainDnsCheck;
    readonly dkim: DomainDnsCheck;
    readonly dmarc: DomainDnsCheck;
    readonly ownership: DomainDnsCheck;
  };
  readonly requiredChecks: ReadonlyArray<
    "spf" | "dkim" | "dmarc" | "ownership"
  >;
}

export interface DomainHealthCheckResult {
  readonly ok: boolean;
  readonly expected: string;
  readonly got: string | null;
}

/**
 * Diagnóstico de saúde e entregabilidade do domínio.
 */
export interface DomainHealthResponse {
  readonly domainId: string;
  readonly domain: string;
  readonly status: "healthy" | "warning" | "critical";
  readonly spf: DomainHealthCheckResult;
  readonly dkim: DomainHealthCheckResult;
  readonly dmarc: DomainHealthCheckResult;
  readonly checkedAt: string;
}

/**
 * Status de aquecimento (warmup) de IP/domínio. `null` quando o domínio
 * ainda não iniciou o warmup.
 */
export interface DomainWarmupStatus {
  readonly domainId: string;
  /**
   * `warming` enquanto a rampa está ativa; `completed` quando terminou e não há mais limite.
   */
  readonly status?: DomainWarmupState;
  readonly currentDay: number;
  readonly dailyQuota: number;
  readonly sentToday: number;
  readonly remainingToday: number;
  readonly quotaUsedPercent: number;
  readonly lastSendDate: string | null;
  /**
   * Duração total da rampa de aquecimento, em dias.
   */
  readonly totalDays?: number;
  /**
   * Início do aquecimento (verificação do domínio).
   */
  readonly startedAt?: string;
  /**
   * Quando o aquecimento terminou; `null` enquanto está em andamento.
   */
  readonly completedAt?: string | null;
}
