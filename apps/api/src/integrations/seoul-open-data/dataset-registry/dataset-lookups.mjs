import { supportedDatasets } from "./supported-datasets.mjs";
import { unsupportedDatasets } from "./unsupported-datasets.mjs";

/**
 * @param {string} id
 * @returns {import("../dataset-registry.mjs").SupportedDataset | undefined}
 */
export function getSupportedDataset(id) {
  return supportedDatasets.find((dataset) => dataset.id === id);
}

/**
 * @param {string} id
 * @returns {import("../dataset-registry.mjs").UnsupportedDataset | undefined}
 */
export function getUnsupportedDataset(id) {
  return unsupportedDatasets.find((dataset) => dataset.id === id);
}

/**
 * @param {string[]} ids
 * @returns {import("../dataset-registry.mjs").SupportedDataset[]}
 */
export function resolveSupportedDatasets(ids) {
  const resolved = [];
  const seen = new Set();

  for (const id of ids) {
    const dataset = getSupportedDataset(id);
    if (!dataset) {
      throw new Error(`Unknown supported dataset id: ${id}`);
    }

    if (!seen.has(dataset.id)) {
      seen.add(dataset.id);
      resolved.push(dataset);
    }
  }

  return resolved;
}
