// ============================================================
// WANNER MEALS — MEAL PLAN TEXT PARSER
//
// VERSION 1.2:
//   - Grocery headers checked BEFORE day headers
//   - Skips subcategory headers ("Produce:", etc.) in grocery mode
//   - Extracts Meal / Protein / Style / Time / Notes "Field: value" lines
// ============================================================

import type { ParsedMealPlan, DetectedRecipe } from '../types';

const DAY_NAMES = [
  'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'saturday', 'sunday',
];

const INGREDIENT_HEADERS = [
  'ingredients', 'ingredient list', "you'll need", 'you will need', 'what you need',
];

const INSTRUCTION_HEADERS = [
  'instructions', 'steps', 'directions', 'method', 'how to make', 'preparation',
];

const GROCERY_MONDAY_HEADERS = [
  'monday shop', 'monday grocery', 'monday list', 'monday shopping',
  'shop monday', 'monday groceries',
];

const GROCERY_THURSDAY_HEADERS = [
  'thursday shop', 'thursday grocery', 'thursday list', 'thursday shopping',
  'shop thursday', 'thursday groceries',
];

function norm(line: string): string {
  return line.toLowerCase().trim();
}

function matchesAny(line: string, patterns: string[]): boolean {
  return patterns.some(p => line.includes(p));
}

export function parseMealPlanText(rawText: string): ParsedMealPlan {
  const warnings: string[] = [];

  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    return {
      rawText: rawText ?? '',
      detectedDays: [],
      detectedRecipes: [],
      detectedGroceryLists: { monday: [], thursday: [] },
      warnings: ['Input is empty. Paste a meal plan and try again.'],
    };
  }

  const lines = rawText.split('\n').map(l => l.trimEnd());
  const detectedDays: string[] = [];
  const detectedRecipes: DetectedRecipe[] = [];
  const mondayGroceries: string[] = [];
  const thursdayGroceries: string[] = [];

  type ParseMode =
    | 'scanning'
    | 'in-day'
    | 'in-ingredients'
    | 'in-steps'
    | 'in-monday-grocery'
    | 'in-thursday-grocery';

  let mode: ParseMode = 'scanning';
  let currentRecipe: DetectedRecipe | null = null;

  const finaliseRecipe = () => {
    if (currentRecipe && (currentRecipe.mealName || currentRecipe.ingredients.length > 0)) {
      detectedRecipes.push(currentRecipe);
    }
    currentRecipe = null;
    mode = 'scanning';
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = norm(raw);

    if (line.length === 0) continue;

    // ── Grocery headers BEFORE day headers ─────────────────
    if (matchesAny(line, GROCERY_MONDAY_HEADERS)) {
      finaliseRecipe();
      mode = 'in-monday-grocery';
      continue;
    }

    if (matchesAny(line, GROCERY_THURSDAY_HEADERS)) {
      finaliseRecipe();
      mode = 'in-thursday-grocery';
      continue;
    }

    // ── Day heading ────────────────────────────────────────
    const matchedDay = DAY_NAMES.find(d => {
      const stripped = line.replace(/[#*_:\-–—]/g, '').trim();
      return stripped === d || stripped.startsWith(d + ' ') || stripped.endsWith(' ' + d);
    });

    if (matchedDay) {
      finaliseRecipe();
      const capitalized = matchedDay.charAt(0).toUpperCase() + matchedDay.slice(1);
      if (!detectedDays.includes(capitalized)) {
        detectedDays.push(capitalized);
      }
      currentRecipe = {
        day: capitalized,
        mealName: '',
        ingredients: [],
        steps: [],
      };
      mode = 'in-day';
      continue;
    }

    if (matchesAny(line, INGREDIENT_HEADERS)) {
      mode = 'in-ingredients';
      continue;
    }

    if (matchesAny(line, INSTRUCTION_HEADERS)) {
      mode = 'in-steps';
      continue;
    }

    // ── Content handling by mode ───────────────────────────

    if (mode === 'in-day' && currentRecipe) {
      const trimmed = raw.trim();
      // v1.2: capture "Field: value" lines as structured metadata
      const fieldMatch = trimmed.match(/^(meal|protein|style|time|notes?)\s*:\s*(.+)$/i);
      if (fieldMatch) {
        const field = fieldMatch[1].toLowerCase();
        const value = fieldMatch[2].trim();
        if (field === 'meal' && !currentRecipe.mealName) currentRecipe.mealName = value;
        else if (field === 'protein') currentRecipe.protein = value;
        else if (field === 'style') currentRecipe.style = value;
        else if (field === 'time') currentRecipe.cookTime = value;
        else if (field === 'notes' || field === 'note') currentRecipe.notes = value;
        continue;
      }
      // Otherwise: first non-field line is the meal name
      if (!currentRecipe.mealName && trimmed.length > 0) {
        currentRecipe.mealName = trimmed.replace(/^[-•*]\s*/, '');
      }
      continue;
    }

    if (mode === 'in-ingredients' && currentRecipe) {
      const cleaned = raw.trim().replace(/^[-•*\d+\.]\s*/, '').trim();
      if (cleaned.length > 0) {
        currentRecipe.ingredients.push(cleaned);
      }
      continue;
    }

    if (mode === 'in-steps' && currentRecipe) {
      const cleaned = raw
        .trim()
        .replace(/^\d+[\.\)]\s*/, '')
        .replace(/^[-•*]\s*/, '')
        .trim();
      if (cleaned.length > 0) {
        currentRecipe.steps.push(cleaned);
      }
      continue;
    }

    if (mode === 'in-monday-grocery') {
      const trimmed = raw.trim();
      if (/:\s*$/.test(trimmed) && !/^[-•*]/.test(trimmed)) continue;
      const cleaned = trimmed.replace(/^[-•*]\s*/, '').trim();
      if (cleaned.length > 0) mondayGroceries.push(cleaned);
      continue;
    }

    if (mode === 'in-thursday-grocery') {
      const trimmed = raw.trim();
      if (/:\s*$/.test(trimmed) && !/^[-•*]/.test(trimmed)) continue;
      const cleaned = trimmed.replace(/^[-•*]\s*/, '').trim();
      if (cleaned.length > 0) thursdayGroceries.push(cleaned);
      continue;
    }
  }

  finaliseRecipe();

  if (detectedDays.length === 0) {
    warnings.push('No days of the week were detected. Try pasting a plan that includes "Monday:", "Tuesday:", etc.');
  }
  if (detectedRecipes.length === 0) {
    warnings.push('No recipes were detected. The raw text has been saved as-is.');
  }
  if (mondayGroceries.length === 0 && thursdayGroceries.length === 0) {
    warnings.push('No grocery lists were detected. Look for "Monday Shop" or "Thursday Shop" headings.');
  }

  return {
    rawText,
    detectedDays,
    detectedRecipes,
    detectedGroceryLists: { monday: mondayGroceries, thursday: thursdayGroceries },
    warnings,
  };
}
