import React from 'react';
import type { ProteinType } from '../../types';

// ── Protein badge colours ──────────────────────────────────
const proteinColours: Record<ProteinType, string> = {
  pizza:      'bg-purple-100 text-purple-700',
  beef:       'bg-red-100 text-red-700',
  vegetarian: 'bg-emerald-100 text-emerald-700',
  freezer:    'bg-slate-100 text-slate-600',
  chicken:    'bg-amber-100 text-amber-700',
  turkey:     'bg-orange-100 text-orange-700',
};

// ── Protein Badge ──────────────────────────────────────────
interface ProteinBadgeProps {
  proteinType: ProteinType;
  label: string;
}

export function ProteinBadge({ proteinType, label }: ProteinBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${proteinColours[proteinType]}`}
    >
      {label}
    </span>
  );
}

// ── Style Badge ────────────────────────────────────────────
interface StyleBadgeProps {
  label: string;
}

export function StyleBadge({ label }: StyleBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
      {label}
    </span>
  );
}

// ── Info Badge (time, notes) ───────────────────────────────
interface InfoBadgeProps {
  label: string;
}

export function InfoBadge({ label }: InfoBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
      {label}
    </span>
  );
}
