import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "../../core/http-client.js";
import { NotFoundError, ValidationError } from "../../core/errors.js";
import { Emails } from "../emails.js";
import { Templates } from "../templates.js";

const TEMPLATE_ID = "6f1c2a8e-3b4d-4e5f-8a9b-0c1d2e3f4a5b";
const BASE = "https://api.coffeemail.com.br/v1/product";

const versionSummary = {
  version: 3,
  name: "Boas-vindas",
  subject: "Bem-vindo!",
  createdBy: null,
  createdAt: "2026-10-15T12:00:00.000Z",
};

const versionDetail = {
  ...versionSummary,
  templateId: TEMPLATE_ID,
  preheader: null,
  html: "<h1>Olá {{name}}</h1>",
  contentJson: null,
  textPayload: null,
  variables: [{ name: "name" }],
  format: "html",
  sourceLocale: "pt-BR",
};

const templateDetail = {
  id: TEMPLATE_ID,
  organisationId: "org_1",
  name: "Boas-vindas",
  alias: "boas-vindas",
  subject: "Bem-vindo!",
  preheader: null,
  html: "<h1>Olá {{name}}</h1>",
  contentJson: null,
  textPayload: null,
  variables: [{ name: "name" }],
  isActive: true,
  format: "html",
  sourceLocale: "pt-BR",
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-15T12:30:00.000Z",
};

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status < 400,
  status,
  text: async () => JSON.stringify(body),
});

const apiError = (status: number, code: string, message: string) =>
  jsonResponse({ error: { code, message } }, status);

describe("Templates — versões", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let templates: Templates;

  beforeEach(() => {
    mockFetch = vi.fn();
    templates = new Templates(new HttpClient("cm_live_teste123", { fetch: mockFetch }));
  });

  describe("listVersions", () => {
    it("faz GET em /templates/{id}/versions com limit e offset", async () => {
      mockFetch.mockResolvedValue(jsonResponse({ data: [versionSummary], total: 3 }));

      const { data, error } = await templates.listVersions(TEMPLATE_ID, {
        limit: 10,
        offset: 20,
      });

      expect(error).toBeNull();
      expect(data?.total).toBe(3);
      expect(data?.data[0]).toEqual(versionSummary);
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/templates/${TEMPLATE_ID}/versions?limit=10&offset=20`,
        expect.objectContaining({ method: "GET" }),
      );
      expect(mockFetch.mock.calls[0]?.[1]?.body).toBeUndefined();
    });

    it("omite a query string quando não há paginação", async () => {
      mockFetch.mockResolvedValue(jsonResponse({ data: [], total: 0 }));

      await templates.listVersions(TEMPLATE_ID);

      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/templates/${TEMPLATE_ID}/versions`,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("devolve NotFoundError com apiCode TEMPLATE_NOT_FOUND", async () => {
      mockFetch.mockResolvedValue(apiError(404, "TEMPLATE_NOT_FOUND", "Template não encontrado"));

      const { data, error } = await templates.listVersions(TEMPLATE_ID);

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.apiCode).toBe("TEMPLATE_NOT_FOUND");
    });

    it("devolve ValidationError para paginação fora do intervalo", async () => {
      mockFetch.mockResolvedValue(apiError(400, "VALIDATION_ERROR", "limit inválido"));

      const { error } = await templates.listVersions(TEMPLATE_ID, { limit: 500 });

      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe("getVersion", () => {
    it("faz GET em /templates/{id}/versions/{version} e devolve o conteúdo completo", async () => {
      mockFetch.mockResolvedValue(jsonResponse(versionDetail));

      const { data, error } = await templates.getVersion(TEMPLATE_ID, 3);

      expect(error).toBeNull();
      expect(data).toEqual(versionDetail);
      expect(data?.templateId).toBe(TEMPLATE_ID);
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/templates/${TEMPLATE_ID}/versions/3`,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("devolve NotFoundError com apiCode TEMPLATE_VERSION_NOT_FOUND", async () => {
      mockFetch.mockResolvedValue(
        apiError(404, "TEMPLATE_VERSION_NOT_FOUND", "Versão não encontrada"),
      );

      const { data, error } = await templates.getVersion(TEMPLATE_ID, 99);

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.apiCode).toBe("TEMPLATE_VERSION_NOT_FOUND");
      expect(error?.message).toBe("Versão não encontrada");
    });
  });

  describe("restoreVersion", () => {
    it("faz POST sem corpo em /templates/{id}/versions/{version}/restore e devolve o template", async () => {
      mockFetch.mockResolvedValue(jsonResponse(templateDetail));

      const { data, error } = await templates.restoreVersion(TEMPLATE_ID, 2);

      expect(error).toBeNull();
      expect(data).toEqual(templateDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/templates/${TEMPLATE_ID}/versions/2/restore`,
        expect.objectContaining({ method: "POST" }),
      );
      expect(mockFetch.mock.calls[0]?.[1]?.body).toBeUndefined();
    });

    it("devolve NotFoundError com apiCode TEMPLATE_VERSION_NOT_FOUND", async () => {
      mockFetch.mockResolvedValue(
        apiError(404, "TEMPLATE_VERSION_NOT_FOUND", "Versão não encontrada"),
      );

      const { error } = await templates.restoreVersion(TEMPLATE_ID, 99);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.apiCode).toBe("TEMPLATE_VERSION_NOT_FOUND");
    });

    it("devolve NotFoundError com apiCode TEMPLATE_NOT_FOUND", async () => {
      mockFetch.mockResolvedValue(apiError(404, "TEMPLATE_NOT_FOUND", "Template não encontrado"));

      const { error } = await templates.restoreVersion(TEMPLATE_ID, 1);

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.apiCode).toBe("TEMPLATE_NOT_FOUND");
    });
  });
});

describe("Emails — templateId por alias", () => {
  it("envia o alias do template sem validação local de UUID", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      jsonResponse({ id: "em_1", status: "queued", queuedAt: "2026-10-15T12:00:00.000Z" }, 202),
    );
    const emails = new Emails(new HttpClient("cm_live_teste123", { fetch: mockFetch }));

    const { error } = await emails.send({
      from: "contato@empresa.com.br",
      to: "cliente@gmail.com",
      templateId: "boas-vindas",
      variables: { name: "Ana" },
    });

    expect(error).toBeNull();
    const body = JSON.parse(String(mockFetch.mock.calls[0]?.[1]?.body)) as Record<string, unknown>;
    expect(body["templateId"]).toBe("boas-vindas");
  });
});
