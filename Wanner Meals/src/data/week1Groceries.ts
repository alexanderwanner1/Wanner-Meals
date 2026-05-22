// ============================================================
// WANNER MEALS — WEEK 1 GROCERY LISTS
//
// Monday Shop covers: Mon pizza, Tue pasta, Wed curry
// Thursday Shop covers: Fri nachos, Sat flatbreads, Sun meatballs
//
// Thursday dinner (freezer soup) is NOT included here.
//
// Each item has a stable ID used as the localStorage key.
// Format: w1-{trip}-{category-abbrev}-{index}
// ============================================================

import type { GroceryTrip } from '../types';

export const week1MondayTrip: GroceryTrip = {
  label: 'Monday Shop',
  description: 'Covers Mon – Thu · Buy fresh ingredients for the first half of the week',
  key: 'monday-shop',
  categories: [
    {
      name: 'Produce',
      items: [
        { id: 'w1-mon-pro-0', name: '1 zucchini' },
        { id: 'w1-mon-pro-1', name: '1 small yellow onion' },
        { id: 'w1-mon-pro-2', name: '1 garlic bulb' },
        { id: 'w1-mon-pro-3', name: '2 cups spinach' },
      ],
    },
    {
      name: 'Protein & Meat',
      items: [
        { id: 'w1-mon-prt-0', name: '450 g ground beef' },
        { id: 'w1-mon-prt-1', name: '1 block firm tofu' },
      ],
    },
    {
      name: 'Dairy & Dairy-Free',
      items: [
        { id: 'w1-mon-dai-0', name: 'Optional: parmesan, served on the side' },
        { id: 'w1-mon-dai-1', name: 'Optional: dairy-free parmesan' },
      ],
    },
    {
      name: 'Pantry & Dry Goods',
      items: [
        { id: 'w1-mon-pan-0', name: '340 g pasta shells, rotini, or penne' },
        { id: 'w1-mon-pan-1', name: '1 jar marinara sauce (about 650 ml)' },
        { id: 'w1-mon-pan-2', name: '1 can diced tomatoes' },
        { id: 'w1-mon-pan-3', name: '1 can coconut milk' },
        { id: 'w1-mon-pan-4', name: '1 can chickpeas' },
        { id: 'w1-mon-pan-5', name: '4–6 dairy-free naan or pita breads' },
        { id: 'w1-mon-pan-6', name: 'Tomato paste' },
        { id: 'w1-mon-pan-7', name: 'Beef broth (or use water)' },
      ],
    },
    {
      name: 'Frozen',
      items: [
        { id: 'w1-mon-frz-0', name: '1 frozen pizza (for Monday)' },
        { id: 'w1-mon-frz-1', name: 'Soup from downstairs freezer — do NOT buy unless freezer is empty' },
      ],
    },
    {
      name: 'Other',
      items: [], // Empty — header shown with "Nothing needed" (D11)
    },
    {
      name: 'Check Your Pantry',
      isPantry: true,
      items: [
        { id: 'w1-mon-chk-0', name: 'Oil' },
        { id: 'w1-mon-chk-1', name: 'Salt' },
        { id: 'w1-mon-chk-2', name: 'Pepper' },
        { id: 'w1-mon-chk-3', name: 'Mild curry powder' },
        { id: 'w1-mon-chk-4', name: 'Turmeric' },
        { id: 'w1-mon-chk-5', name: 'Cumin' },
        { id: 'w1-mon-chk-6', name: 'Italian seasoning' },
        { id: 'w1-mon-chk-7', name: 'Chili flakes or hot sauce (for adults)' },
      ],
    },
  ],
};

export const week1ThursdayTrip: GroceryTrip = {
  label: 'Thursday Shop',
  description: 'Covers Fri – Sun · Buy fresh nacho toppings and weekend ingredients',
  key: 'thursday-shop',
  categories: [
    {
      name: 'Produce',
      items: [
        { id: 'w1-thu-pro-0', name: '2 bell peppers' },
        { id: 'w1-thu-pro-1', name: '2 carrots' },
        { id: 'w1-thu-pro-2', name: '2 cups broccoli florets' },
        { id: 'w1-thu-pro-3', name: '1 red onion' },
        { id: 'w1-thu-pro-4', name: '1 large sweet potato' },
        { id: 'w1-thu-pro-5', name: '1 avocado' },
        { id: 'w1-thu-pro-6', name: '2 cups spinach' },
        { id: 'w1-thu-pro-7', name: '1 lime (optional)' },
        { id: 'w1-thu-pro-8', name: 'Cilantro (optional)' },
        { id: 'w1-thu-pro-9', name: 'Green onions (optional nacho topping)' },
      ],
    },
    {
      name: 'Protein & Meat',
      items: [
        { id: 'w1-thu-prt-0', name: '1 rotisserie chicken' },
        { id: 'w1-thu-prt-1', name: '450 g ground turkey' },
        { id: 'w1-thu-prt-2', name: '1 egg' },
      ],
    },
    {
      name: 'Dairy & Dairy-Free',
      items: [
        { id: 'w1-thu-dai-0', name: 'Optional: shredded cheese, served on the side' },
        { id: 'w1-thu-dai-1', name: 'Optional: dairy-free shredded cheese' },
        { id: 'w1-thu-dai-2', name: 'Optional: sour cream, served on the side' },
        { id: 'w1-thu-dai-3', name: 'Optional: dairy-free sour cream' },
        { id: 'w1-thu-dai-4', name: 'Dairy-free mayo' },
        { id: 'w1-thu-dai-5', name: 'Optional: dairy-free ranch' },
      ],
    },
    {
      name: 'Pantry & Dry Goods',
      items: [
        { id: 'w1-thu-pan-0', name: '1 large bag tortilla chips' },
        { id: 'w1-thu-pan-1', name: '1 can black beans' },
        { id: 'w1-thu-pan-2', name: '4 flatbreads or pizza-style naan bases' },
        { id: 'w1-thu-pan-3', name: '½ cup BBQ sauce' },
        { id: 'w1-thu-pan-4', name: '½ cup salsa' },
        { id: 'w1-thu-pan-5', name: '½ cup breadcrumbs' },
        { id: 'w1-thu-pan-6', name: 'Dijon mustard' },
      ],
    },
    {
      name: 'Frozen',
      items: [
        { id: 'w1-thu-frz-0', name: '1 cup corn' },
      ],
    },
    {
      name: 'Other',
      items: [
        { id: 'w1-thu-oth-0', name: 'Parchment paper or foil' },
      ],
    },
    {
      name: 'Check Your Pantry',
      isPantry: true,
      items: [
        { id: 'w1-thu-chk-0', name: 'Oil' },
        { id: 'w1-thu-chk-1', name: 'Salt' },
        { id: 'w1-thu-chk-2', name: 'Pepper' },
        { id: 'w1-thu-chk-3', name: 'Mild chili powder' },
        { id: 'w1-thu-chk-4', name: 'Cumin' },
        { id: 'w1-thu-chk-5', name: 'Italian seasoning' },
        { id: 'w1-thu-chk-6', name: 'Honey' },
        { id: 'w1-thu-chk-7', name: 'Vinegar or lemon juice' },
        { id: 'w1-thu-chk-8', name: 'Pickled jalapeños (for adults)' },
        { id: 'w1-thu-chk-9', name: 'Hot sauce (for adults)' },
      ],
    },
  ],
};
