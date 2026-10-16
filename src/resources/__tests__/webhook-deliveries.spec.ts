import { beforeEach, describe, expect, it, vi } from "vitest";

import { HttpClient } from "../../core/http-client.js";
import { ConflictError, NotFoundError } from "../../core/errors.js";
import { Webhooks } from "../webhooks.js";

const WEBHOOK_ID = "wh_123";
const DELIVERY_ID = "9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d";
const BASE = "https://api.coffeemail.com.br/v1/product/webhooks";

const delivery = {
  id: DELIVERY_ID,
  webhookId: "1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e",
  emailEventId: null,
  eventType: "email.delivered",
  responseStatus: 500,
  responseBody: "erro",
  attempts: 5,
  lastError: "HTTP 500",
  status: "exhausted",
  nextRunAt: "2026-10-15T12:00:00.000Z",
  createdAt: "2026-10-15T11:00:00.000Z",
  requestPayload: "{\"type\":\"email.delivered\"}",
};

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status < 400,
  status,
  text: async () => JSON.stringify(body),
});

const apiError = (status: number, code: string) =>
  jsonResponse({ error: { code, message: code } }, status);

describe("Webhooks — entregas", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let webhooks: Webhooks;

  beforeEach(() => {
    mockFetch = vi.fn();
    webhooks = new Webhooks(new HttpClient("cm_live_teste123", { fetch: mockFetch }));
  });

  describe("getDelivery", () => {
    it("faz GET em /webhooks/{id}/deliveries/{deliveryId} e devolve requestPayload", async () => {
      mockFetch.mockResolvedValue(jsonResponse(delivery));

      const { data, error } = await webhooks.getDelivery(WEBHOOK_ID, DELIVERY_ID);

      expect(error).toBeNull();
      expect(data).toEqual(delivery);
      expect(data?.requestPayload).toBe("{\"type\":\"email.delivered\"}");
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/${WEBHOOK_ID}/deliveries/${DELIVERY_ID}`,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it.each(["WEBHOOK_NOT_FOUND", "WEBHOOK_DELIVERY_NOT_FOUND"])(
      "devolve NotFoundError com apiCode %s",
      async (code) => {
        mockFetch.mockResolvedValue(apiError(404, code));

        const { data, error } = await webhooks.getDelivery(WEBHOOK_ID, DELIVERY_ID);

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error?.apiCode).toBe(code);
      },
    );
  });

  describe("replayDelivery", () => {
    it("faz POST sem corpo em /replay e devolve a entrega nova pendente (202)", async () => {
      const replayed = {
        ...delivery,
        id: "0f9e8d7c-6b5a-4f3e-9d2c-1b0a9f8e7d6c",
        status: "pending",
        attempts: 0,
        responseStatus: null,
        responseBody: null,
        lastError: null,
      };
      mockFetch.mockResolvedValue(jsonResponse(replayed, 202));

      const { data, error } = await webhooks.replayDelivery(WEBHOOK_ID, DELIVERY_ID);

      expect(error).toBeNull();
      expect(data).toEqual(replayed);
      expect(data?.status).toBe("pending");
      expect(mockFetch).toHaveBeenCalledWith(
        `${BASE}/${WEBHOOK_ID}/deliveries/${DELIVERY_ID}/replay`,
        expect.objectContaining({ method: "POST" }),
      );
      expect(mockFetch.mock.calls[0]?.[1]?.body).toBeUndefined();
    });

    it.each(["WEBHOOK_DELIVERY_PENDING", "WEBHOOK_NOT_ACTIVE"])(
      "devolve ConflictError com apiCode %s",
      async (code) => {
        mockFetch.mockResolvedValue(apiError(409, code));

        const { data, error } = await webhooks.replayDelivery(WEBHOOK_ID, DELIVERY_ID);

        expect(data).toBeNull();
        expect(error).toBeInstanceOf(ConflictError);
        expect(error?.apiCode).toBe(code);
      },
    );

    it.each(["WEBHOOK_NOT_FOUND", "WEBHOOK_DELIVERY_NOT_FOUND"])(
      "devolve NotFoundError com apiCode %s",
      async (code) => {
        mockFetch.mockResolvedValue(apiError(404, code));

        const { error } = await webhooks.replayDelivery(WEBHOOK_ID, DELIVERY_ID);

        expect(error).toBeInstanceOf(NotFoundError);
        expect(error?.apiCode).toBe(code);
      },
    );
  });
});
