import React, { useState } from 'react';
import type { DayRecipe, Meal } from '../../types';
import { ProteinBadge } from '../ui/Badge';

interface PrepPageProps {
  recipes: DayRecipe[];
  meals: Meal[];
}

export default function PrepPage({ recipes, meals }: PrepPageProps) {
  // All days collapsed by default except Monday (first one)
  const [openDays, setOpenDays] = useState<Set<string>>(new Set(['Monday']));

  const toggleDay = (day: string) => {
    setOpenDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  return (
    <div className="p-4 space-y-3">
      {/* Intro */}
      <div className="bg-green-50 rounded-2xl px-4 py-3">
        <p className="text-green-800 font-semibold text-sm">📋 Full Week Ingredient List</p>
        <p className="text-green-700 text-xs mt-1">
          Tap each day to see its ingredients. No instructions here — just what you need to prep.
        </p>
      </div>

      {/* 7 collapsible day sections (E16) */}
      {recipes.map(recipe => {
        const isOpen = openDays.has(recipe.day);
        const meal = meals.find(m => m.day === recipe.day);
        const isThursday = recipe.day === 'Thursday';

        return (
          <div key={recipe.day} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Day header button */}
            <button
              onClick={() => toggleDay(recipe.day)}
              className="w-full flex items-center justify-between px-4 py-4 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-bold text-gray-900 text-sm flex-shrink-0">
                  {recipe.dayShort}
                </span>
                <span className="text-gray-600 text-sm truncate">{recipe.mealName}</span>
                {meal && (
                  <ProteinBadge
                    proteinType={meal.proteinType}
                    label={meal.protein.split(' ')[0]}
                  />
                )}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Ingredients list */}
            {isOpen && (
              <div className="accordion-enter border-t border-gray-50 px-4 pb-4">
                {isThursday ? (
                  <div className="mt-3 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-xl px-3 py-2.5">
                    <span>🧊</span>
                    <span>Soup from downstairs freezer — no grocery purchase needed.</span>
                  </div>
                ) : (
                  <ul className="space-y-2.5 mt-3">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-green-400 mt-1 text-xs flex-shrink-0">●</span>
                        <span className="text-sm text-gray-700 leading-snug">{ing}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
