const XML_ENTITIES = new Map([
  ["&amp;", "&"],
  ["&lt;", "<"],
  ["&gt;", ">"],
  ["&quot;", '"'],
  ["&apos;", "'"]
]);

/**
 * @param {string} value
 * @returns {string}
 */
function decodeXmlEntities(value) {
  let decoded = value;

  for (const [entity, replacement] of XML_ENTITIES.entries()) {
    decoded = decoded.split(entity).join(replacement);
  }

  return decoded.replace(/&#(\d+);/g, (_, codePoint) =>
    String.fromCodePoint(Number(codePoint))
  );
}

/**
 * @param {string} value
 * @returns {string}
 */
function unwrapXmlCdata(value) {
  const trimmed = value.trim();
  const cdataMatch = /^<!\[CDATA\[([\s\S]*?)\]\]>$/i.exec(trimmed);
  return cdataMatch ? cdataMatch[1] : trimmed;
}

/**
 * @param {string} xml
 * @param {string} tagName
 * @returns {string | undefined}
 */
function extractXmlTagValue(xml, tagName) {
  const match = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, "i").exec(xml);
  if (!match) {
    return undefined;
  }

  return decodeXmlEntities(unwrapXmlCdata(match[1])).trim();
}

/**
 * @param {string} xml
 * @returns {{ code?: string, message?: string } | null}
 */
export function parseResultXmlPayload(xml) {
  const resultMatch = /<RESULT>([\s\S]*?)<\/RESULT>/i.exec(xml);
  if (!resultMatch) {
    return null;
  }

  const code = extractXmlTagValue(resultMatch[1], "CODE");
  const message = extractXmlTagValue(resultMatch[1], "MESSAGE");
  if (!code && !message) {
    return null;
  }

  return { code, message };
}

/**
 * @param {string} context
 * @returns {string}
 */
