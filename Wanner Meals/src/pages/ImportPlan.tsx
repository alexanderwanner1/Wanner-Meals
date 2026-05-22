import React, { useState } from 'react';
import type { ImportedWeek } from '../types';
import { parseMealPlanText } from '../utils/parser';

interface ImportPlanProps {
  importedWeeks: ImportedWeek[];
  onSave: (week: ImportedWeek) => void;
  onDeleteImported: (id: string) => void;
}

export default function ImportPlan({ importedWeeks, onSave, onDeleteImported }: ImportPlanProps) {
  const [rawText, setRawText] = useState('');
  const [preview, setPreview] = useState<ReturnType<typeof parseMealPlanText> | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handlePreview = () => {
    const parsed = parseMealPlanText(rawText);
    setPreview(parsed);
    setSavedId(null);
  };

  const handleSave = () => {
    if (!preview) return;
    const now = new Date();
    const id = String(Date.now());
    const name = `Imported — ${now.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
    const week: ImportedWeek = {
      id,
      name,
      rawText,
      parsed: preview,
      savedAt: now.toISOString(),
    };
    onSave(week);
    setSavedId(id);
  };

  const handleClear = () => {
    setRawText('');
    setPreview(null);
    setSavedId(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 md:pt-6 space-y-5">

      {/* ── Heading ── */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Import a Meal Plan</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Paste any plain-text meal plan below. The app will try to detect days, meals, and grocery lists.
        </p>
      </div>

      {/* ── Textarea ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <textarea
          value={rawText}
          onChange={e => { setRawText(e.target.value); setPreview(null); setSavedId(null); }}
          placeholder={`Paste your meal plan here. For best results, format it like:\n\nMonday\nFrozen Pizza Night\n\nIngredients\n- 1 frozen pizza\n\nInstructions\n1. Preheat oven...\n\nMonday Shop\n- Ground beef\n- Pasta\n\nThursday Shop\n- Rotisserie chicken`}
          rows={12}
          className="w-full px-4 py-4 text-sm text-gray-800 placeholder-gray-300 resize-none focus:outline-none font-mono leading-relaxed"
        />
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-3">
        <button
          onClick={handlePreview}
          disabled={rawText.trim().length === 0}
          className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm disabled:opacity-40 hover:bg-green-700 active:bg-green-800 transition-colors"
        >
          Preview Import
        </button>
        <button
          onClick={handleClear}
          disabled={rawText.trim().length === 0 && !preview}
          className="px-4 py-3 rounded-xl bg-white text-gray-500 font-semibold text-sm border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* ── Preview result ── */}
      {preview && (
        <div className="space-y-4">
          {/* Warnings */}
          {preview.warnings.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 space-y-1.5">
              <p className="text-amber-800 font-semibold text-sm">Parser notes</p>
              {preview.warnings.map((w, i) => (
                <p key={i} className="text-amber-700 text-xs">• {w}</p>
              ))}
            </div>
          )}

          {/* Detected days */}
          {preview.detectedDays.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="font-bold text-gray-900 text-sm">
                  Detected Days ({preview.detectedDays.length})
                </p>
              </div>
              <div className="px-4 py-3 flex flex-wrap gap-2">
                {preview.detectedDays.map(d => (
                  <span
                    key={d}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detected recipes */}
          {preview.detectedRecipes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="font-bold text-gray-900 text-sm">
                  Detected Recipes ({preview.detectedRecipes.length})
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {preview.detectedRecipes.map(r => (
                  <div key={r.day} className="px-4 py-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase w-20 flex-shrink-0">
                        {r.day}
                      </span>
                      <span className="text-sm text-gray-800 font-medium">{r.mealName || '—'}</span>
                    </div>
                    {r.ingredients.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 ml-[5.5rem]">
                        {r.ingredients.length} ingredients, {r.steps.length} steps
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected grocery lists */}
          {(preview.detectedGroceryLists.monday.length > 0 ||
            preview.detectedGroceryLists.thursday.length > 0) && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="font-bold text-gray-900 text-sm">Detected Grocery Lists</p>
              </div>
              <div className="px-4 py-3 space-y-2">
                {preview.detectedGroceryLists.monday.length > 0 && (
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">Monday shop:</span>{' '}
                    {preview.detectedGroceryLists.monday.length} items
                  </p>
                )}
                {preview.detectedGroceryLists.thursday.length > 0 && (
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">Thursday shop:</span>{' '}
                    {preview.detectedGroceryLists.thursday.length} items
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Save button */}
          {!savedId ? (
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 active:bg-black transition-colors"
            >
              Save to App — appears as a new week tab ↗
            </button>
          ) : (
            <div className="bg-green-50 rounded-2xl px-4 py-4 text-center space-y-1">
              <p className="text-green-700 font-bold text-base">Saved! ✓</p>
              <p className="text-green-600 text-sm">
                Find it in the <span className="font-semibold">Home</span> tab week selector.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Saved imports list ── */}
      {importedWeeks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Saved Imports
          </h3>
          {importedWeeks.map(iw => (
            <div
              key={iw.id}
              className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{iw.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {iw.parsed.detectedDays.length} days · {iw.parsed.detectedRecipes.length} recipes
                </p>
              </div>
              <button
                onClick={() => onDeleteImported(iw.id)}
                className="text-xs text-red-400 font-medium hover:text-red-600 transition-colors px-2 py-1"
                aria-label={`Delete ${iw.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Format tips ── */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        <p className="text-gray-700 font-semibold text-sm">Tips for best results</p>
        <ul className="space-y-1.5">
          {[
            'Start each day on its own line: "Monday", "Tuesday:", "## Wednesday"',
            'Put the meal name on the next line after the day',
            'Use "Ingredients" and "Instructions" as section headers',
            'Add "Monday Shop" and "Thursday Shop" headings for grocery lists',
            'Bullet or number each ingredient / step — the parser handles most formats',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-green-400 mt-0.5 flex-shrink-0">●</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
