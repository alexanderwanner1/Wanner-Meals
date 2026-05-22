import React from 'react';
import { week1Recipes, week1Meals } from '../data/week1Meals';
import DayRecipePage from '../components/cooking/DayRecipePage';
import PrepPage from '../components/cooking/PrepPage';

// Tab list: Prep first, then Mon → Sun
const TABS = ['Prep', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TAB_SHORTS: Record<string, string> = {
  Prep: 'Prep', Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

interface CookingProps {
  activeDay: string;
  setActiveDay: (day: string) => void;
}

export default function Cooking({ activeDay, setActiveDay }: CookingProps) {
  const recipe = week1Recipes.find(r => r.day === activeDay);
  const meal = week1Meals.find(m => m.day === activeDay);

  return (
    <div className="max-w-3xl mx-auto pt-4 pb-6 md:pt-6">

      {/* ── Horizontally scrollable day tab bar ── */}
      <div className="px-4 mb-1">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map(tab => {
            const isActive = activeDay === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveDay(tab)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300'
                }`}
              >
                {TAB_SHORTS[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content area ── */}
      {activeDay === 'Prep' && (
        <PrepPage recipes={week1Recipes} meals={week1Meals} />
      )}

      {activeDay !== 'Prep' && recipe && meal && (
        <DayRecipePage recipe={recipe} meal={meal} />
      )}

      {/* Fallback if somehow no match */}
      {activeDay !== 'Prep' && (!recipe || !meal) && (
        <div className="px-4 pt-8 text-center">
          <p className="text-gray-400">No recipe found for {activeDay}.</p>
        </div>
      )}
    </div>
  );
}
