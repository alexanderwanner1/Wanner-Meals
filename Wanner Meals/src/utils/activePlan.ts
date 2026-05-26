// ============================================================
// WANNER MEALS — ACTIVE PLAN RESOLVER
//
// Converts either built-in Week 1 OR an imported week into a
// single uniform shape (ActivePlan) that every page consumes.
// ============================================================

import type {
  ActivePlan,
  Meal,
  DayRecipe,
  GroceryTrip,
  GroceryItem,
  ImportedWeek,
  ProteinType,
} from '../types';
import { week1Meals, week1Recipes, week1CalendarReminders } from '../data/week1Meals';
import { week1MondayTrip, week1ThursdayTrip } from '../data/week1Groceries';

const DAY_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_SHORTS: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

/** Built-in default plan. */
export function getWeek1Plan(): ActivePlan {
  return {
    id: 1,
    storageKey: 'plan-1',
    name: 'Week 1',
    isImported: false,
    meals: week1Meals,
    recipes: week1Recipes,
    mondayShop: week1MondayTrip,
    thursdayShop: week1ThursdayTrip,
    reminders: week1CalendarReminders,
  };
}

/** Pick a protein badge type from a free-text protein description. */
function inferProteinType(text: string): ProteinType {
  const t = (text || '').toLowerCase();
  if (t.includes('pizza')) return 'pizza';
  if (t.includes('beef')) return 'beef';
  if (t.includes('chicken')) return 'chicken';
  if (t.includes('turkey')) return 'turkey';
  if (t.includes('freezer') || t.includes('leftover')) return 'freezer';
  if (
    t.includes('vegetarian') || t.includes('tofu') ||
    t.includes('bean') || t.includes('chickpea') || t.includes('lentil')
  ) return 'vegetarian';
  return 'vegetarian';
}

/** Convert a flat list of grocery strings into a single-category trip. */
function groceriesToTrip(
  label: string,
  description: string,
  key: string,
  items: string[],
  idPrefix: string,
): GroceryTrip {
  const cleanItems: GroceryItem[] = items.map((name, i) => ({
    id: `${idPrefix}-${i}`,
    name,
  }));
  return {
    label,
    description,
    key,
    categories: [
      { name: 'All items', items: cleanItems },
    ],
  };
}

/** Convert an imported plan into the unified shape. */
export function importedWeekToActivePlan(iw: ImportedWeek): ActivePlan {
  const id = Number(iw.id) || Date.now();
  const storageKey = `plan-${iw.id}`;

  const meals: Meal[] = [];
  const recipes: DayRecipe[] = [];

  for (const day of DAY_ORDER) {
    const detected = iw.parsed.detectedRecipes.find(r => r.day === day);
    if (!detected) continue;

    const protein   = detected.protein  ?? 'Imported';
    const style     = detected.style    ?? 'Imported';
    const cookTime  = detected.cookTime ?? '';
    const notes     = detected.notes    ?? '';

    meals.push({
      day,
      dayShort: DAY_SHORTS[day],
      meal: detected.mealName || `${day} meal`,
      protein,
      proteinType: inferProteinType(protein),
      style,
      cookTime,
      activeTime: cookTime,
      notes,
      dairyFreeNote: '',
      toddlerNote: '',
    });

    recipes.push({
      day,
      dayShort: DAY_SHORTS[day],
      mealName: detected.mealName || `${day} meal`,
      ingredients: detected.ingredients,
      steps: detected.steps,
    });
  }

  return {
    id,
    storageKey,
    name: iw.name,
    isImported: true,
    meals,
    recipes,
    mondayShop: groceriesToTrip(
      'Monday Shop',
      'From imported plan · Mon – Thu',
      'monday-shop',
      iw.parsed.detectedGroceryLists.monday,
      `imp-${id}-mon`,
    ),
    thursdayShop: groceriesToTrip(
      'Thursday Shop',
      'From imported plan · Fri – Sun',
      'thursday-shop',
      iw.parsed.detectedGroceryLists.thursday,
      `imp-${id}-thu`,
    ),
    reminders: [],
  };
}

/** Pick the right plan based on active week selection. */
export function resolveActivePlan(
  activeWeek: number,
  importedWeeks: ImportedWeek[],
): ActivePlan {
  if (activeWeek === 1) return getWeek1Plan();
  const imported = importedWeeks.find(w => Number(w.id) === activeWeek);
  if (imported) return importedWeekToActivePlan(imported);
  return getWeek1Plan();
}
