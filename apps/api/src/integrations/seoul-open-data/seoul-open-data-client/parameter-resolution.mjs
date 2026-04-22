import {
  getDefaultCompletedMonth,
  getDefaultRecentDate,
  normalizeDateInput,
  normalizeValueList
} from "./time-values.mjs";

/**
 * @param {Record<string, string|string[]> | undefined} params
 * @param {string} name
 * @returns {string[]}
 */
function getExplicitParameterValues(params, name) {
  if (!params) {
    return [];
  }

  const direct = normalizeValueList(params[name]);
  if (direct.length > 0) {
    return direct;
  }

  const upperCased = Object.entries(params).find(([key]) => key.toUpperCase() === name);
  return upperCased ? normalizeValueList(upperCased[1]) : [];
}

/**
 * @param {string} parameterName
 * @param {import("../seoul-open-data-client.mjs").CliStyleOptions} options
 * @returns {string[]}
 */
function inferParameterValues(parameterName, options) {
  switch (parameterName) {
    case "USE_MM":
    case "USE_YM": {
      const month = normalizeDateInput(options.month) ?? getDefaultCompletedMonth(options.now);
      return [month];
    }
    case "DATE":
      return options.date ? [options.date] : [];
    case "STDR_DE_ID": {
      const date = normalizeDateInput(options.date) ?? getDefaultRecentDate(options.now);
      return [date];
    }
    case "AREA_NM": {
      const names = normalizeValueList(options.areaNames);
      if (names.length > 0) {
        return names;
      }

      return normalizeValueList(options.areaCodes);
    }
    case "GU_NAME":
    case "AUTONOMOUS_DISTRICT":
    case "SGG_NM":
    case "X_SWIFI_WRDOFC":
      return normalizeValueList(options.districts);
    default:
      return [];
  }
}

/**
 * @param {Record<string, string|string[]>} parameterValues
 * @returns {Array<Record<string, string>>}
 */
export function expandParameterSets(parameterValues) {
  /** @type {Array<Record<string, string>>} */
  let expanded = [{}];

  for (const [name, rawValue] of Object.entries(parameterValues)) {
    const values = normalizeValueList(rawValue);
    if (values.length === 0) {
      continue;
    }

    expanded = expanded.flatMap((existing) =>
      values.map((value) => ({
        ...existing,
        [name]: value
      }))
    );
  }

  return expanded;
}

/**
 * @param {{ extraParameters: Array<{name: string, required: boolean, description: string}> }} spec
 * @param {import("../seoul-open-data-client.mjs").CliStyleOptions} options
 * @returns {{ parameterValues: Record<string, string|string[]>, missingRequired: string[] }}
 */
export function resolveParameterValues(spec, options) {
  /** @type {Record<string, string|string[]>} */
  const parameterValues = {};
  const missingRequired = [];

  for (const parameter of spec.extraParameters) {
    const explicit = getExplicitParameterValues(options.params, parameter.name);
    const inferred = inferParameterValues(parameter.name, options);
    const finalValues = explicit.length > 0 ? explicit : inferred;

    if (finalValues.length > 0) {
      parameterValues[parameter.name] = finalValues.length === 1 ? finalValues[0] : finalValues;
      continue;
    }

    if (parameter.required) {
      missingRequired.push(parameter.name);
    }
  }

  return {
    parameterValues,
    missingRequired
  };
}
