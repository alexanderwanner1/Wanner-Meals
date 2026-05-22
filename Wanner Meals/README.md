# Wanner Meals

A family dinner planning app. 4 weeks of meals, dairy-free friendly, toddler approved, no seafood.

Built with **Vite + React + TypeScript + Tailwind CSS v3**.  
Deployed on **Cloudflare Pages**.

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

The output goes to `dist/`. Preview it locally with:

```bash
npm run preview
```

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Wanner Meals app"
git branch -M main
git remote add origin https://github.com/alexanderwanner1/Wanner-Meals.git
git push -u origin main
```

---

## Deploy to Cloudflare Pages

1. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com)
2. Click **Create a project** → **Connect to Git**
3. Select your `Wanner-Meals` GitHub repo
4. Use these build settings:
   - **Framework preset:** `None` (or Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**

Every time you push to `main`, Cloudflare will automatically rebuild and redeploy.

---

## Adding Week 2–4 data

1. Create `src/data/week2Meals.ts` and `src/data/week2Groceries.ts`
   (copy Week 1 files and edit the data)
2. In `src/data/weeks.ts`, set `available: true` for Week 2
3. In `src/pages/Home.tsx`, import Week 2 data and pass it to Calendar when `activeWeek === 2`
4. In `src/pages/MealPlan.tsx`, add a week toggle if needed
5. In `src/pages/GroceryList.tsx`, add Week 2 grocery trips

---

## Project structure

```
src/
  types/index.ts          — all TypeScript interfaces
  data/
    weeks.ts              — 4 week metadata (available flag)
    week1Meals.ts         — meals, recipes, calendar reminders
    week1Groceries.ts     — Monday + Thursday shopping lists
  utils/
    storage.ts            — localStorage wrapper (safe, never crashes)
    parser.ts             — imported plan text parser
  components/
    layout/
      Header.tsx          — sticky app header
      BottomNav.tsx       — mobile bottom nav + desktop top tabs
    ui/
      Badge.tsx           — protein / style / info pill badges
      Modal.tsx           — iOS-style bottom sheet modal
    home/
      Calendar.tsx        — monthly calendar with meal + reminder mapping
    mealplan/
      MealCard.tsx        — expandable meal plan card
    grocery/
      GroceryItem.tsx     — single item with big tap target
      GroceryCategory.tsx — category card with sorted items + progress
    cooking/
      TimelineStep.tsx    — single vertical timeline step
      DayRecipePage.tsx   — full recipe (ingredients + steps)
      PrepPage.tsx        — weekly ingredient list (7 collapsible days)
  pages/
    Home.tsx              — week selector + calendar
    MealPlan.tsx          — 7 meal cards
    GroceryList.tsx       — Monday / Thursday grocery tabs
    Cooking.tsx           — Prep + Mon–Sun recipe tabs
    ImportPlan.tsx        — paste + preview + save a plan
  App.tsx                 — root: state, routing, modal orchestration
  main.tsx                — ReactDOM entry point
  index.css               — Tailwind + global styles
```

---

## Family rules (hardcoded in data)

| Rule | Detail |
|------|--------|
| Friday | Always nacho night |
| Thursday | Swimming lesson → freezer meal only |
| No fish | No seafood of any kind |
| Dairy | Husband dairy-free → cheese / cream always on the side |
| Toddler | All meals toddler-friendly |
| Chicken breast | 2 breasts (not 4), scheduled after grocery trips |
| Nacho toppings | Bought fresh on Thursday |
