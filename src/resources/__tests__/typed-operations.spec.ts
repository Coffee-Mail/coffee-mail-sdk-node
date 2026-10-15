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
      .mockResolvedValueOnce(jsonResponse({ id: "s1", email: "a@b.com", displayName: null, verificationToken: "t", verifiedAt: null, active: true, createdAt: "2026-10-14T12:00:00Z" }, 201))
      .mockResolvedValueOnce(jsonResponse({ senders: [] }))
      .mockResolvedValueOnce(jsonResponse({ id: "s1", email: "a@b.com" }));
    const senders = new Senders(client);

    const created = await senders.create({ email: "a@b.com" });
    const listed = await senders.list();
    const verified = await senders.verify("6f1c2a7e-3b4d-4e5f-8a9b-0c1d2e3f4a5b");

    expect(created.data?.verificationToken).toBe("t");
    expect(listed.data?.senders).toEqual([]);
    expect(verified.data?.email).toBe("a@b.com");
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
