import React, { useEffect, useMemo, useState } from 'react';
import type { Meal, CalendarReminder } from '../../types';
import {
  loadWeekAnchor,
  saveWeekAnchor,
  isAnchorStale,
  formatWeekRange,
} from '../../utils/weekAnchor';

interface CalendarProps {
  meals: Meal[];
  reminders: CalendarReminder[];
  onMealTap: (day: string) => void;
}

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** Maps each of the 7 days starting at `monday` → its meal-day name. */
function buildWeekMealMap(monday: Date): Map<string, string> {
  const map = new Map<string, string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    map.set(dayKey(d), DAY_NAMES[i]);
  }
  return map;
}

/** Maps each of the 7 days starting at `monday` → its reminder(s). */
function buildReminderMap(
  monday: Date,
  reminders: CalendarReminder[]
): Map<string, CalendarReminder[]> {
  const map = new Map<string, CalendarReminder[]>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayReminders = reminders.filter(r => r.day === DAY_NAMES[i]);
    if (dayReminders.length > 0) map.set(dayKey(d), dayReminders);
  }
  return map;
}

export default function Calendar({ meals, reminders, onMealTap }: CalendarProps) {
  // ── Persistent anchor: the Monday the plan is pinned to ──
  // First run: defaults to "this Monday" and saves it.
  // After that: stays put until the user taps "Move to this week".
  const [anchorMonday, setAnchorMonday] = useState<Date>(() => {
    const saved = loadWeekAnchor();
    return saved ?? saveWeekAnchor(new Date());
  });

  // The month currently displayed on the grid (independent of today's date).
  const [displayedMonth, setDisplayedMonth] = useState<Date>(
    () => new Date(anchorMonday.getFullYear(), anchorMonday.getMonth(), 1)
  );

  // When the anchor changes (e.g. user advances), jump the grid to its month.
  useEffect(() => {
    setDisplayedMonth(new Date(anchorMonday.getFullYear(), anchorMonday.getMonth(), 1));
  }, [anchorMonday]);

  const today = new Date();
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const monthName = displayedMonth.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const weekMealMap = useMemo(() => buildWeekMealMap(anchorMonday), [anchorMonday]);
  const reminderMap = useMemo(
    () => buildReminderMap(anchorMonday, reminders),
    [anchorMonday, reminders]
  );

  const stale = isAnchorStale(anchorMonday, today);

  const moveToThisWeek = () => setAnchorMonday(saveWeekAnchor(new Date()));
  const goPrevMonth = () => setDisplayedMonth(new Date(year, month - 1, 1));
  const goNextMonth = () => setDisplayedMonth(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* ── Plan-week banner ── */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
            Plan week
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {formatWeekRange(anchorMonday)}
          </p>
        </div>
        {stale && (
          <button
            onClick={moveToThisWeek}
            className="px-3 py-1.5 rounded-full bg-green-600 text-white text-xs font-semibold shadow-sm active:scale-95 transition"
          >
            Move to this week
          </button>
        )}
      </div>

      {/* ── Month header with prev / next ── */}
      <div className="px-3 py-2 border-t border-b border-gray-50 flex items-center justify-between">
        <button
          onClick={goPrevMonth}
          aria-label="Previous month"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 active:bg-gray-100 text-lg"
        >
          ‹
        </button>
        <h2 className="font-bold text-gray-900">
          {monthName} {year}
        </h2>
        <button
          onClick={goNextMonth}
          aria-label="Next month"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 active:bg-gray-100 text-lg"
        >
          ›
        </button>
      </div>

      {/* ── Day headers ── */}
      <div className="grid grid-cols-7 px-1 pt-2">
        {DAY_HEADERS.map(d => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div className="grid grid-cols-7 gap-1 p-1 pb-2">
        {calendarCells.map((day, idx) => {
          if (day === null) return <div key={idx} className="aspect-square" />;

          const cellDate = new Date(year, month, day);
          const key = dayKey(cellDate);
          const mealDayName = weekMealMap.get(key);
          const meal = mealDayName ? meals.find(m => m.day === mealDayName) : undefined;
          const dayReminders = reminderMap.get(key) ?? [];
          const isToday = dayKey(today) === key;

          return (
            <button
              key={idx}
              onClick={() => meal && onMealTap(meal.day)}
              disabled={!meal}
              className={`aspect-square rounded-lg p-1 text-left flex flex-col border transition ${
                meal
                  ? 'bg-white border-gray-100 hover:border-green-300 active:bg-green-50'
                  : 'bg-gray-50 border-transparent cursor-default'
              } ${isToday ? 'ring-2 ring-green-500' : ''}`}
            >
              <span
                className={`text-[11px] font-semibold ${
                  isToday ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {day}
              </span>

              {meal && (
                <div className="flex-1 overflow-hidden mt-0.5">
                  <p className="text-[10px] leading-tight text-gray-900 line-clamp-2 font-medium">
                    {meal.meal}
                  </p>
                  <p className="text-[9px] text-gray-400 line-clamp-1 mt-0.5">
                    {meal.protein}
                  </p>
                </div>
              )}

              {dayReminders.length > 0 && (
                <div className="flex gap-0.5 mt-auto flex-wrap">
                  {dayReminders.slice(0, 2).map((r, i) => (
                    <span key={i} className="text-[9px]" title={r.text}>
                      {r.icon ?? '🔔'}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
