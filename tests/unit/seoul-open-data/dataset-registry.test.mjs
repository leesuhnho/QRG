import assert from "node:assert/strict";

import {
  supportedDatasets,
  unsupportedDatasets
} from "../../../apps/api/src/integrations/seoul-open-data/dataset-registry.mjs";

const MOJIBAKE_MARKER_PATTERN = /[\u00c2\u00c3]/;

export function runDatasetRegistryTests() {
  const walkNetwork = supportedDatasets.find((dataset) => dataset.id === "walk-network");
  const citydataHotspots = supportedDatasets.find(
    (dataset) => dataset.id === "citydata-hotspots"
  );
  const publicToilets = supportedDatasets.find((dataset) => dataset.id === "public-toilets");

  assert.equal(
    walkNetwork?.title,
    "\uc11c\uc6b8\uc2dc \uc790\uce58\uad6c\ubcc4 \ub3c4\ubcf4 \ub124\ud2b8\uc6cc\ud06c \uacf5\uac04\uc815\ubcf4"
  );
  assert.equal(
    citydataHotspots?.title,
    "\uc11c\uc6b8\uc2dc \uc2e4\uc2dc\uac04 \ub3c4\uc2dc\ub370\uc774\ud130"
  );
  assert.equal(
    publicToilets?.optionHints?.GU_NAME,
    "Optional district filter, for example \uac15\ub3d9\uad6c."
  );

  for (const dataset of supportedDatasets) {
    assert.doesNotMatch(dataset.title, MOJIBAKE_MARKER_PATTERN);

    for (const hint of Object.values(dataset.optionHints ?? {})) {
      assert.doesNotMatch(hint, MOJIBAKE_MARKER_PATTERN);
    }
  }

  for (const dataset of unsupportedDatasets) {
    assert.doesNotMatch(dataset.title, MOJIBAKE_MARKER_PATTERN);
  }
}
