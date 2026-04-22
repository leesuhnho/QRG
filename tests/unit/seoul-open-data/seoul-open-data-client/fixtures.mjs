const CITYDATA_REQUEST_SECTION_START = "<h2>\uC694\uCCAD\uC778\uC790</h2>";
const CITYDATA_REQUEST_SECTION_END = "<h2>\uCD9C\uB825\uAC12</h2>";

export const CITYDATA_OPEN_API_HTML = `
  <div class="detail-cont-tit mgt-m">${CITYDATA_REQUEST_SECTION_START}</div>
  <div class="tbl-base-s">
    <table>
      <tbody>
        <tr><td>KEY</td><td>String(\uD544\uC218)</td><td>auth</td><td>api key</td></tr>
        <tr><td>TYPE</td><td>String(\uD544\uC218)</td><td>type</td><td><p>xml : xml</p></td></tr>
        <tr><td>SERVICE</td><td>String(\uD544\uC218)</td><td>service</td><td>citydata</td></tr>
        <tr><td>START_INDEX</td><td>INTEGER(\uD544\uC218)</td><td>start</td><td>required</td></tr>
        <tr><td>END_INDEX</td><td>INTEGER(\uD544\uC218)</td><td>end</td><td>required</td></tr>
        <tr><td>AREA_NM</td><td>STRING(\uD544\uC218)</td><td>area</td><td>required</td></tr>
      </tbody>
    </table>
  </div>
  <a href="http://openAPI.seoul.go.kr:8088/sample/xml/citydata/1/5/Gangnam%20Station">
    http://openAPI.seoul.go.kr:8088/sample/xml/citydata/1/5/Gangnam%20Station
  </a>
  <div class="detail-cont-tit mgt-m">${CITYDATA_REQUEST_SECTION_END}</div>
`;

export const SINGLE_PAYLOAD_URL =
  "http://openapi.seoul.go.kr:8088/real-api-key/json/citydata/1/5/Gangnam%20Station";
export const PROXIED_SINGLE_PAYLOAD_URL =
  "https://proxy.example.com/seoul/real-api-key/json/citydata/1/5/Gangnam%20Station";
export const PAGED_URL =
  "http://openapi.seoul.go.kr:8088/real-api-key/json/citydata/1/1000/Gangnam%20Station";

export const REDACTED_SINGLE_PAYLOAD_URL =
  "http://openapi.seoul.go.kr:8088/[redacted]/json/citydata/1/5/Gangnam%20Station";
export const REDACTED_PROXIED_SINGLE_PAYLOAD_URL =
  "https://proxy.example.com/seoul/[redacted]/json/citydata/1/5/Gangnam%20Station";
export const REDACTED_PAGED_URL =
  "http://openapi.seoul.go.kr:8088/[redacted]/json/citydata/1/1000/Gangnam%20Station";

export const SINGLE_PAYLOAD_RESPONSE = {
  list_total_count: 1,
  RESULT: {
    "RESULT.CODE": "INFO-000",
    "RESULT.MESSAGE": "Success"
  },
  CITYDATA: {
    AREA_NM: "Gangnam Station"
  }
};

export const PAGED_RESPONSE = {
  citydata: {
    list_total_count: 1,
    RESULT: {
      CODE: "INFO-000",
      MESSAGE: "Success"
    },
    row: [{ AREA_NM: "Gangnam Station" }]
  }
};
