import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * @param {string} rawValue
 * @returns {string}
 */
function normalizeEnvValue(rawValue) {
  const trimmed = rawValue.trim();
  if (trimmed.length >= 2) {
    const quote = trimmed[0];
    if ((quote === '"' || quote === "'") && trimmed.at(-1) === quote) {
      return trimmed.slice(1, -1);
    }
  }

  return trimmed;
}

/**
 * @param {string} [envPath]
 * @returns {Promise<void>}
 */
export async function loadEnvironmentFile(envPath = path.resolve(".env")) {
  try {
    const raw = await readFile(envPath, "utf8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex < 0) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = normalizeEnvValue(trimmed.slice(separatorIndex + 1));

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code !== "ENOENT") {
      throw error;
    }
  }
}
