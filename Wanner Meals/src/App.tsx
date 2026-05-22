import React, { useState, useEffect } from 'react';
import type { Section, ImportedWeek } from './types';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import Modal from './components/ui/Modal';
import Home from './pages/Home';
import MealPlan from './pages/MealPlan';
import GroceryList from './pages/GroceryList';
import Cooking from './pages/Cooking';
import ImportPlan from './pages/ImportPlan';
import DayRecipePage from './components/cooking/DayRecipePage';
import { week1Meals, week1Recipes } from './data/week1Meals';
import { loadFromStorage, saveToStorage, IMPORTED_WEEKS_KEY } from './utils/storage';

export default function App() {
  // ── Navigation ──────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<Section>('home');

  // ── Week selector (Home page) ────────────────────────────
  const [activeWeek, setActiveWeek] = useState<number>(1);

  // ── Cooking section active day tab ───────────────────────
  const [activeCookingDay, setActiveCookingDay] = useState<string>('Monday');

  // ── "Cook this" modal (triggered from Meal Plan cards) ───
  const [cookingModal, setCookingModal] = useState<{ open: boolean; day: string }>({
    open: false,
    day: '',
  });

  // ── Imported weeks ───────────────────────────────────────
  const [importedWeeks, setImportedWeeks] = useState<ImportedWeek[]>(
    () => loadFromStorage<ImportedWeek[]>(IMPORTED_WEEKS_KEY, [])
  );

  // Persist imported weeks whenever they change
  useEffect(() => {
    saveToStorage(IMPORTED_WEEKS_KEY, importedWeeks);
  }, [importedWeeks]);

  // ── Handlers ─────────────────────────────────────────────

  // "Cook this" button on a Meal Plan card → opens modal (C10)
  const handleCookThis = (day: string) => {
    setCookingModal({ open: true, day });
  };

  // Tapping a meal on the calendar → switch to Cooking section (B8)
  const handleCalendarMealTap = (day: string) => {
    setActiveCookingDay(day);
    setActiveSection('cooking');
  };

  // Save imported week from ImportPlan page (F19)
  const handleImportSave = (week: ImportedWeek) => {
    setImportedWeeks(prev => {
      // Replace if same id already exists, otherwise append
      const exists = prev.find(w => w.id === week.id);
      if (exists) return prev.map(w => w.id === week.id ? week : w);
      return [...prev, week];
    });
  };

  // Delete a saved import
  const handleImportDelete = (id: string) => {
    setImportedWeeks(prev => prev.filter(w => w.id !== id));
  };

  // Resolve the modal's recipe and meal
  const modalRecipe = cookingModal.day
    ? week1Recipes.find(r => r.day === cookingModal.day)
    : undefined;
  const modalMeal = cookingModal.day
    ? week1Meals.find(m => m.day === cookingModal.day)
    : undefined;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* ── Header (always visible) ── */}
      <Header />

      {/* ── Desktop top nav sits below header (rendered inside BottomNav) ── */}
      <BottomNav activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* ── Main page content ── */}
      <main className="pb-24 md:pb-8">
        {activeSection === 'home' && (
          <Home
            activeWeek={activeWeek}
            setActiveWeek={setActiveWeek}
            importedWeeks={importedWeeks}
            onMealTap={handleCalendarMealTap}
          />
        )}

        {activeSection === 'meal-plan' && (
          <MealPlan onCookThis={handleCookThis} />
        )}

        {activeSection === 'grocery' && (
          <GroceryList />
        )}

        {activeSection === 'cooking' && (
          <Cooking
            activeDay={activeCookingDay}
            setActiveDay={setActiveCookingDay}
          />
        )}

        {activeSection === 'import' && (
          <ImportPlan
            importedWeeks={importedWeeks}
            onSave={handleImportSave}
            onDeleteImported={handleImportDelete}
          />
        )}
      </main>

      {/* ── "Cook this" modal (C10) ── */}
      <Modal
        open={cookingModal.open}
        onClose={() => setCookingModal({ open: false, day: '' })}
        title={modalMeal?.meal ?? ''}
      >
        {modalRecipe && modalMeal && (
          <DayRecipePage recipe={modalRecipe} meal={modalMeal} />
        )}
      </Modal>
    </div>
  );
}
