/**
 * @param {string} name
 * @param {() => Promise<void> | void} testFn
 * @returns {Promise<void>}
 */
async function runTestSuite(name, testFn) {
  try {
    await testFn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

export async function runSeoulOpenDataTestSuites() {
  const [{ runDatasetRegistryTests }, { runOpenApiHtmlParserTests }, { runSeoulOpenDataClientTests }] =
    await Promise.all([
      import("../../../tests/unit/seoul-open-data/dataset-registry.test.mjs"),
      import("../../../tests/unit/seoul-open-data/open-api-html-parser.test.mjs"),
      import("../../../tests/unit/seoul-open-data/seoul-open-data-client.test.mjs")
    ]);

  await runTestSuite("dataset-registry", runDatasetRegistryTests);
  await runTestSuite("open-api-html-parser", runOpenApiHtmlParserTests);
  await runTestSuite("seoul-open-data-client", runSeoulOpenDataClientTests);
}
