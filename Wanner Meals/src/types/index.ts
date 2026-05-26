// ============================================================
// WANNER MEALS — TYPE DEFINITIONS
// ============================================================

export type ProteinType =
  | 'pizza'
  | 'beef'
  | 'vegetarian'
  | 'freezer'
  | 'chicken'
  | 'turkey';

export interface Meal {
  day: string;
  dayShort: string;
  meal: string;
  protein: string;
  proteinType: ProteinType;
  style: string;
  cookTime: string;
  activeTime: string;
  totalTime?: string;
  notes: string;
  dairyFreeNote: string;
  toddlerNote: string;
  leftoverNote?: string;
}

export interface CalendarReminder {
  day: string;
  icon: string;
  title: string;
}

export interface DayRecipe {
  day: string;
  dayShort: string;
  mealName: string;
  ingredients: string[];
  steps: string[];
}

export interface GroceryItem {
  id: string;
  name: string;
}

export interface GroceryCategory {
  name: string;
  items: GroceryItem[];
  isPantry?: boolean;
}

export interface GroceryTrip {
  label: string;
  description: string;
  key: string;
  categories: GroceryCategory[];
}

export interface Week {
  id: number;
  name: string;
  available: boolean;
}

// ============================================================
// IMPORT / PARSER TYPES
// ============================================================

export interface DetectedRecipe {
  day: string;
  mealName: string;
  // v1.2: optional fields parsed from "Field: value" lines
  protein?: string;
  style?: string;
  cookTime?: string;
  notes?: string;
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

export interface ImportedWeek {
  id: string;
  name: string;
  rawText: string;
  parsed: ParsedMealPlan;
  savedAt: string;
}

// ============================================================
// ACTIVE PLAN (Week 1 or imported, normalised)
// ============================================================

export interface ActivePlan {
  id: number;             // 1 = built-in Week 1, otherwise = imported week's timestamp id
  storageKey: string;     // unique key used for grocery checkbox state
  name: string;           // display name
  isImported: boolean;
  meals: Meal[];
  recipes: DayRecipe[];
  mondayShop: GroceryTrip;
  thursdayShop: GroceryTrip;
  reminders: CalendarReminder[];
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
