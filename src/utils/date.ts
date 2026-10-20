/**
 * Returns today's date in India as 'YYYY-MM-DD'.
 * We use the Asia/Kolkata time zone on purpose, so the result does not
 * depend on the visitor's own computer time zone (and is never a day off).
 * The 'en-CA' locale is used only because it formats dates as YYYY-MM-DD.
 */
export function getTodayIST(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}