/**
 * @typedef {Object} SupportedDataset
 * @property {string} id
 * @property {string} infId
 * @property {string} title
 * @property {string} category
 * @property {"pagedRows"|"singlePayload"} collectionMode
 * @property {string[]} tags
 * @property {string} summary
 * @property {string[]} [requiredOptions]
 * @property {Record<string, string>} [optionHints]
 */

/**
 * @typedef {Object} UnsupportedDataset
 * @property {string} id
 * @property {string} title
 * @property {string} reason
 * @property {string} officialReference
 */

export { supportedDatasets } from "./dataset-registry/supported-datasets.mjs";
export { unsupportedDatasets } from "./dataset-registry/unsupported-datasets.mjs";
export { datasetProfiles } from "./dataset-registry/dataset-profiles.mjs";
export {
  getSupportedDataset,
  getUnsupportedDataset,
  resolveSupportedDatasets
} from "./dataset-registry/dataset-lookups.mjs";
