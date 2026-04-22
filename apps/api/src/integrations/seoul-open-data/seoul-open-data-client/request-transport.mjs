import {
  createSeoulOpenApiError,
  extractResult,
  isNonRetriableError,
  parseResultXmlPayload,
  parseSeoulOpenApiJsonResponse,
  sanitizeSeoulOpenApiContext
} from "./payload-utils.mjs";

/**
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<string>}
 */
export async function getText(url, timeoutMs) {
  const safeUrl = sanitizeSeoulOpenApiContext(url);
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs)
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} for ${safeUrl}`);
  }

  return response.text();
}

/**
 * @param {string} url
 * @param {number} timeoutMs
 * @param {number} retries
 * @returns {Promise<string>}
 */
export async function getTextWithRetry(url, timeoutMs, retries = 2) {
  let attempt = 0;
  /** @type {unknown} */
  let lastError;

  while (attempt <= retries) {
    try {
      return await getText(url, timeoutMs);
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

/**
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<any>}
 */
export async function getJson(url, timeoutMs) {
  const safeUrl = sanitizeSeoulOpenApiContext(url);
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs)
  });

  const bodyText = await response.text();

  if (!response.ok) {
    const xmlResult = parseResultXmlPayload(bodyText.trim());
    if (xmlResult) {
      throw createSeoulOpenApiError(url, xmlResult);
    }

    try {
      const payload = JSON.parse(bodyText);
      const result = extractResult(payload);
      if (result.code || result.message) {
        throw createSeoulOpenApiError(url, result);
      }
    } catch (error) {
      if (isNonRetriableError(error)) {
        throw error;
      }
    }

    throw new Error(`Request failed with status ${response.status} for ${safeUrl}`);
  }

  return parseSeoulOpenApiJsonResponse(bodyText, url);
}

/**
 * @param {string} url
 * @param {number} timeoutMs
 * @param {number} retries
 * @returns {Promise<any>}
 */
export async function getJsonWithRetry(url, timeoutMs, retries = 2) {
  let attempt = 0;
  /** @type {unknown} */
  let lastError;

  while (attempt <= retries) {
    try {
      return await getJson(url, timeoutMs);
    } catch (error) {
      lastError = error;
      if (attempt === retries || isNonRetriableError(error)) {
        break;
      }

      const backoffMs = 500 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      attempt += 1;
    }
  }

  throw lastError;
}
