import path from "node:path";

import { writeCollectionArtifacts } from "./artifacts.mjs";
import { buildOpenApiUrl } from "./open-api-url.mjs";
import { expandParameterSets, resolveParameterValues } from "./parameter-resolution.mjs";
import { extractCollectionItems, sanitizeSeoulOpenApiContext } from "./payload-utils.mjs";
import { getJsonWithRetry } from "./request-transport.mjs";
import {
  assertPositiveIntegerOption,
  createRunLabel,
  DEFAULT_BASE_URL,
  DEFAULT_MAX_PAGES,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TIMEOUT_MS
} from "./runtime-defaults.mjs";
import { discoverOpenApiSpec } from "./spec-discovery.mjs";

/**
 * @param {{ id: string, infId: string, title: string, collectionMode: "pagedRows"|"singlePayload" }} dataset
 * @param {string} apiKey
 * @param {import("../seoul-open-data-client.mjs").CliStyleOptions} [options]
 * @returns {Promise<{
 *   datasetId: string;
 *   datasetTitle: string;
 *   outputDirectory: string;
 *   requestsExecuted: number;
 *   itemsCollected: number;
 *   runLabel: string;
 * }>}
 */
export async function collectDataset(dataset, apiKey, options = {}) {
  const requestedPageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  assertPositiveIntegerOption("pageSize", requestedPageSize);

  const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES;
  assertPositiveIntegerOption("maxPages", maxPages);

  const spec = await discoverOpenApiSpec(dataset.infId, {
    timeoutMs: options.timeoutMs
  });

  const { parameterValues, missingRequired } = resolveParameterValues(spec, options);
  if (missingRequired.length > 0) {
    throw new Error(
      `${dataset.id} is missing required OpenAPI parameters: ${missingRequired.join(", ")}`
    );
  }

  const requestSets = expandParameterSets(parameterValues);
  const effectiveRequestSets = requestSets.length > 0 ? requestSets : [{}];
  const pageSize = Math.min(requestedPageSize, DEFAULT_PAGE_SIZE);
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const runLabel = options.runLabel ?? createRunLabel();

  /** @type {Array<Record<string, unknown>>} */
  const requestSummaries = [];
  /** @type {Array<{ parameters: Record<string, string>, items: any[], meta: Record<string, unknown> }>} */
  const collectedData = [];
  /** @type {Array<{ name: string, payload: unknown }>} */
  const savedPages = [];

  let totalItemsCollected = 0;

  for (let requestIndex = 0; requestIndex < effectiveRequestSets.length; requestIndex += 1) {
    const requestParameters = effectiveRequestSets[requestIndex];

    if (dataset.collectionMode === "singlePayload") {
      const url = buildOpenApiUrl(apiKey, spec.serviceName, 1, 5, requestParameters, {
        baseUrl
      });
      const safeUrl = sanitizeSeoulOpenApiContext(url);
      const payload = await getJsonWithRetry(url, timeoutMs);
      const collection = extractCollectionItems(payload, spec.serviceName, dataset.collectionMode);

      requestSummaries.push({
        requestIndex: requestIndex + 1,
        parameters: requestParameters,
        url: safeUrl,
        pageCount: 1,
        itemsCollected: collection.items.length,
        totalCount: collection.totalCount,
        result: collection.result
      });

      collectedData.push({
        parameters: requestParameters,
        items: collection.items,
        meta: {
          url: safeUrl,
          totalCount: collection.totalCount,
          result: collection.result,
          envelopeKey: collection.envelopeKey
        }
      });

      if (options.savePages) {
        savedPages.push({
          name: `request-${String(requestIndex + 1).padStart(3, "0")}`,
          payload
        });
      }

      totalItemsCollected += collection.items.length;
      continue;
    }

    let startIndex = 1;
    let pageCount = 0;
    let discoveredTotalCount = null;
    /** @type {any[]} */
    const aggregatedItems = [];
    /** @type {string[]} */
    const pageUrls = [];
    let lastResult = {};
    let exhaustedByLimit = true;

    while (pageCount < maxPages) {
      const endIndex = startIndex + pageSize - 1;
      const url = buildOpenApiUrl(apiKey, spec.serviceName, startIndex, endIndex, requestParameters, {
        baseUrl
      });
      const safeUrl = sanitizeSeoulOpenApiContext(url);
      const payload = await getJsonWithRetry(url, timeoutMs);
      const collection = extractCollectionItems(payload, spec.serviceName, dataset.collectionMode);

      pageUrls.push(safeUrl);
      lastResult = collection.result;
      pageCount += 1;

      if (options.savePages) {
        savedPages.push({
          name:
            `request-${String(requestIndex + 1).padStart(3, "0")}-page-${String(pageCount).padStart(4, "0")}`,
          payload
        });
      }

      aggregatedItems.push(...collection.items);
      if (collection.totalCount !== null) {
        discoveredTotalCount = collection.totalCount;
      }

      if (collection.items.length < pageSize) {
        exhaustedByLimit = false;
        break;
      }

      if (discoveredTotalCount !== null && aggregatedItems.length >= discoveredTotalCount) {
        exhaustedByLimit = false;
        break;
      }

      startIndex += pageSize;
    }

    if (exhaustedByLimit && pageCount >= maxPages) {
      throw new Error(
        `Reached maxPages=${maxPages} while collecting ${dataset.id}. Increase --max-pages if needed.`
      );
    }

    requestSummaries.push({
      requestIndex: requestIndex + 1,
      parameters: requestParameters,
      pageCount,
      itemsCollected: aggregatedItems.length,
      totalCount: discoveredTotalCount,
      result: lastResult,
      pageUrls
    });

    collectedData.push({
      parameters: requestParameters,
      items: aggregatedItems,
      meta: {
        pageCount,
        totalCount: discoveredTotalCount,
        result: lastResult,
        pageUrls
      }
    });

    totalItemsCollected += aggregatedItems.length;
  }

  const outputDir = options.outputDir ?? "data/raw/seoul-open-data";
  const manifest = {
    dataset: {
      id: dataset.id,
      infId: dataset.infId,
      title: dataset.title,
      serviceName: spec.serviceName,
      collectionMode: dataset.collectionMode
    },
    runtime: {
      collectedAt: new Date().toISOString(),
      pageSize,
      maxPages,
      outputDir: path.resolve(outputDir)
    },
    requestParameters: spec.requestParameters,
    resolvedParameters: parameterValues,
    requests: requestSummaries,
    itemsCollected: totalItemsCollected
  };

  const outputDirectory = await writeCollectionArtifacts(
    dataset.id,
    runLabel,
    outputDir,
    manifest,
    collectedData,
    options.savePages ? savedPages : undefined
  );

  return {
    datasetId: dataset.id,
    datasetTitle: dataset.title,
    outputDirectory,
    requestsExecuted: requestSummaries.length,
    itemsCollected: totalItemsCollected,
    runLabel
  };
}
