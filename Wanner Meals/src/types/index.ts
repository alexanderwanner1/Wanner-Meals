// ============================================================
// WANNER MEALS — TYPE DEFINITIONS
// ============================================================

// Protein types for badge colours
export type ProteinType =
  | 'pizza'
  | 'beef'
  | 'vegetarian'
  | 'freezer'
  | 'chicken'
  | 'turkey';

// A single meal in the weekly plan (used in Meal Plan cards + Calendar)
export interface Meal {
  day: string;        // e.g. "Monday"
  dayShort: string;   // e.g. "Mon"
  meal: string;       // e.g. "Frozen Pizza Night"
  protein: string;    // Display text for badge
  proteinType: ProteinType;
  style: string;      // e.g. "Quick", "Pasta"
  cookTime: string;   // e.g. "15–25 min"
  activeTime: string; // Active hands-on time
  totalTime?: string; // Total including passive time if different
  notes: string;      // Short card-level notes
  dairyFreeNote: string;
  toddlerNote: string;
  leftoverNote?: string;
}

// A calendar reminder shown as an icon on a specific day
export interface CalendarReminder {
  day: string;  // Day of week: "Monday", "Thursday", etc.
  icon: string; // Emoji icon e.g. "❄️"
  title: string; // Accessible tooltip text
}

// A full recipe for the Cooking section
export interface DayRecipe {
  day: string;       // "Monday"
  dayShort: string;  // "Mon"
  mealName: string;
  ingredients: string[];
  steps: string[]; // Empty array = reminder-only (Thursday)
}

// A single grocery item
export interface GroceryItem {
  id: string;   // Stable ID used for localStorage
  name: string; // Display text
}

// A grocery category (Produce, Protein, etc.)
export interface GroceryCategory {
  name: string;
  items: GroceryItem[];
  isPantry?: boolean; // "Check Your Pantry" gets a special style
}

// A full shopping trip (Monday or Thursday)
export interface GroceryTrip {
  label: string;       // "Monday Shop"
  description: string; // Short subtitle
  key: string;         // localStorage key suffix e.g. "monday-shop"
  categories: GroceryCategory[];
}

// Week metadata for the week selector
export interface Week {
  id: number;
  name: string;    // "Week 1"
  available: boolean; // false = coming soon
}

// ============================================================
// IMPORT / PARSER TYPES
// ============================================================

export interface DetectedRecipe {
  day: string;
  mealName: string;
  ingredients: string[];
  steps: string[];
}

export interface ParsedMealPlan {
  rawText: string;
  detectedDays: string[];
  detectedRecipes: DetectedRecipe[];
  detectedGroceryLists: {
    monday: string[];
    thursday: string[];
  };
  warnings: string[];
}

// A saved imported week (stored in localStorage)
export interface ImportedWeek {
  id: string;        // Timestamp-based unique ID
  name: string;      // e.g. "Imported Plan — May 22"
  rawText: string;
  parsed: ParsedMealPlan;
  savedAt: string;   // ISO date string
}

// ============================================================
// APP NAVIGATION
// ============================================================

export type Section = 'home' | 'meal-plan' | 'grocery' | 'cooking' | 'import';

export interface NavItem {
  id: Section;
  label: string;
  icon: string;
}
