import { datasetProfiles } from "../../../apps/api/src/integrations/seoul-open-data/dataset-registry.mjs";

/**
 * @param {string[]} argv
 * @returns {{
 *   command: string;
 *   flags: Record<string, string | string[] | boolean>;
 * }}
 */
export function parseCommandLine(argv) {
  const [, , rawCommand, ...rest] = argv;
  const command = rawCommand ?? "help";
  /** @type {Record<string, string | string[] | boolean>} */
  const flags = {};

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) {
      continue;
    }

    const name = token.slice(2);
    const next = rest[index + 1];
    const hasExplicitValue = next !== undefined && !next.startsWith("--");
    const value = hasExplicitValue ? next : true;

    if (hasExplicitValue) {
      index += 1;
    }

    const existing = flags[name];
    if (existing === undefined) {
      flags[name] = value;
      continue;
    }

    if (Array.isArray(existing)) {
      existing.push(String(value));
      continue;
    }

    flags[name] = [String(existing), String(value)];
  }

  return { command, flags };
}

/**
 * @param {string | string[] | boolean | undefined} value
 * @returns {string[]}
 */
export function toList(value) {
  if (value === undefined || value === false) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => String(entry).split(","))
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  if (value === true) {
    return [];
  }

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * @param {string | string[] | boolean | undefined} value
 * @returns {Record<string, string | string[]>}
 */
function parseParams(value) {
  /** @type {Record<string, string | string[]>} */
  const params = {};

  for (const entry of toList(value)) {
    const separatorIndex = entry.indexOf("=");
    if (separatorIndex < 0) {
      throw new Error(`Invalid --param value: ${entry}. Use NAME=VALUE format.`);
    }

    const key = entry.slice(0, separatorIndex).trim().toUpperCase();
    const rawValue = entry.slice(separatorIndex + 1).trim();
    if (!key || !rawValue) {
      throw new Error(`Invalid --param value: ${entry}. Use NAME=VALUE format.`);
    }

    if (params[key] === undefined) {
      params[key] = rawValue;
      continue;
    }

    const existing = params[key];
    if (Array.isArray(existing)) {
      existing.push(rawValue);
      continue;
    }

    params[key] = [existing, rawValue];
  }

  return params;
}

/**
 * @param {Record<string, string | string[] | boolean>} flags
 * @returns {import("../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs").CliStyleOptions}
 */
export function buildCollectorOptions(flags) {
  return {
    date:
      typeof flags.date === "string" && flags.date.trim().length > 0
        ? flags.date
        : undefined,
    month:
      typeof flags.month === "string" && flags.month.trim().length > 0
        ? flags.month
        : undefined,
    areaNames: toList(flags["area-name"]),
    areaCodes: toList(flags["area-code"]),
    districts: toList(flags.district),
    params: parseParams(flags.param),
    pageSize:
      typeof flags["page-size"] === "string" ? Number(flags["page-size"]) : undefined,
    maxPages:
      typeof flags["max-pages"] === "string" ? Number(flags["max-pages"]) : undefined,
    outputDir:
      typeof flags["output-dir"] === "string" ? flags["output-dir"] : undefined,
    savePages: flags["save-pages"] === true
  };
}

/**
 * @param {Record<string, string | string[] | boolean>} flags
 * @returns {string[]}
 */
export function resolveRequestedDatasetIds(flags) {
  const requested = new Set(toList(flags.dataset));
  for (const profileId of toList(flags.profile)) {
    const datasetIds = datasetProfiles[profileId];
    if (!datasetIds) {
      throw new Error(`Unknown dataset profile: ${profileId}`);
    }

    for (const datasetId of datasetIds) {
      requested.add(datasetId);
    }
  }

  return [...requested];
}
