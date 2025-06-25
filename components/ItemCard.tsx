// components/ItemCard.tsx
import React from 'react';

interface ItemCardProps {
  id: string;
  name: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  category?: string; // Optional: for styling or display
}

const ItemCard: React.FC<ItemCardProps> = ({ id, name, isSelected, onToggle, category }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      aria-pressed={isSelected}
      className={`
        relative /* Make parent relative for absolute positioning of tick */
        p-3 w-full min-h-[6rem] sm:min-h-[7rem] text-center rounded-lg shadow-md 
        transition-all duration-300 ease-in-out
        flex flex-col items-center justify-center 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        dark:focus:ring-offset-gray-900 
        hover:scale-105 hover:shadow-xl dark:hover:shadow-indigo-500/40
        ${isSelected
          ? 'bg-indigo-600 text-white dark:bg-indigo-500 ring-1 ring-indigo-700 dark:ring-indigo-400 scale-102 animate-heartbeat' // Added animate-heartbeat
          : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
        }
      `}
    >
      {isSelected && (
        <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 bg-green-500 text-white rounded-full p-0.5 sm:p-1 shadow-lg z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      <h3 className="font-medium text-xs sm:text-sm break-words px-1">{name}</h3>
      {/* Optional: display category or other info here */}
      {/* {category && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category}</p>} */}
    </button>
  );
};

export default ItemCard;