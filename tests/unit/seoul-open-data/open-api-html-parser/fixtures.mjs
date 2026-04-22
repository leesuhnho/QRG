const REQUEST_SECTION_START = "<h2>\uC694\uCCAD\uC778\uC790</h2>";
const REQUEST_SECTION_END = "<h2>\uCD9C\uB825\uAC12</h2>";

export const CITYDATA_OPEN_API_HTML = `
  <div class="detail-cont-tit mgt-m">${REQUEST_SECTION_START}</div>
  <div class="tbl-base-s">
    <table>
      <tbody>
        <tr><td>KEY</td><td>String(\uD544\uC218)</td><td>\uC778\uC99D\uD0A4</td><td>OpenAPI \uC5D0\uC11C \uBC1C\uAE09\uD55C \uC778\uC99D\uD0A4</td></tr>
        <tr><td>TYPE</td><td>String(\uD544\uC218)</td><td>\uC751\uB2F5 \uD615\uC2DD</td><td><p>xml : xml</p></td></tr>
        <tr><td>SERVICE</td><td>String(\uD544\uC218)</td><td>\uC11C\uBE44\uC2A4\uBA85</td><td>citydata</td></tr>
        <tr><td>START_INDEX</td><td>INTEGER(\uD544\uC218)</td><td>\uC694\uCCAD \uC2DC\uC791 \uC704\uCE58</td><td>\uD544\uC218 \uC785\uB825</td></tr>
        <tr><td>END_INDEX</td><td>INTEGER(\uD544\uC218)</td><td>\uC694\uCCAD \uC885\uB8CC \uC704\uCE58</td><td>\uD544\uC218 \uC785\uB825</td></tr>
        <tr><td>AREA_NM</td><td>STRING(\uD544\uC218)</td><td>\uD56B\uC2A4\uD3FF \uC774\uB984</td><td>\uC7A5\uC18C\uBA85 \uB610\uB294 \uC7A5\uC18C\uCF54\uB4DC \uC785\uB825</td></tr>
      </tbody>
    </table>
  </div>
  <a href="http://openAPI.seoul.go.kr:8088/sample/xml/citydata/1/5/\uAD11\uD654\uBB38\u00B7\uB355\uC218\uAD81">
    http://openAPI.seoul.go.kr:8088/(\uC778\uC99D\uD0A4)/xml/citydata/1/5/\uAD11\uD654\uBB38\u00B7\uB355\uC218\uAD81
  </a>
  <div class="detail-cont-tit mgt-m">${REQUEST_SECTION_END}</div>
`;

export const PARKS_OPEN_API_HTML = `
  <div class="detail-cont-tit mgt-m">${REQUEST_SECTION_START}</div>
  <div class="tbl-base-s">
    <table>
      <tbody>
        <tr><td>KEY</td><td>String(\uD544\uC218)</td><td>\uC778\uC99D\uD0A4</td><td>OpenAPI \uC5D0\uC11C \uBC1C\uAE09\uD55C \uC778\uC99D\uD0A4</td></tr>
        <tr><td>TYPE</td><td>String(\uD544\uC218)</td><td>\uC751\uB2F5 \uD615\uC2DD</td><td><p>xml : xml</p></td></tr>
        <tr><td>SERVICE</td><td>String(\uD544\uC218)</td><td>\uC11C\uBE44\uC2A4\uBA85</td><td>SearchParkInfoService</td></tr>
        <tr><td>START_INDEX</td><td>INTEGER(\uD544\uC218)</td><td>\uC694\uCCAD \uC2DC\uC791 \uC704\uCE58</td><td>\uD544\uC218 \uC785\uB825</td></tr>
        <tr><td>END_INDEX</td><td>INTEGER(\uD544\uC218)</td><td>\uC694\uCCAD \uC885\uB8CC \uC704\uCE58</td><td>\uD544\uC218 \uC785\uB825</td></tr>
        <tr><td>SN</td><td>NUMBER(\uC120\uD0DD)</td><td>\uC77C\uB828\uBC88\uD638</td><td>\uC22B\uC790</td></tr>
      </tbody>
    </table>
  </div>
  <a href="http://openAPI.seoul.go.kr:8088/sample/xml/SearchParkInfoService/1/5/">
    http://openAPI.seoul.go.kr:8088/(\uC778\uC99D\uD0A4)/xml/SearchParkInfoService/1/5/
  </a>
  <div class="detail-cont-tit mgt-m">${REQUEST_SECTION_END}</div>
`;
