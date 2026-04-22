import { runBuildOpenApiUrlTests } from "./seoul-open-data-client/build-open-api-url.test.mjs";
import { runCollectDatasetTests } from "./seoul-open-data-client/collect-dataset.test.mjs";
import { runDiscoverOpenApiSpecTests } from "./seoul-open-data-client/discover-open-api-spec.test.mjs";
import { runEnvironmentTests } from "./seoul-open-data-client/environment.test.mjs";
import { runExtractCollectionItemsTests } from "./seoul-open-data-client/extract-collection-items.test.mjs";
import { runParseSeoulOpenApiJsonResponseTests } from "./seoul-open-data-client/parse-seoul-open-api-json-response.test.mjs";
import { runResolveParameterValuesTests } from "./seoul-open-data-client/resolve-parameter-values.test.mjs";

export async function runSeoulOpenDataClientTests() {
  runBuildOpenApiUrlTests();
  runResolveParameterValuesTests();
  runExtractCollectionItemsTests();
  runParseSeoulOpenApiJsonResponseTests();
  await runEnvironmentTests();
  await runDiscoverOpenApiSpecTests();
  await runCollectDatasetTests();
}
