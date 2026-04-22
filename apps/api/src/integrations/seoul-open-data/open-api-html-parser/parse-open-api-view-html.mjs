import {
  REQUEST_SECTION_END_MARKER,
  REQUEST_SECTION_START_MARKER
} from "./constants.mjs";
import { extractSampleUrls, extractSection, parseTableRows } from "./html-sections.mjs";
import { mapRequestParameters } from "./request-parameters.mjs";

/**
 * @param {string} html
 * @returns {{
 *   serviceName: string;
 *   sampleUrls: string[];
 *   requestParameters: Array<{
 *     name: string;
 *     type: string;
 *     description: string;
 *     valueDescription: string;
 *     required: boolean;
 *     system: boolean;
 *   }>;
 *   extraParameters: Array<{
 *     name: string;
 *     type: string;
 *     description: string;
 *     valueDescription: string;
 *     required: boolean;
 *     system: boolean;
 *   }>;
 *   supportsPagination: boolean;
 * }}
 */
export function parseOpenApiViewHtml(html) {
  const requestSection = extractSection(
    html,
    REQUEST_SECTION_START_MARKER,
    REQUEST_SECTION_END_MARKER
  );
  const requestRows = parseTableRows(requestSection);
  const { serviceName, requestParameters, extraParameters } =
    mapRequestParameters(requestRows);

  return {
    serviceName,
    sampleUrls: extractSampleUrls(html),
    requestParameters,
    extraParameters,
    supportsPagination:
      requestParameters.some((parameter) => parameter.name === "START_INDEX") &&
      requestParameters.some((parameter) => parameter.name === "END_INDEX")
  };
}
