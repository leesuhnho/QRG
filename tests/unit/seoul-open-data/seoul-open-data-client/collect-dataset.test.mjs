import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";

import { collectDataset } from "../../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

import {
  CITYDATA_OPEN_API_HTML,
  PAGED_RESPONSE,
  PAGED_URL,
  PROXIED_SINGLE_PAYLOAD_URL,
  REDACTED_PAGED_URL,
  REDACTED_PROXIED_SINGLE_PAYLOAD_URL,
  REDACTED_SINGLE_PAYLOAD_URL,
  SINGLE_PAYLOAD_RESPONSE,
  SINGLE_PAYLOAD_URL
} from "./fixtures.mjs";

export async function runCollectDatasetTests() {
  {
    /** @type {typeof fetch} */
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;

    globalThis.fetch = async () => {
      fetchCalls += 1;
      throw new Error("collectDataset should validate options before fetching");
    };

    try {
      for (const invalidPageSize of [Number.NaN, 0, -1]) {
        await assert.rejects(
          collectDataset(
            {
              id: "invalid-page-size",
              infId: "OA-INVALID-PAGE-SIZE",
              title: "Invalid Page Size",
              collectionMode: "pagedRows"
            },
            "real-api-key",
            {
              pageSize: invalidPageSize
            }
          ),
          /pageSize must be a positive integer/
        );
      }

      for (const invalidMaxPages of [Number.NaN, 0, -1]) {
        await assert.rejects(
          collectDataset(
            {
              id: "invalid-max-pages",
              infId: "OA-INVALID-MAX-PAGES",
              title: "Invalid Max Pages",
              collectionMode: "pagedRows"
            },
            "real-api-key",
            {
              maxPages: invalidMaxPages
            }
          ),
          /maxPages must be a positive integer/
        );
      }

      assert.equal(fetchCalls, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  }

  {
    const outputDir = path.resolve(
      "data/tmp",
      `seoul-open-data-client-tests-${process.pid}-${Date.now()}`
    );

    /** @type {typeof fetch} */
    const originalFetch = globalThis.fetch;
    let singlePayloadAttempts = 0;
    let proxiedSinglePayloadAttempts = 0;
    let pagedAttempts = 0;

    globalThis.fetch = async (url) => {
      const requestUrl = String(url);

      if (requestUrl.includes("openApiView.do")) {
        return new Response(CITYDATA_OPEN_API_HTML, { status: 200 });
      }

      if (requestUrl === SINGLE_PAYLOAD_URL) {
        singlePayloadAttempts += 1;
        return new Response(
          singlePayloadAttempts === 1 ? "" : JSON.stringify(SINGLE_PAYLOAD_RESPONSE),
          { status: 200 }
        );
      }

      if (requestUrl === PROXIED_SINGLE_PAYLOAD_URL) {
        proxiedSinglePayloadAttempts += 1;
        return new Response(JSON.stringify(SINGLE_PAYLOAD_RESPONSE), { status: 200 });
      }

      if (requestUrl === PAGED_URL) {
        pagedAttempts += 1;
        return new Response(JSON.stringify(PAGED_RESPONSE), { status: 200 });
      }

      throw new Error(`Unexpected fetch URL in test: ${requestUrl}`);
    };

    try {
      const singlePayloadResult = await collectDataset(
        {
          id: "citydata-single",
          infId: "OA-TEST-CITYDATA",
          title: "Citydata Single Payload",
          collectionMode: "singlePayload"
        },
        "real-api-key",
        {
          areaNames: ["Gangnam Station"],
          outputDir,
          runLabel: "single"
        }
      );

      const singleManifestText = await readFile(
        path.join(singlePayloadResult.outputDirectory, "manifest.json"),
        "utf8"
      );
      const singleDataText = await readFile(
        path.join(singlePayloadResult.outputDirectory, "data.json"),
        "utf8"
      );
      const singleManifest = JSON.parse(singleManifestText);
      const singleData = JSON.parse(singleDataText);

      assert.equal(singlePayloadAttempts, 2);
      assert.equal(singleManifest.requests[0].url, REDACTED_SINGLE_PAYLOAD_URL);
      assert.equal(singleData[0].meta.url, REDACTED_SINGLE_PAYLOAD_URL);
      assert.doesNotMatch(singleManifestText, /real-api-key/);
      assert.doesNotMatch(singleDataText, /real-api-key/);

      const proxiedSinglePayloadResult = await collectDataset(
        {
          id: "citydata-single-proxy",
          infId: "OA-TEST-CITYDATA",
          title: "Citydata Single Payload Proxy",
          collectionMode: "singlePayload"
        },
        "real-api-key",
        {
          areaNames: ["Gangnam Station"],
          outputDir,
          runLabel: "single-proxy",
          baseUrl: "https://proxy.example.com/seoul"
        }
      );

      const proxiedSingleManifestText = await readFile(
        path.join(proxiedSinglePayloadResult.outputDirectory, "manifest.json"),
        "utf8"
      );
      const proxiedSingleDataText = await readFile(
        path.join(proxiedSinglePayloadResult.outputDirectory, "data.json"),
        "utf8"
      );
      const proxiedSingleManifest = JSON.parse(proxiedSingleManifestText);
      const proxiedSingleData = JSON.parse(proxiedSingleDataText);

      assert.equal(proxiedSinglePayloadAttempts, 1);
      assert.equal(proxiedSingleManifest.requests[0].url, REDACTED_PROXIED_SINGLE_PAYLOAD_URL);
      assert.equal(proxiedSingleData[0].meta.url, REDACTED_PROXIED_SINGLE_PAYLOAD_URL);
      assert.doesNotMatch(proxiedSingleManifestText, /real-api-key/);
      assert.doesNotMatch(proxiedSingleDataText, /real-api-key/);

      const pagedResult = await collectDataset(
        {
          id: "citydata-paged",
          infId: "OA-TEST-CITYDATA",
          title: "Citydata Paged",
          collectionMode: "pagedRows"
        },
        "real-api-key",
        {
          areaNames: ["Gangnam Station"],
          outputDir,
          runLabel: "paged"
        }
      );

      const pagedManifestText = await readFile(
        path.join(pagedResult.outputDirectory, "manifest.json"),
        "utf8"
      );
      const pagedDataText = await readFile(
        path.join(pagedResult.outputDirectory, "data.json"),
        "utf8"
      );
      const pagedManifest = JSON.parse(pagedManifestText);
      const pagedData = JSON.parse(pagedDataText);

      assert.equal(pagedAttempts, 1);
      assert.deepEqual(pagedManifest.requests[0].pageUrls, [REDACTED_PAGED_URL]);
      assert.deepEqual(pagedData[0].meta.pageUrls, [REDACTED_PAGED_URL]);
      assert.doesNotMatch(pagedManifestText, /real-api-key/);
      assert.doesNotMatch(pagedDataText, /real-api-key/);
    } finally {
      globalThis.fetch = originalFetch;
      try {
        await rm(outputDir, { recursive: true, force: true });
      } catch (error) {
        if (error && typeof error === "object" && error.code !== "EPERM") {
          throw error;
        }
      }
    }
  }
}
