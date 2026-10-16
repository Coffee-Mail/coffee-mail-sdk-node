import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "../../core/http-client.js";
import {
  AuthenticationError,
  RateLimitError,
  ValidationError,
} from "../../core/errors.js";
import { Validation } from "../validation.js";

const URL_VALIDATE = "https://api.coffeemail.com.br/v1/product/validate";

const jsonResponse = (body: unknown, status = 200, headers?: Record<string, string>) => ({
  ok: status < 400,
  status,
  headers: new Headers(headers),
  text: async () => JSON.stringify(body),
});

const validationResult = {
  items: [
    { email: "ana@empresa.com.br", formatValid: true, mxValid: true, isDisposable: false },
    {
      email: "teste@mailinator.com",
      formatValid: true,
      mxValid: true,
      isDisposable: true,
      reason: "disposable",
    },
  ],
  validCount: 1,
  invalidCount: 1,
  credits: { limit: 1000, used: 12, remaining: 988 },
};

describe("Validation", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let validation: Validation;

  beforeEach(() => {
    mockFetch = vi.fn();
    validation = new Validation(new HttpClient("cm_live_teste123", { fetch: mockFetch }));
  });

  it("faz POST em /validate com { emails } e devolve itens, contagens e créditos", async () => {
    mockFetch.mockResolvedValue(jsonResponse(validationResult));

    const { data, error } = await validation.validate([
      "ana@empresa.com.br",
      "teste@mailinator.com",
    ]);

    expect(error).toBeNull();
    expect(data).toEqual(validationResult);
    expect(data?.items[1]?.reason).toBe("disposable");
    expect(data?.items[0]?.reason).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      URL_VALIDATE,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ emails: ["ana@empresa.com.br", "teste@mailinator.com"] }),
      }),
    );
  });

  it("aceita créditos ilimitados (limit e remaining nulos)", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse({
        ...validationResult,
        credits: { limit: null, used: 40, remaining: null },
      }),
    );

    const { data } = await validation.validate(["ana@empresa.com.br"]);

    expect(data?.credits).toEqual({ limit: null, used: 40, remaining: null });
  });

  it("devolve RateLimitError com apiCode VALIDATION_CREDITS_EXHAUSTED sem repetir a requisição", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "VALIDATION_CREDITS_EXHAUSTED",
            message: "Créditos de validação do mês esgotados",
          },
        },
        429,
        { "retry-after": "60" },
      ),
    );

    const { data, error } = await validation.validate(["ana@empresa.com.br"]);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(RateLimitError);
    expect(error?.status).toBe(429);
    expect(error?.apiCode).toBe("VALIDATION_CREDITS_EXHAUSTED");
    expect(error?.message).toBe("Créditos de validação do mês esgotados");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("devolve ValidationError quando a lista é rejeitada pela API", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Dados inválidos",
            meta: { issues: [{ path: "emails", message: "Mínimo de 1 item" }] },
          },
        },
        400,
      ),
    );

    const { error } = await validation.validate([]);

    expect(error).toBeInstanceOf(ValidationError);
    expect(error?.details).toEqual({
      issues: [{ path: "emails", message: "Mínimo de 1 item" }],
    });
    expect(mockFetch).toHaveBeenCalledWith(
      URL_VALIDATE,
      expect.objectContaining({ body: JSON.stringify({ emails: [] }) }),
    );
  });

  it("devolve AuthenticationError sem API key válida", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: { code: "UNAUTHENTICATED" } }, 401));

    const { error } = await validation.validate(["ana@empresa.com.br"]);

    expect(error).toBeInstanceOf(AuthenticationError);
  });
});
