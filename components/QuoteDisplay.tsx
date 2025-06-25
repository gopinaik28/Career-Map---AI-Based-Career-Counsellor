// components/QuoteDisplay.tsx
import React from 'react';
import type { Quote } from '@/data/quotes';

interface QuoteDisplayProps {
  quote: Quote | null;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
  if (!quote) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 sm:mt-8 px-4">
      <div className="p-4 sm:p-6 border-l-4 border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-slate-700/70 rounded-md shadow-lg transition-all duration-500 ease-in-out animate-fadeInPage">
        <p className="italic text-md sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          "{quote.text}"
        </p>
        <p className="text-right text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2 sm:mt-3">
          - {quote.author}
        </p>
      </div>
    </div>
  );
};

export default QuoteDisplay;
