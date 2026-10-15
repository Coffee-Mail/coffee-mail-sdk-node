import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "../../core/http-client.js";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../core/errors.js";
import { Domains } from "../domains.js";
import { Webhooks } from "../webhooks.js";

describe("Domains & Webhooks", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let client: HttpClient;
  let domains: Domains;
  let webhooks: Webhooks;

  const jsonResponse = (body: unknown, status = 200) => ({
    ok: status < 400,
    status,
    text: async () => JSON.stringify(body),
  });

  beforeEach(() => {
    mockFetch = vi.fn();
    client = new HttpClient("cm_live_teste123", { fetch: mockFetch });
    domains = new Domains(client);
    webhooks = new Webhooks(client);
  });

  describe("Domains", () => {
    it("deve disparar verificação de domínio com URL correta", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            id: "dom_123",
            name: "empresa.com.br",
            status: "verified",
            checks: {
              spf: { ok: true },
              dkim: { ok: true },
              dmarc: { ok: true },
              ownership: { ok: true },
            },
          }),
      });

      const { data, error } = await domains.verify("dom_123");

      expect(error).toBeNull();
      expect(data?.status).toBe("verified");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/domains/dom_123/verify",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("deve criar um domínio com URL e método POST corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          id: "dom_novo",
          name: "nova-empresa.com.br",
          status: "pending",
          dkimRecordsToPublish: [
            {
              type: "TXT",
              host: "coffeemail._domainkey.nova-empresa.com.br",
              value: "v=DKIM1; k=rsa; p=abc123",
              ttl: 3600,
            },
          ],
        }),
      );

      const { data, error } = await domains.create({
        name: "nova-empresa.com.br",
      });

      expect(error).toBeNull();
      expect(data?.id).toBe("dom_novo");
      expect(data?.status).toBe("pending");
      expect(data?.dkimRecordsToPublish).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/domains",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "nova-empresa.com.br" }),
        }),
      );
    });

    it("deve retornar ValidationError ao criar domínio com nome inválido", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Nome de domínio inválido",
            },
          },
          400,
        ),
      );

      const { data, error } = await domains.create({ name: "não-e-dominio" });

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(ValidationError);
      expect(error?.status).toBe(400);
    });

    it("deve listar domínios com URL e método GET corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          domains: [
            {
              id: "dom_123",
              name: "empresa.com.br",
              status: "verified",
              dkimSelector: "coffeemail",
              dkimPublicKey: "chave_publica",
              verifiedAt: "2026-01-01T00:00:00.000Z",
              lastCheckAt: "2026-01-01T00:00:00.000Z",
              createdAt: "2025-12-01T00:00:00.000Z",
            },
          ],
        }),
      );

      const { data, error } = await domains.list();

      expect(error).toBeNull();
      expect(data?.domains).toHaveLength(1);
      expect(data?.domains[0]?.name).toBe("empresa.com.br");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/domains",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve obter detalhes de um domínio com URL e método GET corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          id: "dom_123",
          name: "empresa.com.br",
          status: "pending",
          dkimSelector: "coffeemail",
          dkimPublicKey: null,
          verifiedAt: null,
          lastCheckAt: null,
          createdAt: "2025-12-01T00:00:00.000Z",
          dnsRecordsToPublish: [
            {
              type: "TXT",
              host: "_dmarc.empresa.com.br",
              value: "v=DMARC1; p=none",
            },
          ],
        }),
      );

      const { data, error } = await domains.get("dom_123");

      expect(error).toBeNull();
      expect(data?.id).toBe("dom_123");
      expect(data?.dnsRecordsToPublish).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/domains/dom_123",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve repassar statusReason, sendingIdentity e resolution na verificação", async () => {
      const dnsCheck = {
        ok: true,
        resolution: "found",
        expected: "v=spf1 include:coffeemail.com.br ~all",
        got: "v=spf1 include:coffeemail.com.br ~all",
        matches: ["v=spf1 include:coffeemail.com.br ~all"],
      };
      mockFetch.mockResolvedValue(
        jsonResponse({
          id: "dom_123",
          name: "empresa.com.br",
          status: "pending",
          statusReason: "provider_pending",
          sendingIdentity: {
            provider: "aws_ses",
            state: "pending",
            lastSyncedAt: "2026-10-14T12:00:00.000Z",
          },
          verifiedAt: null,
          checks: {
            spf: dnsCheck,
            dkim: dnsCheck,
            dmarc: dnsCheck,
            ownership: {
              ...dnsCheck,
              ok: false,
              resolution: "unknown",
              got: null,
              matches: [],
            },
          },
          requiredChecks: ["spf", "dkim", "dmarc", "ownership"],
        }),
      );

      const { data, error } = await domains.verify("dom_123");

      expect(error).toBeNull();
      expect(data?.status).toBe("pending");
      expect(data?.statusReason).toBe("provider_pending");
      expect(data?.sendingIdentity).toEqual({
        provider: "aws_ses",
        state: "pending",
        lastSyncedAt: "2026-10-14T12:00:00.000Z",
      });
      expect(data?.checks.spf.resolution).toBe("found");
      expect(data?.checks.ownership.resolution).toBe("unknown");
    });

    it("deve repassar statusReason e sendingIdentity nulos ao obter domínio", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          id: "dom_123",
          name: "empresa.com.br",
          status: "failed",
          statusReason: "dns_records_missing",
          sendingIdentity: null,
          dkimSelector: "coffeemail",
          dkimPublicKey: null,
          verifiedAt: null,
          lastCheckAt: null,
          createdAt: "2025-12-01T00:00:00.000Z",
          dnsRecordsToPublish: [],
        }),
      );

      const { data, error } = await domains.get("dom_123");

      expect(error).toBeNull();
      expect(data?.statusReason).toBe("dns_records_missing");
      expect(data?.sendingIdentity).toBeNull();
    });

    it("deve repassar statusReason nos itens da listagem", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          domains: [
            {
              id: "dom_123",
              name: "empresa.com.br",
              status: "failed",
              statusReason: "provider_failed",
              dkimSelector: "coffeemail",
              dkimPublicKey: "chave_publica",
              verifiedAt: null,
              lastCheckAt: "2026-01-01T00:00:00.000Z",
              createdAt: "2025-12-01T00:00:00.000Z",
            },
          ],
        }),
      );

      const { data, error } = await domains.list();

      expect(error).toBeNull();
      expect(data?.domains[0]?.statusReason).toBe("provider_failed");
    });

    it("deve retornar NotFoundError ao obter domínio inexistente", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: "Domínio não encontrado",
            },
          },
          404,
        ),
      );

      const { data, error } = await domains.get("dom_inexistente");

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.status).toBe(404);
    });

    it("deve remover um domínio com URL e método DELETE corretos", async () => {
      mockFetch.mockResolvedValue(jsonResponse({ ok: true }));

      const { data, error } = await domains.delete("dom_123");

      expect(error).toBeNull();
      expect(data?.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/domains/dom_123",
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("deve consultar o status de warmup com URL e método GET corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          domainId: "dom_123",
          currentDay: 5,
          dailyQuota: 500,
          sentToday: 120,
          remainingToday: 380,
          quotaUsedPercent: 24,
          lastSendDate: "2026-09-13",
        }),
      );

      const { data, error } = await domains.getWarmupStatus("dom_123");

      expect(error).toBeNull();
      expect(data?.currentDay).toBe(5);
      expect(data?.dailyQuota).toBe(500);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/domains/dom_123/warmup",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar null quando o domínio ainda não iniciou o warmup", async () => {
      mockFetch.mockResolvedValue(jsonResponse(null));

      const { data, error } = await domains.getWarmupStatus("dom_123");

      expect(error).toBeNull();
      expect(data).toBeNull();
    });
  });

  describe("Webhooks", () => {
    it("deve criar um webhook com URL e método POST corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          id: "wh_123",
          url: "https://minha-api.com.br/api/webhooks/coffeemail",
          events: ["email.delivered", "email.bounced"],
          status: "active",
          description: null,
          createdAt: "2026-09-14T00:00:00.000Z",
          secret: "whsec_valor_completo_unico",
        }),
      );

      const payloadCreate = {
        url: "https://minha-api.com.br/api/webhooks/coffeemail",
        events: ["email.delivered", "email.bounced"] as const,
      };
      const { data, error } = await webhooks.create(payloadCreate);

      expect(error).toBeNull();
      expect(data?.id).toBe("wh_123");
      expect(data?.secret).toBe("whsec_valor_completo_unico");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/webhooks",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payloadCreate),
        }),
      );
    });

    it("deve retornar ValidationError ao criar webhook com URL inválida", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "URL do webhook inválida",
            },
          },
          400,
        ),
      );

      const { data, error } = await webhooks.create({
        url: "not-a-url",
        events: ["email.delivered"],
      });

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(ValidationError);
      expect(error?.status).toBe(400);
    });

    it("deve listar webhooks incluindo query string com URL e método GET corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          webhooks: [
            {
              id: "wh_123",
              url: "https://minha-api.com.br/webhooks",
              events: ["email.delivered"],
              status: "active",
              description: null,
              hasSecret: true,
              createdAt: "2026-09-14T00:00:00.000Z",
            },
          ],
        }),
      );

      const { data, error } = await webhooks.list({ status: "active" });

      expect(error).toBeNull();
      expect(data?.webhooks).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/webhooks?status=active",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve obter detalhes de um webhook com URL e método GET corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          id: "wh_123",
          url: "https://minha-api.com.br/webhooks",
          events: ["email.delivered"],
          status: "active",
          description: "Webhook de produção",
          createdAt: "2026-09-14T00:00:00.000Z",
          secret: null,
          secretPreview: "whsec_...ab12",
        }),
      );

      const { data, error } = await webhooks.get("wh_123");

      expect(error).toBeNull();
      expect(data?.id).toBe("wh_123");
      expect(data?.secret).toBeNull();
      expect(data?.secretPreview).toBe("whsec_...ab12");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/webhooks/wh_123",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar NotFoundError ao obter webhook inexistente", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: "Webhook não encontrado",
            },
          },
          404,
        ),
      );

      const { data, error } = await webhooks.get("wh_inexistente");

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.status).toBe(404);
    });

    it("deve listar entregas de um webhook incluindo query string com URL e método GET corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          deliveries: [
            {
              id: "whd_1",
              webhookId: "wh_123",
              emailEventId: "eml_456",
              eventType: "email.delivered",
              responseStatus: 200,
              responseBody: "OK",
              attempts: 1,
              lastError: null,
              status: "success",
              nextRunAt: "2026-09-14T00:00:00.000Z",
              createdAt: "2026-09-14T00:00:00.000Z",
            },
          ],
        }),
      );

      const { data, error } = await webhooks.listDeliveries("wh_123", {
        status: "success",
        limit: 10,
      });

      expect(error).toBeNull();
      expect(data?.deliveries).toHaveLength(1);
      expect(data?.deliveries[0]?.status).toBe("success");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/webhooks/wh_123/deliveries?status=success&limit=10",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve rotacionar o segredo do webhook com URL e método POST corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          webhookId: "wh_123",
          secret: "whsec_novo_segredo_rotacionado",
        }),
      );

      const { data, error } = await webhooks.rotateSecret("wh_123");

      expect(error).toBeNull();
      expect(data?.secret).toBe("whsec_novo_segredo_rotacionado");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/webhooks/wh_123/rotate-secret",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("deve disparar um envio de teste com URL e método POST corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          status: "success",
          statusCode: 200,
          body: "OK",
          error: null,
        }),
      );

      const { data, error } = await webhooks.test("wh_123");

      expect(error).toBeNull();
      expect(data?.status).toBe("success");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/webhooks/wh_123/test",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("deve retornar NotFoundError ao disparar teste em webhook inexistente", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: "Webhook não encontrado",
            },
          },
          404,
        ),
      );

      const { data, error } = await webhooks.test("wh_inexistente");

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.status).toBe(404);
    });

    it("deve atualizar um webhook com URL e método PUT corretos", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse({
          id: "wh_123",
          url: "https://minha-api.com.br/webhooks",
          events: ["email.delivered", "email.bounced", "email.complained"],
          status: "active",
          description: "Atualizado",
          createdAt: "2026-09-14T00:00:00.000Z",
          secret: null,
          secretPreview: "whsec_...ab12",
        }),
      );

      const updatePayload = {
        events: [
          "email.delivered",
          "email.bounced",
          "email.complained",
        ] as const,
      };
      const { data, error } = await webhooks.update("wh_123", updatePayload);

      expect(error).toBeNull();
      expect(data?.events).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/webhooks/wh_123",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updatePayload),
        }),
      );
    });

    it("deve retornar ConflictError ao atualizar webhook com URL já cadastrada", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "CONFLICT",
              message: "Já existe um webhook cadastrado para esta URL",
            },
          },
          409,
        ),
      );

      const { data, error } = await webhooks.update("wh_123", {
        url: "https://ja-existe.com.br/webhooks",
      });

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(ConflictError);
      expect(error?.status).toBe(409);
    });
  });
});
