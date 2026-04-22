import { parseOpenApiViewHtml } from "../open-api-html-parser.mjs";
import { DEFAULT_TIMEOUT_MS } from "./runtime-defaults.mjs";
import { getText } from "./request-transport.mjs";

const specCache = new Map();

/**
 * @param {string} infId
 * @param {{ timeoutMs?: number, forceRefresh?: boolean }} [options]
 * @returns {Promise<ReturnType<typeof parseOpenApiViewHtml> & { infId: string }>}
 */
export async function discoverOpenApiSpec(infId, options = {}) {
  if (!options.forceRefresh && specCache.has(infId)) {
    return specCache.get(infId);
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const url = `https://data.seoul.go.kr/dataList/openApiView.do?infId=${encodeURIComponent(infId)}&srvType=A`;
  const retries = 2;

  let attempt = 0;
  /** @type {unknown} */
  let lastError;

  while (attempt <= retries) {
    try {
      const html = await getText(url, timeoutMs);
      const parsed = {
        infId,
        ...parseOpenApiViewHtml(html)
      };

      specCache.set(infId, parsed);
      return parsed;
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }

      const backoffMs = 400 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      attempt += 1;
    }
  }

  throw lastError;
}
