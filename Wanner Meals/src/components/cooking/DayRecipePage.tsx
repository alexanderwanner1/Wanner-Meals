import React, { useState } from 'react';
import type { Meal, DayRecipe } from '../../types';
import { ProteinBadge, StyleBadge, InfoBadge } from '../ui/Badge';
import TimelineStep from './TimelineStep';

interface DayRecipePageProps {
  meal: Meal;
  recipe: DayRecipe;
}

// Reusable note card inside the recipe page
function NoteCard({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="flex gap-3 bg-gray-50 rounded-xl px-3.5 py-3">
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-700 mt-0.5 leading-snug">{text}</p>
      </div>
    </div>
  );
}

// Thursday reminder card (no recipe — E18)
function FreezerReminderCard({ meal }: { meal: Meal }) {
  return (
    <div className="p-4 space-y-4">
      {/* Hero card */}
      <div className="bg-blue-50 rounded-2xl p-5 text-center">
        <div className="text-5xl mb-3">🧊</div>
        <h3 className="font-bold text-blue-900 text-xl">Freezer Soup Night</h3>
        <p className="text-blue-600 text-sm mt-2 leading-relaxed">
          Swimming lesson night — grab the soup from the downstairs freezer.
        </p>
      </div>

      {/* Timing */}
      <div className="flex gap-3">
        <InfoBadge label={`Active: ${meal.activeTime}`} />
        <InfoBadge label={`Total: ${meal.cookTime}`} />
      </div>

      {/* Notes */}
      <div className="space-y-2.5">
        <NoteCard icon="🥛" label="Dairy-free" text={meal.dairyFreeNote} />
        <NoteCard icon="👶" label="Toddler" text={meal.toddlerNote} />
      </div>

      {/* Backup plan */}
      <div className="bg-amber-50 rounded-2xl p-4">
        <p className="text-amber-800 font-semibold text-sm">💡 Backup plan</p>
        <p className="text-amber-700 text-sm mt-1.5 leading-relaxed">
          If the soup contains dairy or the freezer is empty — use eggs on toast,
          leftovers, or a dairy-free frozen meal instead.
        </p>
      </div>

      {/* Simple reheating steps */}
      <div>
        <h3 className="font-bold text-gray-900 text-base mb-4">Reheating steps</h3>
        <div>
          {[
            'Take soup from the downstairs freezer.',
            'If thawed, pour into a pot and heat over medium-low.',
            'If frozen solid, place container in warm water for a few minutes, then transfer to a pot.',
            'Heat until fully warmed through, stirring often.',
            'Add a splash of water or broth if too thick.',
            'Serve with toast, crackers, or bread.',
          ].map((step, i, arr) => (
            <TimelineStep
              key={i}
              stepNumber={i + 1}
              text={step}
              isLast={i === arr.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main recipe page component
export default function DayRecipePage({ meal, recipe }: DayRecipePageProps) {
  const [showIngredients, setShowIngredients] = useState(true);

  // Thursday is reminder-only (E18): no steps in the recipe data
  if (recipe.steps.length === 0) {
    return <FreezerReminderCard meal={meal} />;
  }

  return (
    <div className="p-4 space-y-5">
      {/* ── Meal header ── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{meal.meal}</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <ProteinBadge proteinType={meal.proteinType} label={meal.protein} />
          <StyleBadge label={meal.style} />
          <InfoBadge label={`Active: ${meal.activeTime}`} />
          {meal.totalTime && meal.totalTime !== meal.activeTime && (
            <InfoBadge label={`Total: ${meal.totalTime}`} />
          )}
        </div>
      </div>

      {/* ── Notes ── */}
      <div className="space-y-2">
        <NoteCard icon="🥛" label="Dairy-free" text={meal.dairyFreeNote} />
        <NoteCard icon="👶" label="Toddler" text={meal.toddlerNote} />
        {meal.leftoverNote && (
          <NoteCard icon="📦" label="Leftovers" text={meal.leftoverNote} />
        )}
      </div>

      {/* ── Ingredients (collapsible, open by default) ── */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="w-full flex items-center justify-between px-4 py-3.5"
        >
          <span className="font-bold text-gray-900 text-sm">
            Ingredients
            <span className="text-gray-400 font-normal ml-1.5">({recipe.ingredients.length})</span>
          </span>
          <span className="text-xs font-semibold text-green-600">
            {showIngredients ? 'Hide' : 'Show'}
          </span>
        </button>

        {showIngredients && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <ul className="space-y-2.5 mt-3">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="text-green-400 mt-1 text-xs">●</span>
                  <span className="leading-snug">{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Instructions (always visible — vertical timeline) ── */}
      <div>
        <h3 className="font-bold text-gray-900 text-base mb-5">Instructions</h3>
        <div>
          {recipe.steps.map((step, i) => (
            <TimelineStep
              key={i}
              stepNumber={i + 1}
              text={step}
              isLast={i === recipe.steps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
