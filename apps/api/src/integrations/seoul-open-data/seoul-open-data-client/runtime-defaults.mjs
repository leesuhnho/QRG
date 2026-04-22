export const DEFAULT_BASE_URL = "http://openapi.seoul.go.kr:8088";
export const DEFAULT_TIMEOUT_MS = 20_000;
export const DEFAULT_PAGE_SIZE = 1_000;
export const DEFAULT_MAX_PAGES = 2_000;

/**
 * @param {string} name
 * @param {number} value
 */
export function assertPositiveIntegerOption(name, value) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
}

/**
 * @param {Date} [date]
 * @returns {string}
 */
export function createRunLabel(date = new Date()) {
  return date.toISOString().replace(/[:.]/g, "-");
}
