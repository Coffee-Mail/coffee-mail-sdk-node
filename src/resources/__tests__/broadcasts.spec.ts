import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "../../core/http-client.js";
import { Broadcasts } from "../broadcasts.js";

import type {
  BroadcastDetail,
  CreateBroadcastPayload,
} from "../../types/broadcasts.types.js";

describe("Broadcasts", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let client: HttpClient;
  let broadcasts: Broadcasts;

  const mockOkThen = (payload: unknown, status = 200) => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status,
      text: async () => JSON.stringify(payload),
    });
  };

  const sentBody = (): unknown => {
    const [, init] = mockFetch.mock.calls[0] as [string, { body: string }];
    return JSON.parse(init.body);
  };

  beforeEach(() => {
    mockFetch = vi.fn();
    client = new HttpClient("cm_live_teste123", { fetch: mockFetch });
    broadcasts = new Broadcasts(client);
  });

  const broadcastDetail: BroadcastDetail = {
    id: "bcast_123",
    audienceId: "aud_123",
    audienceName: "Clientes VIP",
    templateId: null,
    subject: "Promoção de Setembro",
    fromEmail: "contato@empresa.com.br",
    replyTo: null,
    status: "draft",
    scheduledAt: null,
    sentAt: null,
    cancelledAt: null,
    recipientsTotal: 0,
    recipientsQueued: 0,
    recipientsFailed: 0,
    createdAt: "2026-09-08T22:00:00.000Z",
    updatedAt: "2026-09-08T22:00:00.000Z",
  };

  describe("create", () => {
    it("deve criar campanha com sucesso usando html e subject", async () => {
      mockOkThen(broadcastDetail);

      const { data, error } = await broadcasts.create({
        audienceId: "aud_123",
        fromEmail: "contato@empresa.com.br",
        html: "<p>Promoção imperdível</p>",
        subject: "Promoção de Setembro",
      });

      expect(error).toBeNull();
      expect(data).toEqual(broadcastDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts",
        expect.objectContaining({ method: "POST" }),
      );
      expect(sentBody()).toEqual({
        audienceId: "aud_123",
        fromEmail: "contato@empresa.com.br",
        html: "<p>Promoção imperdível</p>",
        subject: "Promoção de Setembro",
      });
    });

    it("não envia campos fora do contrato", async () => {
      mockOkThen(broadcastDetail);

      await broadcasts.create({
        audienceId: "aud_123",
        fromEmail: "contato@empresa.com.br",
        templateId: "tpl_123",
        campoInventado: "x",
      } as unknown as CreateBroadcastPayload);

      expect(sentBody()).toEqual({
        audienceId: "aud_123",
        fromEmail: "contato@empresa.com.br",
        templateId: "tpl_123",
      });
    });

    it("envia scheduledAt para agendar a campanha", async () => {
      mockOkThen({ ...broadcastDetail, status: "scheduled" });

      await broadcasts.create({
        audienceId: "aud_123",
        fromEmail: "contato@empresa.com.br",
        templateId: "tpl_123",
        scheduledAt: "2030-10-01T12:00:00.000Z",
      });

      expect(sentBody()).toEqual({
        audienceId: "aud_123",
        fromEmail: "contato@empresa.com.br",
        templateId: "tpl_123",
        scheduledAt: "2030-10-01T12:00:00.000Z",
      });
    });

    it("deve retornar erro de validação quando payload é inválido", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () =>
          JSON.stringify({
            error: {
              code: "VALIDATION_ERROR",
              message: "É preciso fornecer templateId ou html, não ambos.",
            },
          }),
      });

      const { data, error } = await broadcasts.create({
        audienceId: "aud_123",
        fromEmail: "contato@empresa.com.br",
        templateId: "tpl_123",
      } as Parameters<typeof broadcasts.create>[0]);

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.status).toBe(400);
      expect(error?.code).toBe("VALIDATION_ERROR");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("list", () => {
    it("deve listar campanhas sem filtros", async () => {
      const listResponse = { broadcasts: [broadcastDetail], nextCursor: null };
      mockOkThen(listResponse);

      const { data, error } = await broadcasts.list();

      expect(error).toBeNull();
      expect(data).toEqual(listResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve listar campanhas aplicando filtros como query string", async () => {
      const listResponse = {
        broadcasts: [broadcastDetail],
        nextCursor: "cursor_abc",
      };
      mockOkThen(listResponse);

      const { data, error } = await broadcasts.list({
        status: "sent",
        limit: 20,
        after: "cursor_xyz",
      });

      expect(error).toBeNull();
      expect(data).toEqual(listResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts?status=sent&limit=20&after=cursor_xyz",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar erro quando a autenticação falha", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () =>
          JSON.stringify({
            error: { code: "UNAUTHORIZED", message: "Chave de API inválida." },
          }),
      });

      const { data, error } = await broadcasts.list();

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.status).toBe(401);
      expect(error?.code).toBe("UNAUTHORIZED");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("get", () => {
    it("deve buscar campanha por id com sucesso", async () => {
      mockOkThen(broadcastDetail);

      const { data, error } = await broadcasts.get("bcast_123");

      expect(error).toBeNull();
      expect(data).toEqual(broadcastDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts/bcast_123",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar erro NOT_FOUND quando a campanha não existe", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: { code: "NOT_FOUND", message: "Campanha não encontrada." },
          }),
      });

      const { data, error } = await broadcasts.get("bcast_inexistente");

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.status).toBe(404);
      expect(error?.code).toBe("NOT_FOUND");
      expect(error?.message).toBe("Campanha não encontrada.");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts/bcast_inexistente",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("send", () => {
    it("deve disparar envio de campanha com sucesso", async () => {
      mockOkThen({
        id: "bcast_123",
        status: "sending",
        recipientsTotal: 1000,
        recipientsQueued: 1000,
      });

      const { data, error } = await broadcasts.send("bcast_123");

      expect(error).toBeNull();
      expect(data).toEqual({
        id: "bcast_123",
        status: "sending",
        recipientsTotal: 1000,
        recipientsQueued: 1000,
      });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts/bcast_123/send",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("deve retornar erro de conflito ao tentar enviar campanha já enviada", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        text: async () =>
          JSON.stringify({
            error: {
              code: "CONFLICT",
              message: "Campanha já foi enviada.",
            },
          }),
      });

      const { data, error } = await broadcasts.send("bcast_123");

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.status).toBe(409);
      expect(error?.code).toBe("CONFLICT");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts/bcast_123/send",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("cancel", () => {
    it("deve cancelar campanha com sucesso", async () => {
      mockOkThen({
        id: "bcast_123",
        status: "cancelled",
        cancelledAt: "2026-09-14T10:00:00.000Z",
      });

      const { data, error } = await broadcasts.cancel("bcast_123");

      expect(error).toBeNull();
      expect(data).toEqual({
        id: "bcast_123",
        status: "cancelled",
        cancelledAt: "2026-09-14T10:00:00.000Z",
      });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts/bcast_123/cancel",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("deve retornar erro NOT_FOUND ao cancelar campanha inexistente", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: { code: "NOT_FOUND", message: "Campanha não encontrada." },
          }),
      });

      const { data, error } = await broadcasts.cancel("bcast_inexistente");

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.status).toBe(404);
      expect(error?.code).toBe("NOT_FOUND");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/broadcasts/bcast_inexistente/cancel",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("permission gate (aplicada pelo servidor)", () => {
    const forbiddenResponse = () => ({
      ok: false,
      status: 403,
      text: async () =>
        JSON.stringify({
          error: {
            code: "FORBIDDEN",
            message: "Requer permissão full_access.",
          },
        }),
    });

    it("remapeia o 403 do servidor para PermissionError em create", async () => {
      mockFetch.mockResolvedValueOnce(forbiddenResponse());

      const { data, error } = await broadcasts.create({
        audienceId: "aud_1",
        fromEmail: "c@e.com.br",
        html: "<p>x</p>",
        subject: "x",
      });

      expect(data).toBeNull();
      expect(error?.name).toBe("PermissionError");
      expect(error?.code).toBe("PERMISSION_DENIED");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("remapeia o 403 do servidor para PermissionError em send", async () => {
      mockFetch.mockResolvedValueOnce(forbiddenResponse());

      const { data, error } = await broadcasts.send("bcast_1");

      expect(data).toBeNull();
      expect(error?.name).toBe("PermissionError");
      expect((error as { requiredPermission?: string })?.requiredPermission).toBe(
        "full_access",
      );
    });

    it("não faz nenhuma chamada de introspecção antes da requisição real", async () => {
      mockOkThen({ broadcasts: [], nextCursor: null });

      await broadcasts.list();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const calledUrls = mockFetch.mock.calls.map((c) => (c[0] as string) ?? "");
      expect(calledUrls.some((u) => u.includes("/auth/me/api-key"))).toBe(false);
    });
  });
});
