import { DEFAULT_BASE_URL } from "./runtime-defaults.mjs";

/**
 * @param {string} apiKey
 * @param {string} serviceName
 * @param {number} startIndex
 * @param {number} endIndex
 * @param {Record<string, string>} requestParameters
 * @param {{ baseUrl?: string, format?: string }} [options]
 * @returns {string}
 */
export function buildOpenApiUrl(
  apiKey,
  serviceName,
  startIndex,
  endIndex,
  requestParameters,
  options = {}
) {
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const format = options.format ?? "json";
  const segments = [apiKey, format, serviceName, String(startIndex), String(endIndex)];

  for (const value of Object.values(requestParameters)) {
    segments.push(value);
  }

  return `${baseUrl}/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`;
}
