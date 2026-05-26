// ============================================================
// WEEK ANCHOR — persists which Monday Week 1 is pinned to.
// localStorage is wrapped in try/catch so the app never crashes
// if it's unavailable (private browsing, etc.).
// ============================================================

const STORAGE_KEY = 'wanner-meals:week-anchor:week1';

/** Returns the Monday of the week that contains `date` (local time). */
export function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Reads the saved Monday-anchor from localStorage. Returns null if missing/invalid. */
export function loadWeekAnchor(): Date | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  } catch {
    return null;
  }
}

/** Saves a date as the anchor, normalised to that week's Monday. */
export function saveWeekAnchor(date: Date): Date {
  const monday = getMondayOfWeek(date);
  try {
    localStorage.setItem(STORAGE_KEY, monday.toISOString());
  } catch {
    /* localStorage unavailable — fail silently */
  }
  return monday;
}

/** True if the anchor is older than this week's Monday. */
export function isAnchorStale(anchor: Date, now: Date = new Date()): boolean {
  return anchor.getTime() < getMondayOfWeek(now).getTime();
}

/** Formats the anchored week as a range. e.g. "May 18 – 24", "May 28 – Jun 3". */
export function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) => d.toLocaleString('default', { month: 'short' });
  const startMonth = fmt(monday);
  const endMonth = fmt(sunday);

  if (startMonth === endMonth) {
    return `${startMonth} ${monday.getDate()} – ${sunday.getDate()}`;
  }
  return `${startMonth} ${monday.getDate()} – ${endMonth} ${sunday.getDate()}`;
}
