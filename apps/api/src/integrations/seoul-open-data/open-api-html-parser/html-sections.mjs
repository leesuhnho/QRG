import { stripTags } from "./html-text.mjs";

/**
 * @param {string} html
 * @param {string} startMarker
 * @param {string} endMarker
 * @returns {string}
 */
export function extractSection(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start < 0) {
    throw new Error(`Could not find section start marker: ${startMarker}`);
  }

  const end = html.indexOf(endMarker, start);
  if (end < 0) {
    throw new Error(`Could not find section end marker: ${endMarker}`);
  }

  return html.slice(start, end);
}

/**
 * @param {string} tableHtml
 * @returns {string[][]}
 */
export function parseTableRows(tableHtml) {
  const rows = [];
  const rowMatches = tableHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi);

  for (const rowMatch of rowMatches) {
    const rowHtml = rowMatch[0];
    const cells = [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(
      (cellMatch) => stripTags(cellMatch[1])
    );

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return rows;
}

/**
 * @param {string} html
 * @returns {string[]}
 */
export function extractSampleUrls(html) {
  const urls = [...html.matchAll(/https?:\/\/openapi\.seoul\.go\.kr:8088\/[^"<\s]+/gi)].map(
    (match) => match[0].trim()
  );
  const preferredUrls = urls.filter((url) => !/\/sample\//i.test(url));
  const selectedUrls = preferredUrls.length > 0 ? preferredUrls : urls;
  return [...new Set(selectedUrls)];
}
