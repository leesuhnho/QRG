/** @type {Array<import("../dataset-registry.mjs").SupportedDataset>} */
export const supportedDatasets = [
  {
    "id": "walk-network",
    "infId": "OA-21208",
    "title": "\uc11c\uc6b8\uc2dc \uc790\uce58\uad6c\ubcc4 \ub3c4\ubcf4 \ub124\ud2b8\uc6cc\ud06c \uacf5\uac04\uc815\ubcf4",
    "category": "mobility",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "network",
      "quiet-route"
    ],
    "summary": "Node-link walk network with crossings, overpasses, bus stops, and subway exits.",
    "optionHints": {
      "SGG_NM": "Optional district filter, for example \uc885\ub85c\uad6c."
    }
  },
  {
    "id": "living-population-cell",
    "infId": "OA-14979",
    "title": "\uc9d1\uacc4\uad6c \ub2e8\uc704 \uc11c\uc6b8 \uc0dd\ud65c\uc778\uad6c(\ub0b4\uad6d\uc778)",
    "category": "population",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "population",
      "quiet-route"
    ],
    "summary": "Census-block living population for fine-grained baseline crowd estimation.",
    "optionHints": {
      "TMZON_PD_SE": "Optional hour bucket.",
      "ADSTRD_CODE_SE": "Optional administrative-dong code filter.",
      "OA_CD": "Optional census block code filter."
    }
  },
  {
    "id": "living-population-dong",
    "infId": "OA-14991",
    "title": "\ud589\uc815\ub3d9 \ub2e8\uc704 \uc11c\uc6b8 \uc0dd\ud65c\uc778\uad6c(\ub0b4\uad6d\uc778)",
    "category": "population",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "population",
      "quiet-route"
    ],
    "summary": "Administrative-dong living population for easier operational joins and rollups.",
    "optionHints": {
      "STDR_DE_ID": "Optional date in YYYYMMDD format.",
      "TMZON_PD_SE": "Optional hour bucket.",
      "ADSTRD_CODE_SE": "Optional administrative-dong code filter."
    }
  },
  {
    "id": "sdot-foot-traffic",
    "infId": "OA-15964",
    "title": "\uc2a4\ub9c8\ud2b8\uc11c\uc6b8 \ub3c4\uc2dc\ub370\uc774\ud130 \uc13c\uc11c(S-DoT) \uc720\ub3d9\uc778\uad6c \uce21\uc815 \uc815\ubcf4",
    "category": "population",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "population",
      "sensor",
      "quiet-route"
    ],
    "summary": "Ten-minute foot-traffic measurements from S-DoT sensors.",
    "optionHints": {
      "AUTONOMOUS_DISTRICT": "Optional district filter, for example \ub9c8\ud3ec\uad6c.",
      "REG_DTTM": "Optional registration timestamp filter from the API spec."
    }
  },
  {
    "id": "citydata-hotspots",
    "infId": "OA-21285",
    "title": "\uc11c\uc6b8\uc2dc \uc2e4\uc2dc\uac04 \ub3c4\uc2dc\ub370\uc774\ud130",
    "category": "realtime",
    "collectionMode": "singlePayload",
    "tags": [
      "required",
      "realtime",
      "hotspot",
      "quiet-route"
    ],
    "summary": "Realtime hotspot payloads with crowd, traffic, weather, transit, incidents, and events.",
    "requiredOptions": [
      "area-name or area-code"
    ],
    "optionHints": {
      "AREA_NM": "Required unless AREA_CD is provided. Use one or more hotspot names.",
      "AREA_CD": "Required unless AREA_NM is provided. Use one or more hotspot codes."
    }
  },
  {
    "id": "subway-congestion",
    "infId": "OA-12928",
    "title": "\uc11c\uc6b8\uad50\ud1b5\uacf5\uc0ac_\uc9c0\ud558\ucca0\ud63c\uc7a1\ub3c4\uc815\ubcf4",
    "category": "transit",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "transit",
      "quiet-route"
    ],
    "summary": "Subway congestion indicators from Seoul Metro."
  },
  {
    "id": "subway-hourly-ridership",
    "infId": "OA-12252",
    "title": "\uc11c\uc6b8\uc2dc \uc9c0\ud558\ucca0 \ud638\uc120\ubcc4 \uc5ed\ubcc4 \uc2dc\uac04\ub300\ubcc4 \uc2b9\ud558\ucc28 \uc778\uc6d0 \uc815\ubcf4",
    "category": "transit",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "transit",
      "quiet-route"
    ],
    "summary": "Monthly hourly subway ridership by line and station.",
    "optionHints": {
      "USE_MM": "Required month in YYYYMM format. Defaults to the latest published month.",
      "SBWY_ROUT_LN_NM": "Optional subway line filter, for example 2\ud638\uc120.",
      "STTN": "Optional station name filter."
    }
  },
  {
    "id": "bus-stop-hourly-ridership",
    "infId": "OA-12913",
    "title": "\uc11c\uc6b8\uc2dc \ubc84\uc2a4\ub178\uc120\ubcc4 \uc815\ub958\uc7a5\ubcc4 \uc2dc\uac04\ub300\ubcc4 \uc2b9\ud558\ucc28 \uc778\uc6d0 \uc815\ubcf4",
    "category": "transit",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "transit",
      "quiet-route"
    ],
    "summary": "Monthly hourly bus ridership by route and stop.",
    "optionHints": {
      "USE_YM": "Required month in YYYYMM format. Defaults to the latest published month.",
      "RTE_NO": "Optional route number filter."
    }
  },
  {
    "id": "bus-stop-location",
    "infId": "OA-15067",
    "title": "\uc11c\uc6b8\uc2dc \ubc84\uc2a4\uc815\ub958\uc18c \uc704\uce58\uc815\ubcf4",
    "category": "transit",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "transit",
      "location",
      "quiet-route"
    ],
    "summary": "Bus stop master with coordinates and ARS stop codes.",
    "optionHints": {
      "STOPS_NM": "Optional stop name filter."
    }
  },
  {
    "id": "admin-dong-transit-boarding",
    "infId": "OA-21223",
    "title": "\uc11c\uc6b8\uc2dc \ud589\uc815\ub3d9\ubcc4 \ub300\uc911\uad50\ud1b5 \ucd1d \uc2b9\ucc28 \uc2b9\uac1d\uc218 \uc815\ubcf4",
    "category": "transit",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "transit",
      "quiet-route"
    ],
    "summary": "Hourly total transit boarding counts aggregated by administrative dong."
  },
  {
    "id": "cultural-events",
    "infId": "OA-15486",
    "title": "\uc11c\uc6b8\uc2dc \ubb38\ud654\ud589\uc0ac \uc815\ubcf4",
    "category": "events",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "events",
      "quiet-route"
    ],
    "summary": "Cultural event schedule, venue, lat/lon, and event metadata from Seoul Culture Portal.",
    "optionHints": {
      "CODENAME": "Optional event category filter.",
      "TITLE": "Optional event title filter.",
      "DATE": "Optional date in YYYY-MM-DD format."
    }
  },
  {
    "id": "road-excavation",
    "infId": "OA-22901",
    "title": "\uc11c\uc6b8\uc2dc \ub3c4\ub85c\uad74\ucc29 \uacf5\uc0ac \ud604\ud669",
    "category": "construction",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "construction",
      "quiet-route"
    ],
    "summary": "Road excavation approvals and in-progress construction records."
  },
  {
    "id": "parks",
    "infId": "OA-394",
    "title": "\uc11c\uc6b8\uc2dc \uc8fc\uc694 \uacf5\uc6d0\ud604\ud669",
    "category": "amenities",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "amenities",
      "quiet-route"
    ],
    "summary": "Major park locations and park metadata.",
    "optionHints": {
      "SN": "Optional park serial number filter."
    }
  },
  {
    "id": "green-zones",
    "infId": "OA-1321",
    "title": "\uc11c\uc6b8\uc2dc \ub179\uc9c0\ub300 \uc704\uce58\uc815\ubcf4 (\uc88c\ud45c\uacc4: WGS1984)",
    "category": "amenities",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "amenities",
      "quiet-route",
      "legacy"
    ],
    "summary": "Green-zone spatial dataset. Official page warns it is a one-time legacy dataset.",
    "optionHints": {
      "UNQ_NO": "Optional unique identifier filter."
    }
  },
  {
    "id": "public-toilets",
    "infId": "OA-22586",
    "title": "\uc11c\uc6b8\uc2dc \uacf5\uc911\ud654\uc7a5\uc2e4 \uc704\uce58\uc815\ubcf4",
    "category": "amenities",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "amenities",
      "quiet-route"
    ],
    "summary": "Public toilet locations and accessibility-related metadata.",
    "optionHints": {
      "GU_NAME": "Optional district filter, for example \uac15\ub3d9\uad6c."
    }
  },
  {
    "id": "public-wifi",
    "infId": "OA-20883",
    "title": "\uc11c\uc6b8\uc2dc \uacf5\uacf5\uc640\uc774\ud30c\uc774 \uc11c\ube44\uc2a4 \uc704\uce58 \uc815\ubcf4",
    "category": "amenities",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "amenities",
      "quiet-route"
    ],
    "summary": "Public Wi-Fi access point locations across Seoul and district-operated networks.",
    "optionHints": {
      "X_SWIFI_WRDOFC": "Optional district filter.",
      "X_SWIFI_ADRES1": "Optional road-address filter."
    }
  },
  {
    "id": "dong-master",
    "infId": "OA-21234",
    "title": "\uc11c\uc6b8\uc2dc \ud589\uc815\ub3d9 \ub9c8\uc2a4\ud130 \uc815\ubcf4",
    "category": "reference",
    "collectionMode": "pagedRows",
    "tags": [
      "required",
      "reference",
      "quiet-route"
    ],
    "summary": "Administrative dong master for code joins between transit and population datasets."
  }
];
