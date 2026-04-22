import assert from "node:assert/strict";

import { parseSeoulOpenApiJsonResponse } from "../../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

export function runParseSeoulOpenApiJsonResponseTests() {
  {
    let error;
    try {
      parseSeoulOpenApiJsonResponse(
        "<RESULT><CODE>ERROR-335</CODE><MESSAGE><![CDATA[sample keys only allow rows 1..5]]></MESSAGE></RESULT>",
        "http://openapi.seoul.go.kr:8088/real-api-key/json/TbTraficWlkNet/1/1000/"
      );
    } catch (caughtError) {
      error = caughtError;
    }

    assert.ok(error instanceof Error);
    assert.match(error.message, /ERROR-335/);
    assert.match(error.message, /rows 1\.\.5/);
    assert.match(error.message, /\[redacted\]\/json\/TbTraficWlkNet\/1\/1000/);
    assert.doesNotMatch(error.message, /real-api-key/);
    assert.equal(error.retriable, false);
  }

  {
    let error;
    try {
      parseSeoulOpenApiJsonResponse(
        "<html><body>temporary maintenance</body></html>",
        "http://openapi.seoul.go.kr:8088/sample-key/json/TbTraficWlkNet/1/1000/"
      );
    } catch (caughtError) {
      error = caughtError;
    }

    assert.ok(error instanceof Error);
    assert.match(error.message, /received markup/);
    assert.equal(error.retriable, undefined);
  }
}
