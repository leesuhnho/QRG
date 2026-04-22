import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * @param {string} datasetId
 * @param {string} outputDir
 * @param {string} runLabel
 * @returns {string}
 */
function getDatasetRunDirectory(datasetId, outputDir, runLabel) {
  return path.resolve(outputDir, datasetId, runLabel);
}

/**
 * @param {string} datasetId
 * @param {string} runLabel
 * @param {string} outputDir
 * @param {Record<string, unknown>} manifest
 * @param {unknown} data
 * @param {Array<{ name: string, payload: unknown }>} [pagePayloads]
 * @returns {Promise<string>}
 */
export async function writeCollectionArtifacts(
  datasetId,
  runLabel,
  outputDir,
  manifest,
  data,
  pagePayloads
) {
  const datasetDir = getDatasetRunDirectory(datasetId, outputDir, runLabel);
  await mkdir(datasetDir, { recursive: true });

  await writeFile(
    path.join(datasetDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  await writeFile(
    path.join(datasetDir, "data.json"),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8"
  );

  if (pagePayloads && pagePayloads.length > 0) {
    const pageDir = path.join(datasetDir, "pages");
    await mkdir(pageDir, { recursive: true });

    for (const pagePayload of pagePayloads) {
      await writeFile(
        path.join(pageDir, `${pagePayload.name}.json`),
        `${JSON.stringify(pagePayload.payload, null, 2)}\n`,
        "utf8"
      );
    }
  }

  return datasetDir;
}
