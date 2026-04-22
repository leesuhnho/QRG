import assert from "node:assert/strict";

import { discoverOpenApiSpec } from "../../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

import { CITYDATA_OPEN_API_HTML } from "./fixtures.mjs";

export async function runDiscoverOpenApiSpecTests() {
  /** @type {typeof fetch} */
  const originalFetch = globalThis.fetch;
  let specAttempts = 0;

  globalThis.fetch = async () => {
    specAttempts += 1;
    return new Response(
      specAttempts === 1 ? "<html><body>temporary maintenance</body></html>" : CITYDATA_OPEN_API_HTML,
      { status: 200 }
    );
  };

  try {
    const spec = await discoverOpenApiSpec("OA-TEST-RETRY", {
      forceRefresh: true
    });

    assert.equal(specAttempts, 2);
    assert.equal(spec.serviceName, "citydata");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
