import assert from "node:assert/strict";

import { parseOpenApiViewHtml } from "../../../../apps/api/src/integrations/seoul-open-data/open-api-html-parser.mjs";

import { CITYDATA_OPEN_API_HTML, PARKS_OPEN_API_HTML } from "./fixtures.mjs";

export function runParseOpenApiViewHtmlTests() {
  {
    const parsed = parseOpenApiViewHtml(CITYDATA_OPEN_API_HTML);

    assert.equal(parsed.serviceName, "citydata");
    assert.equal(parsed.supportsPagination, true);
    assert.deepEqual(
      parsed.extraParameters.map((parameter) => parameter.name),
      ["AREA_NM"]
    );
    assert.equal(parsed.extraParameters[0].required, true);
    assert.equal(
      parsed.sampleUrls[0],
      "http://openAPI.seoul.go.kr:8088/(\uC778\uC99D\uD0A4)/xml/citydata/1/5/\uAD11\uD654\uBB38\u00B7\uB355\uC218\uAD81"
    );
  }

  {
    const parsed = parseOpenApiViewHtml(PARKS_OPEN_API_HTML);

    assert.equal(parsed.serviceName, "SearchParkInfoService");
    assert.deepEqual(parsed.extraParameters, [
      {
        name: "SN",
        type: "NUMBER(\uC120\uD0DD)",
        description: "\uC77C\uB828\uBC88\uD638",
        valueDescription: "\uC22B\uC790",
        required: false,
        system: false
      }
    ]);
  }
}
