import { HTML_ENTITIES } from "./constants.mjs";

/**
 * @param {string} html
 * @returns {string}
 */
export function decodeHtmlEntities(html) {
  let decoded = html;

  for (const [entity, replacement] of HTML_ENTITIES.entries()) {
    decoded = decoded.split(entity).join(replacement);
  }

  return decoded.replace(/&#(\d+);/g, (_, codePoint) =>
    String.fromCodePoint(Number(codePoint))
  );
}

/**
 * @param {string} html
 * @returns {string}
 */
export function stripTags(html) {
  return decodeHtmlEntities(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]+\n/g, "\n")
    .replace(/\n[ ]+/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}
