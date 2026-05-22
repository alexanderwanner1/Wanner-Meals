import React from 'react';
import type { ImportedWeek } from '../types';
import { weeks } from '../data/weeks';
import { week1Meals, week1CalendarReminders } from '../data/week1Meals';
import Calendar from '../components/home/Calendar';

interface HomeProps {
  activeWeek: number;
  setActiveWeek: (id: number) => void;
  importedWeeks: ImportedWeek[];
  onMealTap: (day: string) => void;
}

export default function Home({ activeWeek, setActiveWeek, importedWeeks, onMealTap }: HomeProps) {
  const selectedBuiltIn = weeks.find(w => w.id === activeWeek);
  const selectedImported = importedWeeks.find(w => w.id === String(activeWeek));

  // Determine what to show in the main area
  const showCalendar = selectedBuiltIn?.id === 1 && selectedBuiltIn.available;
  const showComingSoon = selectedBuiltIn && !selectedBuiltIn.available;
  const showImported = !!selectedImported;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 md:pt-6">

      {/* ── Week selector (A2: Home page only) ── */}
      <div className="mb-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-0.5">
          Select Week
        </h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {/* Built-in weeks */}
          {weeks.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWeek(w.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeWeek === w.id && !selectedImported
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              {w.name}
              {!w.available && (
                <span className="ml-1.5 text-[10px] opacity-60">soon</span>
              )}
            </button>
          ))}

          {/* Imported weeks — extra tabs (F19) */}
          {importedWeeks.map(iw => (
            <button
              key={iw.id}
              onClick={() => setActiveWeek(Number(iw.id) || -1)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedImported?.id === iw.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              {iw.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main area ── */}

      {/* Week 1: full calendar */}
      {showCalendar && (
        <Calendar
          meals={week1Meals}
          reminders={week1CalendarReminders}
          onMealTap={onMealTap}
        />
      )}

      {/* Weeks 2–4: Coming Soon (A3) */}
      {showComingSoon && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-12 text-center">
            <div className="text-5xl mb-4">🚧</div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              {selectedBuiltIn!.name} — Coming Soon
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
              Meal data for this week hasn't been added yet. Check back soon, or use the{' '}
              <span className="text-green-600 font-medium">Import tab</span> to paste your own plan.
            </p>
          </div>
        </div>
      )}

      {/* Imported week: raw preview */}
      {showImported && selectedImported && (
        <div className="space-y-4">
          {/* Detected meals */}
          {selectedImported.parsed.detectedRecipes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="font-bold text-gray-900 text-sm">Detected Meals</p>
              </div>
              <div className="divide-y divide-gray-50">
                {selectedImported.parsed.detectedRecipes.map(r => (
                  <div key={r.day} className="px-4 py-3">
                    <span className="text-xs font-bold text-gray-400 uppercase">{r.day}</span>
                    <p className="text-sm text-gray-800 mt-0.5">{r.mealName || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw text */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
              <p className="font-bold text-gray-900 text-sm">Saved Text</p>
              <span className="text-xs text-gray-400">{selectedImported.savedAt.slice(0, 10)}</span>
            </div>
            <div className="px-4 py-4">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto max-h-64 overflow-y-auto">
                {selectedImported.rawText}
              </pre>
            </div>
          </div>

          {/* Warnings */}
          {selectedImported.parsed.warnings.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-4 space-y-1.5">
              <p className="text-amber-800 font-semibold text-sm">Parser notes</p>
              {selectedImported.parsed.warnings.map((w, i) => (
                <p key={i} className="text-amber-700 text-xs">• {w}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
