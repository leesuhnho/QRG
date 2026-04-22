import {
  getSupportedDataset,
  resolveSupportedDatasets
} from "../../../apps/api/src/integrations/seoul-open-data/dataset-registry.mjs";
import {
  collectDataset,
  discoverOpenApiSpec,
  loadEnvironmentFile
} from "../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

import {
  buildCollectorOptions,
  parseCommandLine,
  resolveRequestedDatasetIds
} from "./argument-parsing.mjs";
import {
  printCollectionSummary,
  printDatasetList,
  printHelp,
  printInspectionResult
} from "./output.mjs";

/**
 * @param {string[]} [argv]
 * @returns {Promise<void>}
 */
export async function runSeoulOpenDataCli(argv = process.argv) {
  await loadEnvironmentFile();
  const { command, flags } = parseCommandLine(argv);

  if (command === "help" || flags.help === true) {
    printHelp();
    return;
  }

  if (command === "list") {
    printDatasetList();
    return;
  }

  if (command === "inspect") {
    const datasetIds = resolveRequestedDatasetIds(flags);
    if (datasetIds.length !== 1) {
      throw new Error("inspect requires exactly one dataset id via --dataset.");
    }

    const dataset = getSupportedDataset(datasetIds[0]);
    if (!dataset) {
      throw new Error(`Unknown supported dataset id: ${datasetIds[0]}`);
    }

    const spec = await discoverOpenApiSpec(dataset.infId);
    printInspectionResult(dataset, spec);
    return;
  }

  if (command === "collect") {
    const datasetIds = resolveRequestedDatasetIds(flags);
    if (datasetIds.length === 0) {
      throw new Error("collect requires --dataset or --profile.");
    }

    const datasets = resolveSupportedDatasets(datasetIds);
    const apiKey =
      (typeof flags["api-key"] === "string" ? flags["api-key"] : undefined) ??
      process.env.SEOUL_OPEN_DATA_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Missing API key. Provide --api-key or set SEOUL_OPEN_DATA_API_KEY in .env."
      );
    }

    const collectorOptions = buildCollectorOptions(flags);
    const runLabel = new Date().toISOString().replace(/[:.]/g, "-");
    const results = [];

    for (const dataset of datasets) {
      console.log(`Collecting ${dataset.id} (${dataset.infId})...`);
      const result = await collectDataset(dataset, apiKey, {
        ...collectorOptions,
        runLabel
      });
      results.push(result);
      console.log(`  -> ${result.itemsCollected} items saved to ${result.outputDirectory}`);
    }

    printCollectionSummary(results);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}
