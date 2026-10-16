import { describe, expect, it, vi } from "vitest";

import { CoffeeMail } from "../client.js";

describe("CoffeeMail SDK Client", () => {
  it("deve instanciar todos os recursos (emails, domains, templates, etc.)", () => {
    const client = new CoffeeMail("cm_live_chave123");

    expect(client.emails).toBeDefined();
    expect(client.domains).toBeDefined();
    expect(client.templates).toBeDefined();
    expect(client.audiences).toBeDefined();
    expect(client.broadcasts).toBeDefined();
    expect(client.suppressions).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(client.stats).toBeDefined();
    expect(client.validation).toBeDefined();
  });

  it("deve ler apiKey da variável de ambiente se não fornecida no construtor", () => {
    process.env["COFFEEMAIL_API_KEY"] = "cm_live_env_key";
    const client = new CoffeeMail();
    expect(client).toBeDefined();
    delete process.env["COFFEEMAIL_API_KEY"];
  });

  it("deve permitir chamada encadeada coffeemail.emails.send() com sucesso", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
      text: async () =>
        JSON.stringify({
          id: "eml_999",
          status: "queued",
          queuedAt: "2026-09-08T22:00:00Z",
        }),
    });

    const client = new CoffeeMail("cm_live_123", { fetch: mockFetch });

    const { data, error } = await client.emails.send({
      from: "suporte@empresa.com",
      to: "destinatario@gmail.com",
      subject: "Teste de Integração",
      html: "<p>Tudo funcionando</p>",
    });

    expect(error).toBeNull();
    expect(data?.id).toBe("eml_999");
  });
});
