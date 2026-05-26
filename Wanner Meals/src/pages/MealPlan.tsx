import React from 'react';
import type { ActivePlan } from '../types';
import MealCard from '../components/mealplan/MealCard';

interface MealPlanProps {
  activePlan: ActivePlan;
  onCookThis: (day: string) => void;
}

export default function MealPlan({ activePlan, onCookThis }: MealPlanProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-6 md:pt-6">

      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900">
          {activePlan.isImported ? activePlan.name : 'This Week'}
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {activePlan.isImported
            ? 'Imported plan · tap a day to expand'
            : 'Tap a day to expand · dairy-free portions noted · no seafood'}
        </p>
      </div>

      {!activePlan.isImported && (
        <div className="bg-green-50 rounded-2xl px-4 py-3 mb-5 space-y-1">
          <p className="text-green-800 font-semibold text-xs uppercase tracking-wide">Family rules</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
            {[
              '🍕 Friday = nacho night (always)',
              '🧊 Thursday = swimming = freezer meal',
              '🐟 No fish or seafood',
              '🥛 Dairy served on the side for husband',
              '👶 All meals toddler-friendly',
            ].map(rule => (
              <p key={rule} className="text-green-700 text-xs">{rule}</p>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {activePlan.meals.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm">
            No meals in this plan yet.
          </div>
        ) : (
          activePlan.meals.map(meal => (
            <MealCard
              key={meal.day}
              meal={meal}
              defaultOpen={meal.day === 'Monday'}
              onCookThis={onCookThis}
            />
          ))
        )}
      </div>
    </div>
  );
}
