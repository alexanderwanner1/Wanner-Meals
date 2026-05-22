// ============================================================
// WANNER MEALS — WEEK METADATA
//
// Add Weeks 2–4 data by:
// 1. Setting available: true
// 2. Creating week2Meals.ts, week2Groceries.ts files
// 3. Importing them in the relevant pages
// ============================================================

import type { Week } from '../types';

export const weeks: Week[] = [
  { id: 1, name: 'Week 1', available: true },
  { id: 2, name: 'Week 2', available: false },
  { id: 3, name: 'Week 3', available: false },
  { id: 4, name: 'Week 4', available: false },
];
