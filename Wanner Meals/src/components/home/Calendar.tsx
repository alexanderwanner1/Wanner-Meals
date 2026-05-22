import React from 'react';
import type { Meal, CalendarReminder } from '../../types';
import { ProteinBadge } from '../ui/Badge';

interface CalendarProps {
  meals: Meal[];
  reminders: CalendarReminder[];
  onMealTap: (day: string) => void;
}

// Day headers: Sunday first (standard calendar)
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Week1 meals are indexed Mon=0 … Sun=6
// We map day name → meal index
const DAY_TO_MEAL_INDEX: Record<string, number> = {
  Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3,
  Friday: 4, Saturday: 5, Sunday: 6,
};

// Day name by JS getDay() (0=Sun)
const JS_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Returns the Monday of the week that contains `date`.
 */
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns a map of "YYYY-M-D" → meal day name (e.g. "Monday")
 * for the current week's 7 days.
 */
function buildWeekMealMap(): Map<string, string> {
  const map = new Map<string, string>();
  const monday = getMondayOfWeek(new Date());
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    map.set(key, dayNames[i]);
  }
  return map;
}

/**
 * Returns a map of "YYYY-M-D" → array of reminder icons
 */
function buildReminderMap(reminders: CalendarReminder[]): Map<string, CalendarReminder[]> {
  const map = new Map<string, CalendarReminder[]>();
  const monday = getMondayOfWeek(new Date());
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const dayReminders = reminders.filter(r => r.day === dayNames[i]);
    if (dayReminders.length > 0) {
      map.set(key, dayReminders);
    }
  }
  return map;
}

export default function Calendar({ meals, reminders, onMealTap }: CalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const monthName = today.toLocaleString('default', { month: 'long' });

  // First day of the month (0=Sun … 6=Sat)
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Total days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build the flat calendar array: nulls for padding, then day numbers
  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete the last row
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  // Build lookup maps
  const weekMealMap = buildWeekMealMap();
  const reminderMap = buildReminderMap(reminders);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Month header */}
      <div className="px-4 py-3 border-b border-gray-50">
        <h2 className="font-bold text-gray-900 text-base">
          {monthName} {year}
        </h2>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 border-b border-gray-50">
        {DAY_HEADERS.map(d => (
          <div
            key={d}
            className="py-2 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarCells.map((dayNum, idx) => {
          if (dayNum === null) {
            return <div key={`pad-${idx}`} className="min-h-[60px] bg-gray-50/50 border-b border-r border-gray-50" />;
          }

          const cellDate = new Date(year, month, dayNum);
          const isToday =
            dayNum === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const dayOfWeek = JS_DAY_NAMES[cellDate.getDay()];
          const key = `${year}-${month}-${dayNum}`;

          const mealDayName = weekMealMap.get(key);
          const meal = mealDayName !== undefined
            ? meals[DAY_TO_MEAL_INDEX[mealDayName]]
            : undefined;

          const cellReminders = reminderMap.get(key) ?? [];

          const isMealDay = !!meal;
          const isLastCol = (idx + 1) % 7 === 0;

          return (
            <div
              key={dayNum}
              className={`min-h-[60px] border-b border-gray-50 flex flex-col p-1 transition-colors ${
                !isLastCol ? 'border-r' : ''
              } ${isMealDay ? 'cursor-pointer active:bg-green-50' : ''}`}
              onClick={isMealDay ? () => onMealTap(mealDayName!) : undefined}
              role={isMealDay ? 'button' : undefined}
              aria-label={isMealDay ? `${dayOfWeek}: ${meal!.meal}` : undefined}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-xs font-semibold leading-none w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {dayNum}
                </span>
                {/* Reminder icons */}
                {cellReminders.length > 0 && (
                  <div className="flex gap-0.5">
                    {cellReminders.map((r, ri) => (
                      <span
                        key={ri}
                        className="text-[10px] leading-none"
                        title={r.title}
                        aria-label={r.title}
                      >
                        {r.icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Meal info (only if this day has a meal) */}
              {meal && (
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <p className="text-[9px] leading-tight text-gray-700 font-medium line-clamp-2">
                    {meal.meal}
                  </p>
                  <ProteinBadge
                    proteinType={meal.proteinType}
                    label={meal.proteinType === 'vegetarian' ? 'Veg' :
                           meal.proteinType === 'chicken' ? 'Chicken' :
                           meal.proteinType === 'freezer' ? 'Freezer' :
                           meal.proteinType === 'turkey' ? 'Turkey' :
                           meal.proteinType === 'beef' ? 'Beef' :
                           'Pizza'}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-gray-50 flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span>❄️</span>
          <span>Thaw reminder</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span>🧊</span>
          <span>Freezer meal</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span>🛒</span>
          <span>Pick up fresh</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-4 h-4 rounded-full bg-green-500 inline-block" />
          <span>Today</span>
        </div>
        <p className="w-full text-[10px] text-gray-400 mt-1">
          Tap a meal day to open the recipe ↗
        </p>
      </div>
    </div>
  );
}
