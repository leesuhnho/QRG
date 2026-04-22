/** @type {Array<import("../dataset-registry.mjs").UnsupportedDataset>} */
export const unsupportedDatasets = [
  {
    "id": "statistical-district-boundaries",
    "title": "\uc0dd\ud65c\uc778\uad6c \uad00\ub828 \ud1b5\uacc4\uc9c0\uc5ed\uacbd\uacc4",
    "reason": "The recommended boundary files are published as download assets rather than Seoul OpenAPI key-gateway endpoints.",
    "officialReference": "https://data.seoul.go.kr/dataVisual/seoul/seoulLivingPopulation.do"
  },
  {
    "id": "pedestrian-lights",
    "title": "\uc11c\uc6b8\uc2dc \ubcf4\ud589\ub4f1 \uc704\uce58\uc88c\ud45c \ud604\ud669",
    "reason": "Published as a file dataset without an OpenAPI endpoint.",
    "officialReference": "https://data.seoul.go.kr/dataList/OA-22355/F/1/datasetView.do"
  },
  {
    "id": "signals-and-crosswalks",
    "title": "\uc11c\uc6b8\uc2dc \uc790\uce58\uad6c\ubcc4 \uc2e0\ud638\ub4f1 \ubc0f \ud6a1\ub2e8\ubcf4\ub3c4 \uc704\uce58 \ubc0f \ud604\ud669",
    "reason": "Published as a file dataset without an OpenAPI endpoint.",
    "officialReference": "https://data.seoul.go.kr/dataList/OA-22364/F/1/datasetView.do"
  }
];
