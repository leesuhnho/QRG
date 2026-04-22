const SEOUL_TIME_ZONE = "Asia/Seoul";

const seoulDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SEOUL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeValueList(value) {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => String(entry).split(","))
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * @param {string | undefined} value
 * @returns {string | undefined}
 */
export function normalizeDateInput(value) {
  if (!value) {
    return undefined;
  }

  return value.trim().replace(/-/g, "");
}

/**
 * @param {Date} date
 * @returns {string}
 */
function formatAsUtcYyyyMmDd(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * @param {Date} date
 * @returns {{ year: number, month: number, day: number }}
 */
function getSeoulDateParts(date) {
  const parts = {
    year: "0000",
    month: "01",
    day: "01"
  };

  for (const part of seoulDateFormatter.formatToParts(date)) {
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      parts[part.type] = part.value;
    }
  }

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day)
  };
}

/**
 * @param {Date} [now]
 * @returns {string}
 */
export function getDefaultCompletedMonth(now = new Date()) {
  const { year, month, day } = getSeoulDateParts(now);
  const monthsBack = day < 5 ? 2 : 1;
  let targetYear = year;
  let targetMonth = month - monthsBack;

  while (targetMonth <= 0) {
    targetYear -= 1;
    targetMonth += 12;
  }

  return `${targetYear}${String(targetMonth).padStart(2, "0")}`;
}

/**
 * @param {Date} [now]
 * @returns {string}
 */
export function getDefaultRecentDate(now = new Date()) {
  const { year, month, day } = getSeoulDateParts(now);
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() - 5);
  return formatAsUtcYyyyMmDd(base);
}
