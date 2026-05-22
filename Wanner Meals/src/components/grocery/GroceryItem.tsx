import React from 'react';
import type { GroceryItem as GroceryItemType } from '../../types';

interface GroceryItemProps {
  item: GroceryItemType;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export default function GroceryItem({ item, isChecked, onToggle }: GroceryItemProps) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors active:bg-gray-50 ${
        isChecked ? 'opacity-60' : ''
      }`}
      aria-pressed={isChecked}
    >
      {/* Custom check circle — large tap target, no tiny checkbox */}
      <div
        className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          isChecked
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 bg-white'
        }`}
        aria-hidden="true"
      >
        {isChecked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="white"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Item name */}
      <span
        className={`flex-1 text-base leading-snug ${
          isChecked ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      >
        {item.name}
      </span>
    </button>
  );
}
