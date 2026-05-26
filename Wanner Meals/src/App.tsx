import React, { useState, useEffect, useMemo } from 'react';
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
import { loadFromStorage, saveToStorage, IMPORTED_WEEKS_KEY } from './utils/storage';
import { resolveActivePlan } from './utils/activePlan';

const ACTIVE_WEEK_KEY = 'wanner-meals-active-week';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  // Active week persisted so it sticks across reloads
  const [activeWeek, setActiveWeekRaw] = useState<number>(
    () => loadFromStorage<number>(ACTIVE_WEEK_KEY, 1)
  );
  const setActiveWeek = (id: number) => {
    setActiveWeekRaw(id);
    saveToStorage(ACTIVE_WEEK_KEY, id);
  };

  const [activeCookingDay, setActiveCookingDay] = useState<string>('Monday');

  const [cookingModal, setCookingModal] = useState<{ open: boolean; day: string }>({
    open: false,
    day: '',
  });

  const [importedWeeks, setImportedWeeks] = useState<ImportedWeek[]>(
    () => loadFromStorage<ImportedWeek[]>(IMPORTED_WEEKS_KEY, [])
  );

  useEffect(() => {
    saveToStorage(IMPORTED_WEEKS_KEY, importedWeeks);
  }, [importedWeeks]);

  // Compute the active plan from the selection + imports
  const activePlan = useMemo(
    () => resolveActivePlan(activeWeek, importedWeeks),
    [activeWeek, importedWeeks],
  );

  // Handlers
  const handleCookThis = (day: string) => setCookingModal({ open: true, day });
  const handleCalendarMealTap = (day: string) => {
    setActiveCookingDay(day);
    setActiveSection('cooking');
  };
  const handleImportSave = (week: ImportedWeek) => {
    setImportedWeeks(prev => {
      const exists = prev.find(w => w.id === week.id);
      if (exists) return prev.map(w => w.id === week.id ? week : w);
      return [...prev, week];
    });
  };
  const handleImportDelete = (id: string) => {
    setImportedWeeks(prev => prev.filter(w => w.id !== id));
    // If the deleted plan was active, fall back to Week 1
    if (Number(id) === activeWeek) setActiveWeek(1);
  };

  const modalRecipe = cookingModal.day
    ? activePlan.recipes.find(r => r.day === cookingModal.day)
    : undefined;
  const modalMeal = cookingModal.day
    ? activePlan.meals.find(m => m.day === cookingModal.day)
    : undefined;

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Header />
      <BottomNav activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="pb-24 md:pb-8">
        {activeSection === 'home' && (
          <Home
            activeWeek={activeWeek}
            setActiveWeek={setActiveWeek}
            importedWeeks={importedWeeks}
            activePlan={activePlan}
            onMealTap={handleCalendarMealTap}
          />
        )}

        {activeSection === 'meal-plan' && (
          <MealPlan activePlan={activePlan} onCookThis={handleCookThis} />
        )}

        {activeSection === 'grocery' && (
          // key= forces remount when active plan changes so checkbox state reloads
          <GroceryList key={activePlan.storageKey} activePlan={activePlan} />
        )}

        {activeSection === 'cooking' && (
          <Cooking
            activePlan={activePlan}
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
