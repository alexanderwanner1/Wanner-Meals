import React, { useState, useEffect } from 'react';
import { week1MondayTrip, week1ThursdayTrip } from '../data/week1Groceries';
import GroceryCategory from '../components/grocery/GroceryCategory';
import { loadFromStorage, saveToStorage, GROCERY_KEY } from '../utils/storage';

const MONDAY_KEY  = GROCERY_KEY(1, 'monday-shop');
const THURSDAY_KEY = GROCERY_KEY(1, 'thursday-shop');

const TRIPS = [week1MondayTrip, week1ThursdayTrip];

export default function GroceryList() {
  const [activeTrip, setActiveTrip] = useState<'monday-shop' | 'thursday-shop'>('monday-shop');

  // Load checked IDs from localStorage on mount (D15: stay checked until Reset)
  const [checkedMon, setCheckedMon] = useState<Set<string>>(
    () => new Set<string>(loadFromStorage<string[]>(MONDAY_KEY, []))
  );
  const [checkedThu, setCheckedThu] = useState<Set<string>>(
    () => new Set<string>(loadFromStorage<string[]>(THURSDAY_KEY, []))
  );

  // Persist to localStorage whenever checked state changes
  useEffect(() => {
    saveToStorage(MONDAY_KEY, [...checkedMon]);
  }, [checkedMon]);

  useEffect(() => {
    saveToStorage(THURSDAY_KEY, [...checkedThu]);
  }, [checkedThu]);

  const currentChecked = activeTrip === 'monday-shop' ? checkedMon : checkedThu;
  const setCurrentChecked = activeTrip === 'monday-shop' ? setCheckedMon : setCheckedThu;

  const currentTrip = TRIPS.find(t => t.key === activeTrip)!;

  // Calculate total items (exclude empty categories)
  const allItems = currentTrip.categories.flatMap(c => c.items);
  const totalItems = allItems.length;
  const checkedCount = allItems.filter(i => currentChecked.has(i.id)).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const handleToggle = (id: string) => {
    setCurrentChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    setCurrentChecked(new Set());
  };

  return (
    <div className="max-w-3xl mx-auto pt-4 pb-6 md:pt-6">

      {/* ── Trip tabs (Monday / Thursday) ── */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {TRIPS.map(trip => (
            <button
              key={trip.key}
              onClick={() => setActiveTrip(trip.key as 'monday-shop' | 'thursday-shop')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTrip === trip.key
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {trip.label}
            </button>
          ))}
        </div>

        {/* Trip description */}
        <p className="text-xs text-gray-400 mt-2 px-0.5">{currentTrip.description}</p>
      </div>

      {/* ── Progress bar + Reset ── */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl shadow-sm px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              {checkedCount} of {totalItems} items
            </span>
            <div className="flex items-center gap-3">
              {checkedCount === totalItems && totalItems > 0 && (
                <span className="text-xs text-green-600 font-semibold">All done! 🎉</span>
              )}
              <button
                onClick={handleReset}
                disabled={checkedCount === 0}
                className="text-xs text-gray-400 font-medium disabled:opacity-30 hover:text-red-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Category list ── */}
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
