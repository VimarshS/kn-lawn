const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * True only for real calendar days written as YYYY-MM-DD.
 * Rejects text that looks right but isn't a real day, such as 2026-02-31.
 */
export function isValidDateString(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  // Build the date, then check that nothing was "corrected" along the way.
  // For example, 2026-02-31 silently becomes March 3, and the checks below catch that.
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Number of calendar days from start to end, counting both ends (same day = 1). */
export function countDaysInclusive(start: string, end: string): number {
  const [startYear, startMonth, startDay] = start.split('-').map(Number);
  const [endYear, endMonth, endDay] = end.split('-').map(Number);
  const millis =
    Date.UTC(endYear, endMonth - 1, endDay) - Date.UTC(startYear, startMonth - 1, startDay);
  return Math.round(millis / 86_400_000) + 1; // 86,400,000 ms = one day
}