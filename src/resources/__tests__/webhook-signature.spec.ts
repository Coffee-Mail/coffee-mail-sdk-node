import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { HttpClient } from "../../core/http-client.js";
import { Webhooks } from "../webhooks.js";

interface SignatureVector {
  readonly name: string;
  readonly secret: string;
  readonly body: string;
  readonly timestamp: string;
  readonly idempotencyKey: string;
  readonly signature: string;
  readonly nowEpochSeconds: number;
  readonly toleranceSeconds: number;
  readonly expected: boolean;
}

const VECTORS: ReadonlyArray<SignatureVector> = (
  JSON.parse(
    readFileSync(new URL("./fixtures/webhook-vectors.json", import.meta.url), "utf-8"),
  ) as { readonly vectors: ReadonlyArray<SignatureVector> }
).vectors;

const SECRET = "whsec_ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12ab12";
const BODY = '{"event_type":"email.delivered","webhook_id":"w1","data":{}}';
const TIMESTAMP = "1760000000";
const IDEMPOTENCY_KEY = "ed4e7012eb856296";
const NOW = (): number => Number(TIMESTAMP) * 1000;

const signatureFor = (body: string): string =>
  "sha256=" +
  createHmac("sha256", SECRET).update(`${TIMESTAMP}.${IDEMPOTENCY_KEY}.${body}`).digest("hex");

describe("Webhooks.verifySignature", () => {
  it("carrega os 11 vetores compartilhados", () => {
    expect(VECTORS).toHaveLength(11);
  });

  it.each(VECTORS)("vetor $name", (vector) => {
    const valid = Webhooks.verifySignature({
      payload: vector.body,
      signature: vector.signature,
      timestamp: vector.timestamp,
      idempotencyKey: vector.idempotencyKey,
      secret: vector.secret,
      toleranceSeconds: vector.toleranceSeconds,
      now: () => vector.nowEpochSeconds * 1000,
    });
    expect(valid).toBe(vector.expected);
  });

  it("aceita os headers do Node (IncomingHttpHeaders) e um Uint8Array como corpo", () => {
    const valid = Webhooks.verifySignature({
      payload: new TextEncoder().encode(BODY),
      headers: {
        "x-webhook-signature": signatureFor(BODY),
        "x-webhook-timestamp": TIMESTAMP,
        "x-webhook-idempotency-key": [IDEMPOTENCY_KEY],
      },
      secret: SECRET,
      now: NOW,
    });
    expect(valid).toBe(true);
  });

  it("aceita um objeto Headers da Fetch API", () => {
    const headers = new Headers({
      "X-Webhook-Signature": signatureFor(BODY),
      "X-Webhook-Timestamp": TIMESTAMP,
      "X-Webhook-Idempotency-Key": IDEMPOTENCY_KEY,
    });
    const webhooks = new Webhooks(new HttpClient("cm_test_123"));
    expect(webhooks.verifySignature({ payload: BODY, headers, secret: SECRET, now: NOW })).toBe(true);
  });

  it("rejeita entrega sem os headers de assinatura", () => {
    const valid = Webhooks.verifySignature({
      payload: BODY,
      headers: { "x-webhook-signature": signatureFor(BODY) },
      secret: SECRET,
      now: NOW,
    });
    expect(valid).toBe(false);
  });

  it("rejeita a assinatura antiga calculada só sobre o corpo", () => {
    const legacy = createHmac("sha256", SECRET).update(BODY).digest("hex");
    const valid = Webhooks.verifySignature({
      payload: BODY,
      signature: legacy,
      timestamp: TIMESTAMP,
      idempotencyKey: IDEMPOTENCY_KEY,
      secret: SECRET,
      now: NOW,
    });
    expect(valid).toBe(false);
  });

  it("rejeita corpo ou segredo vazios", () => {
    const base = { signature: signatureFor(""), timestamp: TIMESTAMP, idempotencyKey: IDEMPOTENCY_KEY, now: NOW };
    expect(Webhooks.verifySignature({ ...base, payload: "", secret: SECRET })).toBe(false);
    expect(Webhooks.verifySignature({ ...base, payload: BODY, secret: "" })).toBe(false);
  });

  it("usa a janela padrão de 300 segundos", () => {
    const base = {
      payload: BODY,
      signature: signatureFor(BODY),
      timestamp: TIMESTAMP,
      idempotencyKey: IDEMPOTENCY_KEY,
      secret: SECRET,
    };
    expect(Webhooks.verifySignature({ ...base, now: () => NOW() + 300_000 })).toBe(true);
    expect(Webhooks.verifySignature({ ...base, now: () => NOW() + 301_000 })).toBe(false);
  });
});
