import React, { useState, useEffect } from 'react';
import type { ActivePlan } from '../types';
import GroceryCategory from '../components/grocery/GroceryCategory';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface GroceryListProps {
  activePlan: ActivePlan;
}

export default function GroceryList({ activePlan }: GroceryListProps) {
  const MONDAY_KEY = `wanner-meals-${activePlan.storageKey}-monday-shop`;
  const THURSDAY_KEY = `wanner-meals-${activePlan.storageKey}-thursday-shop`;

  const TRIPS = [activePlan.mondayShop, activePlan.thursdayShop];

  const [activeTrip, setActiveTrip] = useState<'monday-shop' | 'thursday-shop'>('monday-shop');

  const [checkedMon, setCheckedMon] = useState<Set<string>>(
    () => new Set<string>(loadFromStorage<string[]>(MONDAY_KEY, []))
  );
  const [checkedThu, setCheckedThu] = useState<Set<string>>(
    () => new Set<string>(loadFromStorage<string[]>(THURSDAY_KEY, []))
  );

  useEffect(() => { saveToStorage(MONDAY_KEY, [...checkedMon]); }, [checkedMon, MONDAY_KEY]);
  useEffect(() => { saveToStorage(THURSDAY_KEY, [...checkedThu]); }, [checkedThu, THURSDAY_KEY]);

  const currentChecked = activeTrip === 'monday-shop' ? checkedMon : checkedThu;
  const setCurrentChecked = activeTrip === 'monday-shop' ? setCheckedMon : setCheckedThu;

  const currentTrip = TRIPS.find(t => t.key === activeTrip)!;

  const allItems = currentTrip.categories.flatMap(c => c.items);
  const totalItems = allItems.length;
  const checkedCount = allItems.filter(i => currentChecked.has(i.id)).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const handleToggle = (id: string) => {
    setCurrentChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReset = () => setCurrentChecked(new Set());

  return (
    <div className="max-w-3xl mx-auto pt-4 pb-6 md:pt-6">

      <div className="px-4 mb-3">
        <div className="flex gap-2">
          {TRIPS.map(trip => (
            <button
              key={trip.key}
              onClick={() => setActiveTrip(trip.key as 'monday-shop' | 'thursday-shop')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTrip === trip.key
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {trip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">{currentTrip.label}</p>
              <p className="text-xs text-gray-400">{currentTrip.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500">
                {checkedCount}/{totalItems}
              </span>
              {checkedCount === totalItems && totalItems > 0 && <span>🎉</span>}
              <button
                onClick={handleReset}
                disabled={checkedCount === 0}
                className="text-xs text-gray-400 font-medium disabled:opacity-30 hover:text-red-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4">
        {currentTrip.categories.map(category => (
          <GroceryCategory
            key={category.name}
            category={category}
            checkedIds={currentChecked}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
