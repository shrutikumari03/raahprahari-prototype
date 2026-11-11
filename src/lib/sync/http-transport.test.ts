import { afterEach, describe, expect, it, vi } from "vitest";
import { createHttpTransport } from "@/lib/sync/http-transport";
import type { ReportMetadataPayload } from "@/lib/sync/contract";

const reportId = "c63f7250-faa2-4e31-b46f-99c4b90fc133";
const payload: ReportMetadataPayload = {
  schemaVersion: 1,
  reportId,
  eventTime: "2026-10-25T04:30:00.000Z",
  clientSavedAt: "2026-10-25T05:00:00.000Z",
  hazardType: "landslide",
  description: "Loose debris on the road.",
  location: {
    lat: 30.555,
    lon: 79.5643,
    accuracyM: null,
    source: "manual",
    confirmed: true,
    roadSegment: "NH-7",
    query: "Joshimath",
  },
  attachments: [],
};

const context = {
  signal: new AbortController().signal,
  accessToken: "temporary-test-token",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HTTP report transport", () => {
  it("sends an idempotent metadata PUT and accepts a valid conflict receipt", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            reportId,
            receiptId: "rcpt-1",
            receivedAt: "2026-10-28T04:30:00.000Z",
            duplicate: true,
          }),
          { status: 409 },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const transport = createHttpTransport("https://reports.example/api/");

    const result = await transport.sendMetadata(payload, context);

    expect(result).toMatchObject({
      ok: true,
      value: { reportId, receiptId: "rcpt-1", duplicate: true },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `https://reports.example/api/reports/${reportId}`,
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "Idempotency-Key": reportId,
          Authorization: "Bearer temporary-test-token",
        }),
      }),
    );
  });

  it("maps malformed JSON, report ID mismatch, rejection, and Retry-After", async () => {
    const transport = createHttpTransport("https://reports.example");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("{", { status: 200 }))
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              reportId: "3e9548a0-c370-4c72-8853-91f8176b8ca5",
              receiptId: "wrong-report",
              receivedAt: "2026-10-28T04:30:00.000Z",
              duplicate: false,
            }),
            { status: 200 },
          ),
        )
        .mockResolvedValueOnce(new Response("", { status: 422 }))
        .mockResolvedValueOnce(
          new Response("", { status: 429, headers: { "Retry-After": "60" } }),
        ),
    );

    const malformedJson = await transport.sendMetadata(payload, context);
    const mismatched = await transport.sendMetadata(payload, context);
    const rejected = await transport.sendMetadata(payload, context);
    const limited = await transport.sendMetadata(payload, context);

    expect(malformedJson).toMatchObject({
      ok: false,
      error: { kind: "malformed_response", retryable: true },
    });
    expect(mismatched).toMatchObject({
      ok: false,
      error: { kind: "malformed_response", retryable: true },
    });
    expect(rejected).toMatchObject({
      ok: false,
      error: { kind: "rejected", retryable: false },
    });
    expect(limited).toMatchObject({
      ok: false,
      error: { kind: "server", retryable: true, retryAfterMs: 60_000 },
    });
  });

  it("uploads to signed URLs without adding the application authorization header", async () => {
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        expect(input).toBe("https://storage.example/signed");
        expect(init).toBeDefined();
        return new Response(null, { status: 200 });
      },
    );
    vi.stubGlobal("fetch", fetchMock);
    const transport = createHttpTransport("https://reports.example");
    const target = {
      uploadUrl: "https://storage.example/signed",
      method: "PUT" as const,
      headers: { "X-Upload-Signature": "signed-header" },
      expiresAt: "2026-10-28T04:30:00.000Z",
    };

    const result = await transport.uploadBlob(
      target,
      new Blob(["photo"], { type: "image/jpeg" }),
      {
        signal: context.signal,
      },
    );
    const request = fetchMock.mock.calls[0]?.[1];

    expect(result.ok).toBe(true);
    expect(request?.headers).toMatchObject({
      "X-Upload-Signature": "signed-header",
      "Content-Type": "image/jpeg",
    });
    expect(
      (request?.headers as Record<string, string>).Authorization,
    ).toBeUndefined();
  });
});
