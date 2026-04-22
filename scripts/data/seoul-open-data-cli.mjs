#!/usr/bin/env node

import { runSeoulOpenDataCli } from "./seoul-open-data-cli/run-seoul-open-data-cli.mjs";

runSeoulOpenDataCli().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
