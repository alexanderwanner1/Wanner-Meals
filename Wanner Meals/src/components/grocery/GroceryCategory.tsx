import React from 'react';
import type { GroceryCategory as GroceryCategoryType } from '../../types';
import GroceryItem from './GroceryItem';

interface GroceryCategoryProps {
  category: GroceryCategoryType;
  checkedIds: Set<string>;
  onToggle: (id: string) => void;
}

export default function GroceryCategory({ category, checkedIds, onToggle }: GroceryCategoryProps) {
  const isEmpty = category.items.length === 0;

  // Unchecked items first, checked items at the bottom (D15)
  const unchecked = category.items.filter(i => !checkedIds.has(i.id));
  const checked = category.items.filter(i => checkedIds.has(i.id));
  const sortedItems = [...unchecked, ...checked];

  return (
    <div className={`rounded-2xl shadow-sm overflow-hidden mb-3 ${category.isPantry ? 'bg-amber-50' : 'bg-white'}`}>
      {/* Category header */}
      <div
        className={`px-4 py-3 flex items-center justify-between border-b ${
          category.isPantry ? 'border-amber-100' : 'border-gray-50'
        }`}
      >
        <div className="flex items-center gap-2">
          {category.isPantry && <span className="text-sm">🧂</span>}
          <h3
            className={`font-semibold text-sm ${
              category.isPantry ? 'text-amber-800' : 'text-gray-900'
            }`}
          >
            {category.name}
          </h3>
          {category.isPantry && (
            <span className="text-[10px] text-amber-600 font-medium">Check before shopping</span>
          )}
        </div>

        {/* Empty label (D11: show header, mark empty) */}
        {isEmpty && (
          <span className="text-xs text-gray-400 font-medium">Nothing needed</span>
        )}

        {/* Progress for non-empty categories */}
        {!isEmpty && (
          <span className="text-xs text-gray-400 font-medium">
            {checked.length}/{category.items.length}
          </span>
        )}
      </div>

      {/* Items */}
      {isEmpty ? (
        <div className="px-4 py-3 text-sm text-gray-400">—</div>
      ) : (
        <div className={`divide-y ${category.isPantry ? 'divide-amber-100' : 'divide-gray-50'}`}>
          {sortedItems.map(item => (
            <GroceryItem
              key={item.id}
              item={item}
              isChecked={checkedIds.has(item.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
