import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "../../core/http-client.js";
import { Broadcasts } from "../broadcasts.js";
import { Emails } from "../emails.js";
import { Senders } from "../senders.js";
import { Suppressions } from "../suppressions.js";

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status < 400,
  status,
  text: async () => JSON.stringify(body),
});

const sentBody = (mockFetch: ReturnType<typeof vi.fn>): Record<string, unknown> =>
  JSON.parse(String((mockFetch.mock.calls.at(-1)?.[1] as RequestInit).body)) as Record<string, unknown>;

describe("operações corrigidas na 0.3.0", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let client: HttpClient;

  beforeEach(() => {
    mockFetch = vi.fn();
    client = new HttpClient("cm_live_teste123", { fetch: mockFetch });
  });

  it("emails.send envia emailType, suppressionCategory e metadata", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: "e1", status: "queued", queuedAt: "2026-10-14T12:00:00Z" }, 202));

    await new Emails(client).send({
      from: "a@b.com",
      to: "c@d.com",
      subject: "Oi",
      text: "Oi",
      emailType: "broadcast",
      suppressionCategory: "newsletter",
      metadata: { pedido: 42 },
    });

    expect(sentBody(mockFetch)).toMatchObject({
      emailType: "broadcast",
      suppressionCategory: "newsletter",
      metadata: { pedido: 42 },
    });
  });

  it("emails.send omite os campos opcionais quando ausentes", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: "e1", status: "queued", queuedAt: "2026-10-14T12:00:00Z" }, 202));

    await new Emails(client).send({ from: "a@b.com", to: "c@d.com", subject: "Oi", text: "Oi" });

    const body = sentBody(mockFetch);
    expect(body).not.toHaveProperty("emailType");
    expect(body).not.toHaveProperty("suppressionCategory");
    expect(body).not.toHaveProperty("metadata");
  });

  it("senders devolvem os tipos do contrato", async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse({ id: "s1", email: "a@b.com", displayName: null, verifiedAt: null, active: true, createdAt: "2026-10-14T12:00:00Z" }, 201))
      .mockResolvedValueOnce(jsonResponse({ senders: [] }))
      .mockResolvedValueOnce(jsonResponse({ id: "s1", email: "a@b.com" }));
    const senders = new Senders(client);

    const created = await senders.create({ email: "a@b.com" });
    const listed = await senders.list();
    const verified = await senders.verify("6f1c2a7e-3b4d-4e5f-8a9b-0c1d2e3f4a5b");

    expect(created.data?.id).toBe("s1");
    expect(created.data?.verificationToken).toBeUndefined();
    expect(listed.data?.senders).toEqual([]);
    expect(verified.data?.email).toBe("a@b.com");
  });

  it("senders.resendVerification chama a rota de reenvio e devolve erro tipado em 409", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, status: 204, text: async () => "" });
    const senders = new Senders(client);

    const resent = await senders.resendVerification("s1");

    expect(resent.error).toBeNull();
    expect(String(mockFetch.mock.calls.at(-1)?.[0])).toContain(
      "/v1/product/senders/s1/resend-verification",
    );

    mockFetch.mockResolvedValueOnce(
      jsonResponse({ error: { code: "CONFLICT", message: "sender is already verified" } }, 409),
    );
    const conflicted = await senders.resendVerification("s1");
    expect(conflicted.error?.code).toBe("CONFLICT");

    mockFetch.mockResolvedValueOnce(
      jsonResponse({ error: { code: "NOT_FOUND", message: "sender" } }, 404),
    );
    const missing = await senders.resendVerification("desconhecido");
    expect(missing.error?.code).toBe("NOT_FOUND");
  });

  it("broadcasts.create envia scheduledAt e o detalhe expõe metrics", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ id: "b1", status: "scheduled", scheduledAt: "2030-01-01T10:00:00.000Z" }, 201),
    );
    const broadcasts = new Broadcasts(client);

    await broadcasts.create({
      audienceId: "a1",
      fromEmail: "news@acme.com",
      templateId: "tpl-1",
      scheduledAt: "2030-01-01T10:00:00.000Z",
    });
    expect(sentBody(mockFetch)).toMatchObject({ scheduledAt: "2030-01-01T10:00:00.000Z" });

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        id: "b1",
        status: "sent",
        metrics: { delivered: 9, opened: 4, clicked: 1, bounced: 1, failed: 0, suppressed: 2 },
      }),
    );
    const detail = await broadcasts.get("b1");
    expect(detail.data?.metrics?.delivered).toBe(9);
  });

  it("suppressions.bulkCreate envia o envelope e devolve insertedCount", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ insertedCount: 2 }));

    const { data } = await new Suppressions(client).bulkCreate([
      { email: "x@gmail.com", reason: "manual" },
      { email: "y@gmail.com" },
    ]);

    expect(data?.insertedCount).toBe(2);
    expect(sentBody(mockFetch)).toEqual({
      suppressions: [{ email: "x@gmail.com", reason: "manual" }, { email: "y@gmail.com" }],
    });
  });

  it("broadcasts.testSend devolve o resultado tipado", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ success: true, messageId: "m1", recipient: "t@gmail.com" }));

    const { data } = await new Broadcasts(client).testSend("b1", { to: "t@gmail.com", variables: { nome: "Ana" } });

    expect(data?.messageId).toBe("m1");
    expect(sentBody(mockFetch)).toEqual({ to: "t@gmail.com", variables: { nome: "Ana" } });
  });
});
