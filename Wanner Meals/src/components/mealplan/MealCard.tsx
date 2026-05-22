import React, { useState } from 'react';
import type { Meal } from '../../types';
import { ProteinBadge, StyleBadge, InfoBadge } from '../ui/Badge';

interface MealCardProps {
  meal: Meal;
  defaultOpen?: boolean;
  onCookThis: (day: string) => void;
}

// Small info row inside expanded card
function NoteRow({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="flex gap-2.5 py-2 border-t border-gray-50">
      <span className="text-base leading-snug flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-700 mt-0.5 leading-snug">{text}</p>
      </div>
    </div>
  );
}

export default function MealCard({ meal, defaultOpen = false, onCookThis }: MealCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* ── Collapsed header (always visible) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 flex items-center gap-3 text-left"
        aria-expanded={isOpen}
      >
        {/* Day pill */}
        <div className="flex-shrink-0 w-10 text-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {meal.dayShort}
          </span>
        </div>

        {/* Meal info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug truncate">
            {meal.meal}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <ProteinBadge proteinType={meal.proteinType} label={meal.protein} />
            <StyleBadge label={meal.style} />
            <InfoBadge label={meal.cookTime} />
          </div>
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0 ml-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* ── Expanded details ── */}
      {isOpen && (
        <div className="accordion-enter border-t border-gray-50">
          {/* Short notes */}
          {meal.notes && (
            <div className="px-4 pt-3 pb-0">
              <p className="text-sm text-gray-600 leading-relaxed">{meal.notes}</p>
            </div>
          )}

          <div className="px-4 pb-1">
            <NoteRow icon="🥛" label="Dairy-free" text={meal.dairyFreeNote} />
            <NoteRow icon="👶" label="Toddler" text={meal.toddlerNote} />
            {meal.leftoverNote && (
              <NoteRow icon="📦" label="Leftovers" text={meal.leftoverNote} />
            )}
          </div>

          {/* Cook this button */}
          <div className="px-4 pb-4 pt-2">
            <button
              onClick={() => onCookThis(meal.day)}
              className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm tracking-wide hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              Cook this →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
