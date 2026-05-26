import React from 'react';
import type { ActivePlan } from '../types';
import DayRecipePage from '../components/cooking/DayRecipePage';
import PrepPage from '../components/cooking/PrepPage';

const TABS = ['Prep', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TAB_SHORTS: Record<string, string> = {
  Prep: 'Prep', Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

interface CookingProps {
  activePlan: ActivePlan;
  activeDay: string;
  setActiveDay: (day: string) => void;
}

export default function Cooking({ activePlan, activeDay, setActiveDay }: CookingProps) {
  const recipe = activePlan.recipes.find(r => r.day === activeDay);
  const meal = activePlan.meals.find(m => m.day === activeDay);

  return (
    <div className="max-w-3xl mx-auto pt-4 pb-6 md:pt-6">

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

      {activeDay === 'Prep' && (
        <PrepPage recipes={activePlan.recipes} meals={activePlan.meals} />
      )}

      {activeDay !== 'Prep' && recipe && meal && (
        <DayRecipePage recipe={recipe} meal={meal} />
      )}

      {activeDay !== 'Prep' && (!recipe || !meal) && (
        <div className="px-4 pt-8 text-center">
          <p className="text-gray-400">No recipe found for {activeDay} in this plan.</p>
        </div>
      )}
    </div>
  );
}
