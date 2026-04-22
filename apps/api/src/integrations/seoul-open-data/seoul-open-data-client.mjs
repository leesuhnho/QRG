/**
 * @typedef {Object} CliStyleOptions
 * @property {string} [date]
 * @property {string} [month]
 * @property {string[]} [areaNames]
 * @property {string[]} [areaCodes]
 * @property {string[]} [districts]
 * @property {Record<string, string|string[]>} [params]
 * @property {number} [pageSize]
 * @property {number} [maxPages]
 * @property {boolean} [savePages]
 * @property {string} [outputDir]
 * @property {string} [runLabel]
 * @property {number} [timeoutMs]
 * @property {string} [baseUrl]
 * @property {Date} [now]
 */

export { collectDataset } from "./seoul-open-data-client/collect-dataset.mjs";
export { loadEnvironmentFile } from "./seoul-open-data-client/environment.mjs";
export { buildOpenApiUrl } from "./seoul-open-data-client/open-api-url.mjs";
export {
  extractCollectionItems,
  parseSeoulOpenApiJsonResponse
} from "./seoul-open-data-client/payload-utils.mjs";
export { resolveParameterValues } from "./seoul-open-data-client/parameter-resolution.mjs";
export { discoverOpenApiSpec } from "./seoul-open-data-client/spec-discovery.mjs";
