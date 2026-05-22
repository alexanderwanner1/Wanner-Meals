// ============================================================
// WANNER MEALS — LOCALSTORAGE UTILITY
// All localStorage access goes through here so the app
// never crashes if localStorage is unavailable (e.g. private mode).
// ============================================================

/**
 * Load a value from localStorage.
 * Returns `defaultValue` if the key doesn't exist or if parsing fails.
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    // localStorage unavailable or JSON parse failed — return default
    return defaultValue;
  }
}

/**
 * Save a value to localStorage.
 * Silently fails if localStorage is unavailable.
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable or quota exceeded — fail silently
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // fail silently
  }
}

// ============================================================
// KEY CONSTANTS
// ============================================================

// Grocery checklist keys
export const GROCERY_KEY = (weekId: number, trip: string) =>
  `wanner-meals-week${weekId}-${trip}`;

// Imported weeks list
export const IMPORTED_WEEKS_KEY = 'wanner-meals-imported-weeks';
