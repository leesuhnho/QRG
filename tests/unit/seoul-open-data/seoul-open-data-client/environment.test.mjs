import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadEnvironmentFile } from "../../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

export async function runEnvironmentTests() {
  const tempDir = path.resolve(
    "data/tmp",
    `seoul-open-data-env-tests-${process.pid}-${Date.now()}`
  );
  const envPath = path.join(tempDir, ".env");
  const envKey = "QRG_TEST_QUOTED_ENV_VALUE";
  const originalValue = process.env[envKey];

  await mkdir(tempDir, { recursive: true });
  await writeFile(envPath, `${envKey}="quoted-value"\n`, "utf8");

  delete process.env[envKey];

  try {
    await loadEnvironmentFile(envPath);
    assert.equal(process.env[envKey], "quoted-value");
  } finally {
    if (originalValue === undefined) {
      delete process.env[envKey];
    } else {
      process.env[envKey] = originalValue;
    }

    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      if (error && typeof error === "object" && error.code !== "EPERM") {
        throw error;
      }
    }
  }
}
