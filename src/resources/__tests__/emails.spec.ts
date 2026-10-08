import { beforeEach, describe, expect, it, vi } from "vitest";

import { ValidationError } from "../../core/errors.js";
import { HttpClient } from "../../core/http-client.js";
import { Emails } from "../emails.js";

describe("Emails", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let client: HttpClient;
  let emails: Emails;

  beforeEach(() => {
    mockFetch = vi.fn();
    client = new HttpClient("cm_live_teste123", { fetch: mockFetch });
    emails = new Emails(client);
  });

  it("deve normalizar remetente e destinatário em strings simples para objetos esperados pela API", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 202,
      text: async () =>
        JSON.stringify({
          id: "eml_123",
          status: "queued",
          queuedAt: "2026-09-08T22:00:00.000Z",
        }),
    });

    const { data, error } = await emails.send({
      from: "contato@empresa.com.br",
      to: "cliente@gmail.com",
      subject: "Teste de Envio",
      html: "<p>Olá mundo</p>",
    });

    expect(error).toBeNull();
    expect(data?.id).toBe("eml_123");
    expect(data?.status).toBe("queued");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.coffeemail.com.br/v1/product/emails",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          from: { email: "contato@empresa.com.br" },
          to: [{ email: "cliente@gmail.com" }],
          subject: "Teste de Envio",
          html: "<p>Olá mundo</p>",
        }),
      }),
    );
  });

  it("deve extrair nome e e-mail quando fornecido no formato RFC 5322 'Nome <email@dominio.com>'", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 202,
      text: async () => JSON.stringify({ id: "eml_124", status: "queued" }),
    });

    await emails.send({
      from: "Empresa do Café <contato@empresa.com.br>",
      to: "Cliente Especial <cliente@gmail.com>",
      subject: "Teste com Nome",
      html: "<p>Olá</p>",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.coffeemail.com.br/v1/product/emails",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          from: { email: "contato@empresa.com.br", name: "Empresa do Café" },
          to: [{ email: "cliente@gmail.com", name: "Cliente Especial" }],
          subject: "Teste com Nome",
          html: "<p>Olá</p>",
        }),
      }),
    );
  });

  it("deve lidar com cancelamento de e-mail com sucesso", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ id: "eml_123", status: "cancelled" }),
    });

    const { data, error } = await emails.cancel("eml_123");

    expect(error).toBeNull();
    expect(data).toEqual({ id: "eml_123", status: "cancelled" });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.coffeemail.com.br/v1/product/emails/eml_123/cancel",
      expect.objectContaining({ method: "POST" }),
    );
  });

  describe("get", () => {
    it("deve retornar os detalhes completos de um e-mail com sucesso", async () => {
      const emailDetail = {
        id: "eml_123",
        from: "contato@empresa.com.br",
        to: ["cliente@gmail.com"],
        cc: null,
        bcc: null,
        subject: "Teste de Envio",
        status: "delivered",
        attempts: 1,
        lastError: null,
        messageId: "msg_abc",
        createdAt: "2026-09-08T22:00:00.000Z",
        scheduledAt: null,
        sentAt: "2026-09-08T22:00:01.000Z",
        deliveredAt: "2026-09-08T22:00:02.000Z",
        bouncedAt: null,
        failedAt: null,
        complainedAt: null,
        suppressedAt: null,
        openedAt: null,
        firstClickedAt: null,
        openCount: 0,
        clickCount: 0,
        tags: null,
        html: "<p>Olá mundo</p>",
        text: null,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(emailDetail),
      });

      const { data, error } = await emails.get("eml_123");

      expect(error).toBeNull();
      expect(data).toEqual(emailDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/eml_123",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar erro NOT_FOUND quando o e-mail não existe", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: { code: "NOT_FOUND", message: "E-mail não encontrado." },
          }),
      });

      const { data, error } = await emails.get("eml_inexistente");

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(error?.status).toBe(404);
      expect(error?.code).toBe("NOT_FOUND");
      expect(error?.message).toBe("E-mail não encontrado.");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/eml_inexistente",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("getEvents", () => {
    it("deve retornar a linha do tempo de eventos de um e-mail com sucesso", async () => {
      const eventsResponse = {
        id: "eml_123",
        events: [
          { type: "queued", timestamp: "2026-09-08T22:00:00.000Z" },
          {
            type: "delivered",
            timestamp: "2026-09-08T22:00:02.000Z",
            metadata: { provider: "smtp" },
          },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(eventsResponse),
      });

      const { data, error } = await emails.getEvents("eml_123");

      expect(error).toBeNull();
      expect(data).toEqual(eventsResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/eml_123/events",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar erro NOT_FOUND quando o e-mail não existe", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: { code: "NOT_FOUND", message: "E-mail não encontrado." },
          }),
      });

      const { data, error } = await emails.getEvents("eml_inexistente");

      expect(data).toBeNull();
      expect(error?.status).toBe(404);
      expect(error?.code).toBe("NOT_FOUND");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/eml_inexistente/events",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("getTags", () => {
    it("deve retornar as tags distintas usadas pela organização com sucesso", async () => {
      const tagsResponse = {
        tags: [
          { name: "campanha", values: ["black-friday", "natal"] },
          { name: "ambiente", values: ["producao"] },
        ],
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(tagsResponse),
      });

      const { data, error } = await emails.getTags();

      expect(error).toBeNull();
      expect(data).toEqual(tagsResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/tags",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar erro quando a API falha internamente", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () =>
          JSON.stringify({
            error: { code: "INTERNAL_SERVER_ERROR", message: "Erro interno." },
          }),
      });

      const { data, error } = await emails.getTags();

      expect(data).toBeNull();
      expect(error?.status).toBe(500);
      expect(error?.code).toBe("INTERNAL_SERVER_ERROR");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/tags",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("list", () => {
    it("deve listar e-mails com sucesso sem filtros", async () => {
      const listResponse = {
        emails: [
          {
            id: "eml_123",
            from: "contato@empresa.com.br",
            to: ["cliente@gmail.com"],
            cc: null,
            bcc: null,
            subject: "Teste",
            status: "delivered",
            attempts: 1,
            lastError: null,
            messageId: "msg_abc",
            createdAt: "2026-09-08T22:00:00.000Z",
            scheduledAt: null,
            sentAt: "2026-09-08T22:00:01.000Z",
            deliveredAt: "2026-09-08T22:00:02.000Z",
            bouncedAt: null,
            failedAt: null,
            complainedAt: null,
            suppressedAt: null,
            openedAt: null,
            firstClickedAt: null,
            openCount: 0,
            clickCount: 0,
            tags: null,
            html: "<p>Olá</p>",
            text: null,
            apiKey: { id: "key_1", name: "Produção" },
          },
        ],
        nextCursor: null,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(listResponse),
      });

      const { data, error } = await emails.list();

      expect(error).toBeNull();
      expect(data).toEqual(listResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve listar e-mails aplicando filtros como query string", async () => {
      const listResponse = { emails: [], nextCursor: "cursor_abc" };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(listResponse),
      });

      const { data, error } = await emails.list({
        status: "delivered",
        limit: 50,
        tag: "campanha",
      });

      expect(error).toBeNull();
      expect(data).toEqual(listResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails?status=delivered&limit=50&tag=campanha",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("deve retornar erro quando os parâmetros de busca são inválidos", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () =>
          JSON.stringify({
            error: {
              code: "VALIDATION_ERROR",
              message: "Parâmetro 'limit' inválido.",
            },
          }),
      });

      const { data, error } = await emails.list({ limit: 999 });

      expect(data).toBeNull();
      expect(error?.status).toBe(400);
      expect(error?.code).toBe("VALIDATION_ERROR");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails?limit=999",
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("resend", () => {
    it("deve reenviar um e-mail existente com sucesso", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 202,
        text: async () =>
          JSON.stringify({
            id: "eml_456",
            status: "queued",
            queuedAt: "2026-09-14T10:00:00.000Z",
          }),
      });

      const { data, error } = await emails.resend("eml_123");

      expect(error).toBeNull();
      expect(data).toEqual({
        id: "eml_456",
        status: "queued",
        queuedAt: "2026-09-14T10:00:00.000Z",
      });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/eml_123/resend",
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("deve retornar erro NOT_FOUND ao reenviar um e-mail inexistente", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: { code: "NOT_FOUND", message: "E-mail não encontrado." },
          }),
      });

      const { data, error } = await emails.resend("eml_inexistente");

      expect(data).toBeNull();
      expect(error?.status).toBe(404);
      expect(error?.code).toBe("NOT_FOUND");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/eml_inexistente/resend",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("sendBatch", () => {
    it("deve enviar múltiplos e-mails em lote com sucesso, incluindo item com falha", async () => {
      const batchResult = [
        {
          ok: true,
          data: {
            id: "eml_1",
            status: "queued",
            queuedAt: "2026-09-14T10:00:00.000Z",
          },
        },
        {
          ok: false,
          error: "Domínio do remetente não verificado.",
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(batchResult),
      });

      const { data, error } = await emails.sendBatch([
        {
          from: "alertas@empresa.com",
          to: "user1@gmail.com",
          subject: "Aviso",
          html: "<p>Mensagem 1</p>",
        },
        {
          from: "nao-verificado@empresa.com",
          to: "user2@gmail.com",
          subject: "Aviso",
          html: "<p>Mensagem 2</p>",
        },
      ]);

      expect(error).toBeNull();
      expect(data).toEqual(batchResult);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/batch",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify([
            {
              from: { email: "alertas@empresa.com" },
              to: [{ email: "user1@gmail.com" }],
              subject: "Aviso",
              html: "<p>Mensagem 1</p>",
            },
            {
              from: { email: "nao-verificado@empresa.com" },
              to: [{ email: "user2@gmail.com" }],
              subject: "Aviso",
              html: "<p>Mensagem 2</p>",
            },
          ]),
        }),
      );
    });

    it("deve retornar erro quando a requisição de lote inteira falha", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () =>
          JSON.stringify({
            error: {
              code: "VALIDATION_ERROR",
              message: "Lote excede o limite máximo de e-mails.",
            },
          }),
      });

      const { data, error } = await emails.sendBatch([
        {
          from: "alertas@empresa.com",
          to: "user1@gmail.com",
          subject: "Aviso",
          html: "<p>Mensagem 1</p>",
        },
      ]);

      expect(data).toBeNull();
      expect(error?.status).toBe(400);
      expect(error?.code).toBe("VALIDATION_ERROR");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.coffeemail.com.br/v1/product/emails/batch",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("participante malformado", () => {
    it("send() lança ValidationError (não TypeError) quando `to` está nulo", async () => {
      await expect(
        emails.send({
          from: "contato@empresa.com.br",
          to: null as never,
          subject: "Teste",
          html: "<p>oi</p>",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("send() lança ValidationError quando `to` é um objeto sem `email`", async () => {
      await expect(
        emails.send({
          from: "contato@empresa.com.br",
          to: { name: "Sem email" } as never,
          subject: "Teste",
          html: "<p>oi</p>",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("sendBatch() lança ValidationError quando um item tem `from` malformado", async () => {
      await expect(
        emails.sendBatch([
          {
            from: {} as never,
            to: "cliente@gmail.com",
            subject: "Teste",
            html: "<p>oi</p>",
          },
        ]),
      ).rejects.toBeInstanceOf(ValidationError);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
