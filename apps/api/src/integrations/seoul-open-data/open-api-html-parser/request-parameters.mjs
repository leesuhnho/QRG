import { SYSTEM_PARAMETER_NAMES } from "./constants.mjs";

const REQUIRED_TYPE_MARKERS = ["\uD544\uC218", "required", "?„ìˆ˜", "??녑옱"];
const OPTIONAL_TYPE_MARKERS = ["\uC120\uD0DD", "optional", "? íƒ"];

/**
 * @param {string} type
 * @returns {boolean}
 */
function isRequiredParameterType(type) {
  const normalized = type.trim().toLowerCase();
  if (OPTIONAL_TYPE_MARKERS.some((marker) => normalized.includes(marker.toLowerCase()))) {
    return false;
  }

  return REQUIRED_TYPE_MARKERS.some((marker) => normalized.includes(marker.toLowerCase()));
}

/**
 * @param {string[][]} requestRows
 * @returns {{
 *   serviceName: string;
 *   requestParameters: Array<{
 *     name: string;
 *     type: string;
 *     description: string;
 *     valueDescription: string;
 *     required: boolean;
 *     system: boolean;
 *   }>;
 *   extraParameters: Array<{
 *     name: string;
 *     type: string;
 *     description: string;
 *     valueDescription: string;
 *     required: boolean;
 *     system: boolean;
 *   }>;
 * }}
 */
export function mapRequestParameters(requestRows) {
  const requestParameters = requestRows
    .filter((row) => row.length >= 4)
    .map((row) => {
      const [name, type, description, valueDescription] = row;
      return {
        name,
        type,
        description,
        valueDescription,
        required: isRequiredParameterType(type),
        system: SYSTEM_PARAMETER_NAMES.has(name)
      };
    })
    .filter((parameter) => /^[A-Z0-9_]+$/.test(parameter.name));

  const serviceRow = requestParameters.find((parameter) => parameter.name === "SERVICE");
  if (!serviceRow) {
    throw new Error("Could not find SERVICE row in OpenAPI request parameter table.");
  }

  return {
    serviceName: serviceRow.valueDescription,
    requestParameters,
    extraParameters: requestParameters.filter((parameter) => !parameter.system)
  };
}
