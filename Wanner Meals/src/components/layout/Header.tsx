import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Wanner Meals
        </h1>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">
          4 weeks&nbsp;·&nbsp;dairy-free friendly&nbsp;·&nbsp;toddler approved&nbsp;·&nbsp;no seafood
        </p>
      </div>
    </header>
  );
}
