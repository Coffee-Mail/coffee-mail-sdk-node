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
}

export type DomainStatusReason =
  | "dns_records_missing"
  | "provider_pending"
  | "provider_failed";

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
  readonly currentDay: number;
  readonly dailyQuota: number;
  readonly sentToday: number;
  readonly remainingToday: number;
  readonly quotaUsedPercent: number;
  readonly lastSendDate: string | null;
}
