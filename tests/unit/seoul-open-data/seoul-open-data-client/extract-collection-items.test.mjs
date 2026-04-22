import assert from "node:assert/strict";

import { extractCollectionItems } from "../../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

export function runExtractCollectionItemsTests() {
  {
    const rowPayload = {
      TbTraficWlkNet: {
        list_total_count: 2,
        RESULT: {
          CODE: "INFO-000",
          MESSAGE: "Success"
        },
        row: [{ id: 1 }, { id: 2 }]
      }
    };

    const citydataPayload = {
      list_total_count: 1,
      RESULT: {
        "RESULT.CODE": "INFO-000",
        "RESULT.MESSAGE": "Success"
      },
      CITYDATA: {
        AREA_NM: "Gwanghwamun"
      }
    };

    assert.deepEqual(extractCollectionItems(rowPayload, "TbTraficWlkNet", "pagedRows"), {
      items: [{ id: 1 }, { id: 2 }],
      totalCount: 2,
      result: {
        code: "INFO-000",
        message: "Success"
      },
      envelopeKey: "TbTraficWlkNet"
    });

    assert.deepEqual(extractCollectionItems(citydataPayload, "citydata", "singlePayload"), {
      items: [{ AREA_NM: "Gwanghwamun" }],
      totalCount: 1,
      result: {
        code: "INFO-000",
        message: "Success"
      },
      envelopeKey: "CITYDATA"
    });
  }

  {
    assert.deepEqual(
      extractCollectionItems(
        {
          RESULT: {
            CODE: "INFO-200",
            MESSAGE: "No data"
          }
        },
        "CardBusTimeNew",
        "pagedRows"
      ),
      {
        items: [],
        totalCount: 0,
        result: {
          code: "INFO-200",
          message: "No data"
        },
        envelopeKey: null
      }
    );
  }
}
