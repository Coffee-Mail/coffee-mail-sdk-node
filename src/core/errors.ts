import { getI18nMessage, type CoffeeMailLocale } from "./i18n/index.js";

export interface ApiErrorPayload {
  readonly error?: {
    readonly code?: string;
    readonly message?: string;
    readonly details?: unknown;
    readonly meta?: unknown;
  };
  readonly message?: string;
  readonly statusCode?: number;
}

/**
 * Metadados da resposta HTTP anexados a todo erro vindo da API.
 */
export interface CoffeeMailErrorContext {
  /**
   * Código original enviado pela API (ex: `PLAN_QUOTA_EXCEEDED`), distinto do
   * código canônico exposto em `code`.
   */
  readonly apiCode?: string | undefined;
  /**
   * Valor do header `x-request-id` da resposta, útil para suporte.
   */
  readonly requestId?: string | undefined;
}

/**
 * Classe base para todos os erros emitidos pelo SDK do CoffeeMail.
 */
export class CoffeeMailError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly apiCode?: string | undefined;
  public readonly requestId?: string | undefined;

  constructor(
    message: string,
    status = 500,
    code = "INTERNAL_ERROR",
    details?: unknown,
    context: CoffeeMailErrorContext = {},
  ) {
    super(message);
    this.name = "CoffeeMailError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.apiCode = context.apiCode;
    this.requestId = context.requestId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Erro disparado quando o payload ou parâmetros enviados falham na validação (HTTP 400).
 */
export class ValidationError extends CoffeeMailError {
  constructor(message: string, details?: unknown, context?: CoffeeMailErrorContext) {
    super(message, 400, "VALIDATION_ERROR", details, context);
    this.name = "ValidationError";
  }
}

/**
 * Erro disparado quando a chave de API é inválida, ausente ou expirou (HTTP 401).
 */
export class AuthenticationError extends CoffeeMailError {
  constructor(message: string, details?: unknown, context?: CoffeeMailErrorContext) {
    super(message, 401, "UNAUTHORIZED", details, context);
    this.name = "AuthenticationError";
  }
}

/**
 * Erro disparado quando o plano do assinante atingiu a cota limite ou necessita de upgrade (HTTP 402).
 */
export class PaymentRequiredError extends CoffeeMailError {
  constructor(message: string, details?: unknown, context?: CoffeeMailErrorContext) {
    super(message, 402, "PAYMENT_REQUIRED", details, context);
    this.name = "PaymentRequiredError";
  }
}

/**
 * Erro disparado quando a chave de API não possui permissão para o recurso solicitado (HTTP 403).
 */
export class ForbiddenError extends CoffeeMailError {
  constructor(message: string, details?: unknown, context?: CoffeeMailErrorContext) {
    super(message, 403, "FORBIDDEN", details, context);
    this.name = "ForbiddenError";
  }
}

/**
 * Erro disparado quando o recurso solicitado (e-mail, domínio, etc.) não foi encontrado (HTTP 404).
 */
export class NotFoundError extends CoffeeMailError {
  constructor(message: string, details?: unknown, context?: CoffeeMailErrorContext) {
    super(message, 404, "NOT_FOUND", details, context);
    this.name = "NotFoundError";
  }
}

/**
 * Erro disparado quando ocorre conflito com recurso já existente, como domínio duplicado (HTTP 409).
 */
export class ConflictError extends CoffeeMailError {
  constructor(message: string, details?: unknown, context?: CoffeeMailErrorContext) {
    super(message, 409, "CONFLICT", details, context);
    this.name = "ConflictError";
  }
}

/**
 * Erro disparado quando a taxa limite de requisições por segundo/minuto foi excedida (HTTP 429).
 */
export class RateLimitError extends CoffeeMailError {
  public readonly retryAfterSeconds?: number | undefined;

  constructor(
    message: string,
    retryAfterSeconds?: number | undefined,
    details?: unknown,
    context?: CoffeeMailErrorContext,
  ) {
    super(message, 429, "RATE_LIMIT_EXCEEDED", details, context);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Erro disparado por falha na camada de rede, DNS ou tempo limite da requisição.
 */
export class NetworkError extends CoffeeMailError {
  constructor(message: string, details?: unknown) {
    super(message, 0, "NETWORK_ERROR", details);
    this.name = "NetworkError";
  }
}

/**
 * Erro interno do servidor (HTTP 500).
 */
export class InternalServerError extends CoffeeMailError {
  constructor(message: string, details?: unknown, context?: CoffeeMailErrorContext) {
    super(message, 500, "INTERNAL_SERVER_ERROR", details, context);
    this.name = "InternalServerError";
  }
}

/**
 * Erro disparado quando a chave de API não tem a permissão exigida pela
 * operação (ex: `full_access` para campanhas). Substitui o `ForbiddenError`
 * nas operações de `broadcasts`.
 */
export class PermissionError extends CoffeeMailError {
  public readonly requiredPermission: string;

  constructor(
    message: string,
    requiredPermission: string,
    details?: unknown,
    context?: CoffeeMailErrorContext,
  ) {
    super(message, 403, "PERMISSION_DENIED", details, context);
    this.name = "PermissionError";
    this.requiredPermission = requiredPermission;
  }
}
type ErrorFactory = (
  message: string,
  details: unknown,
  context: CoffeeMailErrorContext,
) => CoffeeMailError;

const errorFactoriesByStatus: Readonly<Record<number, ErrorFactory>> = {
  400: (message, details, context) => new ValidationError(message, details, context),
  401: (message, details, context) => new AuthenticationError(message, details, context),
  402: (message, details, context) => new PaymentRequiredError(message, details, context),
  403: (message, details, context) => new ForbiddenError(message, details, context),
  404: (message, details, context) => new NotFoundError(message, details, context),
  409: (message, details, context) => new ConflictError(message, details, context),
  500: (message, details, context) => new InternalServerError(message, details, context),
  502: (message, details, context) => new InternalServerError(message, details, context),
  503: (message, details, context) => new InternalServerError(message, details, context),
  504: (message, details, context) => new InternalServerError(message, details, context),
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Une `error.meta` e `error.details` da resposta da API num único objeto,
 * com `details` prevalecendo em chaves repetidas.
 */
export const mergeErrorDetails = (meta: unknown, details: unknown): unknown => {
  if (isRecord(meta) && isRecord(details)) {
    return { ...meta, ...details };
  }
  return details ?? meta;
};

/**
 * Metadados da resposta HTTP usados para montar o erro.
 */
export interface ErrorResponseMetadata {
  readonly retryAfterSeconds?: number | undefined;
  readonly requestId?: string | undefined;
}

export const createErrorFromResponse = (
  status: number,
  payload: unknown,
  locale: CoffeeMailLocale,
  metadata: ErrorResponseMetadata = {},
): CoffeeMailError => {
  const errPayload = (
    payload && typeof payload === "object" ? payload : {}
  ) as ApiErrorPayload;
  const message =
    errPayload.error?.message ||
    errPayload.message ||
    getI18nMessage("unexpectedError", locale);
  const apiCode = errPayload.error?.code || undefined;
  const details = mergeErrorDetails(errPayload.error?.meta, errPayload.error?.details);
  const context: CoffeeMailErrorContext = { apiCode, requestId: metadata.requestId };

  if (status === 429) {
    return new RateLimitError(message, metadata.retryAfterSeconds, details, context);
  }

  const factory = errorFactoriesByStatus[status];
  if (factory) {
    return factory(message, details, context);
  }

  return new CoffeeMailError(message, status, apiCode ?? "API_ERROR", details, context);
};
