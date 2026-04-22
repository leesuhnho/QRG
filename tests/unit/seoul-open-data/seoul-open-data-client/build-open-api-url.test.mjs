import assert from "node:assert/strict";

import { buildOpenApiUrl } from "../../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

export function runBuildOpenApiUrlTests() {
  const url = buildOpenApiUrl(
    "sample-key",
    "citydata",
    1,
    5,
    { AREA_NM: "Gangnam Station" },
    { baseUrl: "http://openapi.seoul.go.kr:8088" }
  );

  assert.equal(
    url,
    "http://openapi.seoul.go.kr:8088/sample-key/json/citydata/1/5/Gangnam%20Station"
  );
}
