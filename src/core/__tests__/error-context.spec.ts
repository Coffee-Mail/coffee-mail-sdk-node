import { describe, expect, it, vi } from "vitest";

import { CoffeeMailError, PermissionError, RateLimitError, ValidationError } from "../errors.js";
import { HttpClient } from "../http-client.js";
import { Broadcasts } from "../../resources/broadcasts.js";

const errorResponse = (
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
) => ({
  ok: false,
  status,
  headers: new Headers(headers),
  text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
});

const clientWith = (response: unknown): HttpClient =>
  new HttpClient("cm_test_123", { fetch: vi.fn().mockResolvedValue(response) });

describe("contexto dos erros da API", () => {
  it("expõe apiCode, requestId e details com meta e details unidos", async () => {
    const client = clientWith(
      errorResponse(
        400,
        {
          error: {
            code: "VALIDATION_FAILED",
            message: "Payload inválido",
            meta: { issues: [{ path: "to", message: "obrigatório" }] },
            details: { campo: "to" },
          },
        },
        { "x-request-id": "req_abc" },
      ),
    );

    const { error } = await client.get("/v1/product/emails");

    expect(error).toBeInstanceOf(ValidationError);
    expect(error?.code).toBe("VALIDATION_ERROR");
    expect(error?.apiCode).toBe("VALIDATION_FAILED");
    expect(error?.requestId).toBe("req_abc");
    expect(error?.details).toEqual({ issues: [{ path: "to", message: "obrigatório" }], campo: "to" });
  });

  it("distingue cota do plano de limite de requisições no 429 pelo apiCode", async () => {
    const client = clientWith(
      errorResponse(429, { error: { code: "PLAN_QUOTA_EXCEEDED", message: "Cota esgotada" } }, { "retry-after": "60" }),
    );

    const { error } = await client.post("/v1/product/emails", {});

    expect(error).toBeInstanceOf(RateLimitError);
    expect(error?.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(error?.apiCode).toBe("PLAN_QUOTA_EXCEEDED");
    expect((error as RateLimitError).retryAfterSeconds).toBe(60);
  });

  it("usa o código da API em status sem classe e deixa os campos vazios quando ausentes", async () => {
    const withCode = clientWith(errorResponse(422, { error: { code: "INVALID_FROM_DOMAIN", message: "x" } }));
    const withoutCode = clientWith(errorResponse(418, "<html>teapot</html>"));

    const coded = await withCode.get("/v1/product/emails");
    const bare = await withoutCode.get("/v1/product/emails");

    expect(coded.error).toBeInstanceOf(CoffeeMailError);
    expect(coded.error?.code).toBe("INVALID_FROM_DOMAIN");
    expect(bare.error?.code).toBe("API_ERROR");
    expect(bare.error?.apiCode).toBeUndefined();
    expect(bare.error?.requestId).toBeUndefined();
    expect(bare.error?.message).toBe("<html>teapot</html>");
  });

  it("mantém apiCode, requestId e details ao remapear o 403 de broadcasts", async () => {
    const client = clientWith(
      errorResponse(
        403,
        { error: { code: "FORBIDDEN", message: "proibido", details: { scope: "sending_access" } } },
        { "x-request-id": "req_403" },
      ),
    );

    const { error } = await new Broadcasts(client).cancel("bcast_1");

    expect(error).toBeInstanceOf(PermissionError);
    expect(error?.status).toBe(403);
    expect(error?.apiCode).toBe("FORBIDDEN");
    expect(error?.requestId).toBe("req_403");
    expect(error?.details).toEqual({ scope: "sending_access", operation: "broadcasts.cancel" });
  });
});
