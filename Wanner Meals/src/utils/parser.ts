// ============================================================
// WANNER MEALS — MEAL PLAN TEXT PARSER
//
// VERSION 1: Basic structural detection only.
// This parser is intentionally simple and defensive.
// It will NOT crash on imperfect input.
//
// FUTURE IMPROVEMENTS (mark with // TODO: FUTURE):
//   - Connect to an AI API to improve detection accuracy
//   - Add NLP-based ingredient quantity normalisation
//   - Add recipe matching against a saved library
//   - Add support for multiple weeks in one paste
//   - Add CSV / JSON import formats
// ============================================================

import type { ParsedMealPlan, DetectedRecipe } from '../types';

// Days of the week we try to detect (case-insensitive)
const DAY_NAMES = [
  'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'saturday', 'sunday',
];

// Section headers that signal an ingredients block
const INGREDIENT_HEADERS = [
  'ingredients', 'ingredient list', 'you\'ll need', 'you will need', 'what you need',
];

// Section headers that signal an instructions block
const INSTRUCTION_HEADERS = [
  'instructions', 'steps', 'directions', 'method', 'how to make', 'preparation',
];

// Headers that signal a grocery list block
const GROCERY_MONDAY_HEADERS = [
  'monday shop', 'monday grocery', 'monday list', 'monday shopping',
  'shop monday', 'monday groceries',
];

const GROCERY_THURSDAY_HEADERS = [
  'thursday shop', 'thursday grocery', 'thursday list', 'thursday shopping',
  'shop thursday', 'thursday groceries',
];

/**
 * Normalise a line of text for comparison: lowercase + trim
 */
function norm(line: string): string {
  return line.toLowerCase().trim();
}

/**
 * Check if a normalised line matches any of the given patterns
 */
function matchesAny(line: string, patterns: string[]): boolean {
  return patterns.some(p => line.includes(p));
}

/**
 * Parse a raw pasted meal plan text into structured data.
 *
 * Returns:
 *   - rawText: the original input, untouched
 *   - detectedDays: array of day names found
 *   - detectedRecipes: array of recipe objects (may be partially filled)
 *   - detectedGroceryLists: { monday: string[], thursday: string[] }
 *   - warnings: any issues detected during parsing
 *
 * All output arrays may be empty — the function never throws.
 */
export function parseMealPlanText(rawText: string): ParsedMealPlan {
  const warnings: string[] = [];

  // Defensive: handle null/undefined/empty input
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

  // ──────────────────────────────────────────────────────────
  // STATE MACHINE — we track what "section" we're currently in
  // ──────────────────────────────────────────────────────────
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

    // Skip empty lines between sections
    if (line.length === 0) continue;

    // ── Detect a day heading ────────────────────────────────
    const matchedDay = DAY_NAMES.find(d => {
      // Looks for "Monday", "## Monday", "**Monday**", "Monday:", etc.
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

    // ── Detect ingredients header ───────────────────────────
    if (matchesAny(line, INGREDIENT_HEADERS)) {
      mode = 'in-ingredients';
      continue;
    }

    // ── Detect instructions header ──────────────────────────
    if (matchesAny(line, INSTRUCTION_HEADERS)) {
      mode = 'in-steps';
      continue;
    }

    // ── Detect Monday grocery header ────────────────────────
    if (matchesAny(line, GROCERY_MONDAY_HEADERS)) {
      finaliseRecipe();
      mode = 'in-monday-grocery';
      continue;
    }

    // ── Detect Thursday grocery header ──────────────────────
    if (matchesAny(line, GROCERY_THURSDAY_HEADERS)) {
      finaliseRecipe();
      mode = 'in-thursday-grocery';
      continue;
    }

    // ── Handle content based on current mode ────────────────

    if (mode === 'in-day' && currentRecipe) {
      // The line right after a day heading is likely the meal name
      // TODO: FUTURE — use NLP to distinguish meal name vs notes vs description
      if (!currentRecipe.mealName && raw.trim().length > 0) {
        currentRecipe.mealName = raw.trim().replace(/^[-•*]\s*/, '');
      }
      continue;
    }

    if (mode === 'in-ingredients' && currentRecipe) {
      // Ingredient lines usually start with "- ", "• ", "* ", or a number
      const cleaned = raw.trim().replace(/^[-•*\d+\.]\s*/, '').trim();
      if (cleaned.length > 0) {
        currentRecipe.ingredients.push(cleaned);
      }
      continue;
    }

    if (mode === 'in-steps' && currentRecipe) {
      // Step lines usually start with "1.", "2.", or "-"
      const cleaned = raw.trim().replace(/^\d+[\.\)]\s*/, '').replace(/^[-•*]\s*/, '').trim();
      if (cleaned.length > 0) {
        currentRecipe.steps.push(cleaned);
      }
      continue;
    }

    if (mode === 'in-monday-grocery') {
      const cleaned = raw.trim().replace(/^[-•*]\s*/, '').trim();
      if (cleaned.length > 0) {
        mondayGroceries.push(cleaned);
      }
      continue;
    }

    if (mode === 'in-thursday-grocery') {
      const cleaned = raw.trim().replace(/^[-•*]\s*/, '').trim();
      if (cleaned.length > 0) {
        thursdayGroceries.push(cleaned);
      }
      continue;
    }
  }

  // Finalise any open recipe
  finaliseRecipe();

  // ── Warnings ──────────────────────────────────────────────
  if (detectedDays.length === 0) {
    warnings.push('No days of the week were detected. Try pasting a plan that includes "Monday:", "Tuesday:", etc.');
  }

  if (detectedRecipes.length === 0) {
    warnings.push('No recipes were detected. The raw text has been saved as-is.');
  }

  if (mondayGroceries.length === 0 && thursdayGroceries.length === 0) {
    warnings.push('No grocery lists were detected. Look for "Monday Shop" or "Thursday Shop" headings.');
  }

  // TODO: FUTURE — validate detected recipes against known format
  // TODO: FUTURE — cross-reference detected days with detected recipes
  // TODO: FUTURE — use AI to fill gaps in partially-detected recipes

  return {
    rawText,
    detectedDays,
    detectedRecipes,
    detectedGroceryLists: {
      monday: mondayGroceries,
      thursday: thursdayGroceries,
    },
    warnings,
  };
}
