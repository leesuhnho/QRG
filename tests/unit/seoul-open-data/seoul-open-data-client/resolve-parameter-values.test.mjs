import assert from "node:assert/strict";

import { resolveParameterValues } from "../../../../apps/api/src/integrations/seoul-open-data/seoul-open-data-client.mjs";

export function runResolveParameterValuesTests() {
  {
    const spec = {
      extraParameters: [
        { name: "USE_YM", required: true, description: "month" },
        { name: "DATE", required: false, description: "date" },
        { name: "GU_NAME", required: false, description: "district" }
      ]
    };

    const resolved = resolveParameterValues(spec, {
      month: "2026-03",
      date: "2026-04-17",
      districts: ["Jongno-gu"]
    });

    assert.deepEqual(resolved, {
      parameterValues: {
        USE_YM: "202603",
        DATE: "2026-04-17",
        GU_NAME: "Jongno-gu"
      },
      missingRequired: []
    });
  }

  {
    const monthlySpec = {
      extraParameters: [{ name: "USE_YM", required: true, description: "month" }]
    };

    assert.deepEqual(
      resolveParameterValues(monthlySpec, {
        now: new Date("2026-04-04T23:30:00+09:00")
      }),
      {
        parameterValues: {
          USE_YM: "202602"
        },
        missingRequired: []
      }
    );

    assert.deepEqual(
      resolveParameterValues(monthlySpec, {
        now: new Date("2026-04-05T00:30:00+09:00")
      }),
      {
        parameterValues: {
          USE_YM: "202603"
        },
        missingRequired: []
      }
    );
  }

  {
    const originalTz = process.env.TZ;

    try {
      process.env.TZ = "UTC";

      assert.deepEqual(
        resolveParameterValues(
          {
            extraParameters: [{ name: "STDR_DE_ID", required: true, description: "date" }]
          },
          {
            now: new Date("2026-04-21T15:30:00Z")
          }
        ),
        {
          parameterValues: {
            STDR_DE_ID: "20260417"
          },
          missingRequired: []
        }
      );
    } finally {
      if (originalTz === undefined) {
        delete process.env.TZ;
      } else {
        process.env.TZ = originalTz;
      }
    }
  }
}