export function sanitizeSeoulOpenApiContext(context) {
  try {
    const parsedUrl = new URL(context);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const formatSegmentIndex = pathSegments.findIndex(
      (segment, index) =>
        index >= 1 &&
        /^(json|xml)$/i.test(segment) &&
        pathSegments.length >= index + 4 &&
        /^\d+$/.test(pathSegments[index + 2]) &&
        /^\d+$/.test(pathSegments[index + 3])
    );
    if (formatSegmentIndex < 1) {
      return context;
    }

    pathSegments[formatSegmentIndex - 1] = "[redacted]";
    const trailingSlash = parsedUrl.pathname.endsWith("/") ? "/" : "";
    return `${parsedUrl.origin}/${pathSegments.join("/")}${trailingSlash}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return context;
  }
}

/**
 * @param {string} context
 * @param {{ code?: string, message?: string }} result
 * @returns {Error & { code?: string, result: { code?: string, message?: string }, retriable: false }}
 */
export function createSeoulOpenApiError(context, result) {
  const safeContext = sanitizeSeoulOpenApiContext(context);
  const details = [result.code, result.message].filter(Boolean).join(" - ");
  const error = new Error(
    details
      ? `Seoul OpenAPI request failed for ${safeContext}: ${details}`
      : `Seoul OpenAPI request failed for ${safeContext}.`
  );

  error.name = "SeoulOpenApiError";
  error.code = result.code;
  error.result = result;
  error.retriable = false;
  return error;
}

/**
 * @param {unknown} error
 * @returns {boolean}
 */
export function isNonRetriableError(error) {
  return Boolean(
    error && typeof error === "object" && "retriable" in error && error.retriable === false
  );
}

/**
 * @param {string} text
 * @param {string} url
 * @returns {any}
 */
export function parseSeoulOpenApiJsonResponse(text, url) {
  const safeUrl = sanitizeSeoulOpenApiContext(url);
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(`Received an empty Seoul OpenAPI response for ${safeUrl}.`);
  }

  if (trimmed.startsWith("<")) {
    const xmlResult = parseResultXmlPayload(trimmed);
    if (xmlResult) {
      throw createSeoulOpenApiError(url, xmlResult);
    }

    throw new Error(`Expected JSON but received markup from Seoul OpenAPI for ${safeUrl}.`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(
      `Failed to parse Seoul OpenAPI JSON response for ${safeUrl}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * @param {any} payload
 * @returns {{ code?: string, message?: string }}
 */
export function extractResult(payload) {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const result = payload.RESULT;
  if (!result || typeof result !== "object") {
    return {};
  }

  if ("CODE" in result || "MESSAGE" in result) {
    return {
      code: result.CODE,
      message: result.MESSAGE
    };
  }

  return {
    code: result["RESULT.CODE"],
    message: result["RESULT.MESSAGE"]
  };
}

/**
 * @param {any} payload
 * @returns {boolean}
 */
function isResultOnlyPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const keys = Object.keys(payload);
  return keys.length > 0 && keys.every((key) => key === "RESULT" || key === "list_total_count");
}

/**
 * @param {any} payload
 * @param {string} context
 * @param {string | null} envelopeKey
 * @returns {{ items: any[], totalCount: number, result: { code?: string, message?: string }, envelopeKey: string | null } | null}
 */
function buildResultOnlyCollection(payload, context, envelopeKey) {
  if (!isResultOnlyPayload(payload)) {
    return null;
  }

  const result = extractResult(payload);
  if (result.code === "INFO-200") {
    return {
      items: [],
      totalCount: typeof payload.list_total_count === "number" ? payload.list_total_count : 0,
      result,
      envelopeKey
    };
  }

  if (result.code || result.message) {
    throw createSeoulOpenApiError(context, result);
  }

  return null;
}

/**
 * @param {any} payload
 * @param {string} serviceName
 * @param {"pagedRows"|"singlePayload"} collectionMode
 * @returns {{ items: any[], totalCount: number | null, result: { code?: string, message?: string }, envelopeKey: string | null }}
 */
export function extractCollectionItems(payload, serviceName, collectionMode) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Unexpected payload shape: expected an object.");
  }

  if (collectionMode === "singlePayload" && payload.CITYDATA) {
    return {
      items: [payload.CITYDATA],
      totalCount: typeof payload.list_total_count === "number" ? payload.list_total_count : 1,
      result: extractResult(payload),
      envelopeKey: "CITYDATA"
    };
  }

  const directEnvelope = payload[serviceName];
  if (directEnvelope && typeof directEnvelope === "object") {
    if (Array.isArray(directEnvelope.row)) {
      return {
        items: directEnvelope.row,
        totalCount:
          typeof directEnvelope.list_total_count === "number"
            ? directEnvelope.list_total_count
            : null,
        result: extractResult(directEnvelope),
        envelopeKey: serviceName
      };
    }

    const directResultOnly = buildResultOnlyCollection(
      directEnvelope,
      `service ${serviceName}`,
      serviceName
    );
    if (directResultOnly) {
      return directResultOnly;
    }
  }

  const discovered = Object.entries(payload).find(([, value]) => {
    return Boolean(value && typeof value === "object" && Array.isArray(value.row));
  });

  if (discovered) {
    const [envelopeKey, envelope] = discovered;
    return {
      items: envelope.row,
      totalCount:
        typeof envelope.list_total_count === "number" ? envelope.list_total_count : null,
      result: extractResult(envelope),
      envelopeKey
    };
  }

  const rootResultOnly = buildResultOnlyCollection(payload, `service ${serviceName}`, null);
  if (rootResultOnly) {
    return rootResultOnly;
  }

  if (collectionMode === "singlePayload") {
    return {
      items: [payload],
      totalCount: 1,
      result: extractResult(payload),
      envelopeKey: null
    };
  }

  throw new Error(`Could not locate a row array for service ${serviceName}.`);
}
