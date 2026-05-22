import React from 'react';
import type { Section, NavItem } from '../../types';

const NAV_ITEMS: NavItem[] = [
  { id: 'home',      label: 'Home',    icon: '🏠' },
  { id: 'meal-plan', label: 'Meals',   icon: '🍽️' },
  { id: 'grocery',   label: 'Grocery', icon: '🛒' },
  { id: 'cooking',   label: 'Cook',    icon: '👨‍🍳' },
  { id: 'import',    label: 'Import',  icon: '📥' },
];

interface BottomNavProps {
  activeSection: Section;
  setActiveSection: (s: Section) => void;
}

export default function BottomNav({ activeSection, setActiveSection }: BottomNavProps) {
  return (
    <>
      {/* ── Mobile: fixed bottom nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-40 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-around items-center h-16 px-1">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl min-w-[56px] transition-all ${
                  isActive ? 'text-green-600' : 'text-gray-400 active:text-gray-600'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-[22px] leading-none">{item.icon}</span>
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    isActive ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
                {/* Active dot */}
                {isActive && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-green-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop: horizontal tab bar below header ── */}
      <div className="hidden md:block sticky top-[57px] z-30 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
