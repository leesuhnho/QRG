import {
  datasetProfiles,
  supportedDatasets,
  unsupportedDatasets
} from "../../../apps/api/src/integrations/seoul-open-data/dataset-registry.mjs";

export function printHelp() {
  console.log(`Seoul Open Data collector

Commands
  list
  inspect --dataset <dataset-id>
  collect --dataset <id[,id2]> [--api-key <key>] [--date YYYY-MM-DD] [--month YYYY-MM]
  collect --profile <profile-id> [--api-key <key>] [--area-name <name>] [--save-pages]

Common options
  --dataset <id[,id2]>          Supported dataset ids.
  --profile <profile-id>        Dataset profile id.
  --api-key <key>               Seoul Open Data API key. Falls back to SEOUL_OPEN_DATA_API_KEY.
  --param NAME=VALUE            Extra OpenAPI parameter. Repeatable.
  --date YYYY-MM-DD             Common date helper for DATE or STDR_DE_ID style parameters.
  --month YYYY-MM               Common month helper for USE_MM or USE_YM style parameters.
  --area-name <name>            Realtime citydata hotspot name. Repeatable.
  --area-code <code>            Realtime citydata hotspot code. Repeatable.
  --district <name>             District helper for GU_NAME, SGG_NM, AUTONOMOUS_DISTRICT, etc.
  --page-size <number>          Page size up to 1000. Default: 1000.
  --max-pages <number>          Safety limit for paginated pulls. Default: 2000.
  --output-dir <path>           Default: data/raw/seoul-open-data
  --save-pages                  Persist raw page payloads alongside aggregated data.
`);
}

export function printDatasetList() {
  console.log("Supported datasets");
  for (const dataset of supportedDatasets) {
    console.log(
      `- ${dataset.id} (${dataset.infId}) [${dataset.collectionMode}] ${dataset.title}`
    );
  }

  console.log("");
  console.log("Profiles");
  for (const [profileId, datasetIds] of Object.entries(datasetProfiles)) {
    console.log(`- ${profileId}: ${datasetIds.join(", ")}`);
  }

  console.log("");
  console.log("Officially unsupported for API-key OpenAPI collection");
  for (const dataset of unsupportedDatasets) {
    console.log(`- ${dataset.id}: ${dataset.title}`);
    console.log(`  Reason: ${dataset.reason}`);
    console.log(`  Reference: ${dataset.officialReference}`);
  }
}

/**
 * @param {{
 *   id: string;
 *   infId: string;
 *   title: string;
 *   collectionMode: "pagedRows"|"singlePayload";
 * }} dataset
 * @param {Awaited<ReturnType<typeof import("../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs").discoverOpenApiSpec>>} spec
 */
export function printInspectionResult(dataset, spec) {
  console.log(`${dataset.id} (${dataset.infId})`);
  console.log(`${dataset.title}`);
  console.log(`Service name: ${spec.serviceName}`);
  console.log(`Collection mode: ${dataset.collectionMode}`);
  console.log("");
  console.log("Sample URLs");
  for (const sampleUrl of spec.sampleUrls) {
    console.log(`- ${sampleUrl}`);
  }

  console.log("");
  console.log("Request parameters");
  for (const parameter of spec.requestParameters) {
    console.log(
      `- ${parameter.name}: ${parameter.type} | ${parameter.description} | ${parameter.valueDescription}`
    );
  }
}

/**
 * @param {Array<{
 *   datasetId: string;
 *   itemsCollected: number;
 *   requestsExecuted: number;
 * }>} results
 */
export function printCollectionSummary(results) {
  console.log("");
  console.log("Collection summary");
  for (const result of results) {
    console.log(
      `- ${result.datasetId}: ${result.itemsCollected} items, ${result.requestsExecuted} request set(s)`
    );
  }
}
