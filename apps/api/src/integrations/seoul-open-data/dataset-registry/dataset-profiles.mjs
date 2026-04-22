import { supportedDatasets } from "./supported-datasets.mjs";

export const datasetProfiles = {
  "quiet-route-api-core": supportedDatasets.map((dataset) => dataset.id),
  "quiet-route-amenities": [
    "parks",
    "green-zones",
    "public-toilets",
    "public-wifi"
  ],
  "quiet-route-transit": [
    "subway-congestion",
    "subway-hourly-ridership",
    "bus-stop-hourly-ridership",
    "bus-stop-location",
    "admin-dong-transit-boarding",
    "dong-master"
  ]
};
