// components/SaveSessionButton.tsx
import React from 'react';

interface SaveSessionButtonProps {
  isVisible: boolean;
  onClick: () => void; // This is the handleSaveSession from App.tsx
  userName: string | null;
  onViewSavedPlans: () => void;
  hasSavedSessions: boolean;
}

const SaveSessionButton: React.FC<SaveSessionButtonProps> = ({ 
  isVisible, 
  onClick, 
  userName,
  onViewSavedPlans,
  hasSavedSessions
}) => {

  if (!isVisible) { // Overall visibility for the component group
    return null;
  }

  const mainButtonTitle = userName ? `Save Plan for ${userName}` : "Save Your Plan";
  const viewButtonTitle = userName ? `View Saved Plans for ${userName}` : "View Saved Plans";
  
  // Determine if the "View Saved Plans" button should be shown
  const showViewPlansActualButton = hasSavedSessions && !!userName;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3" 
    >
      {/* Save Plan Button (Download Icon) */}
      <button
        onClick={onClick} // Directly call the save function from App.tsx
        title={mainButtonTitle}
        aria-label={mainButtonTitle}
        className={`
          w-16 h-16 sm:w-20 sm:h-20
          rounded-full
          flex items-center justify-center
          bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600
          dark:from-indigo-600 dark:via-purple-700 dark:to-pink-700
          text-white
          shadow-2xl dark:shadow-glow-purple 
          transform transition-all duration-300 ease-in-out
          hover:scale-110 hover:-translate-y-1 hover:shadow-glow-indigo dark:hover:shadow-glow-indigo
          focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-pink-500 focus:ring-opacity-50
          animate-subtleGlow 
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7 sm:w-9 sm:h-9">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>

      {/* "View Saved Plans" Icon Button - shows if there are saved sessions */}
      {showViewPlansActualButton && (
        <button
          onClick={onViewSavedPlans}
          title={viewButtonTitle}
          aria-label={viewButtonTitle}
          className={`
            w-14 h-14 sm:w-16 sm:h-16
            rounded-full
            flex items-center justify-center
            bg-gradient-to-br from-teal-500 via-cyan-600 to-sky-600
            dark:from-teal-600 dark:via-cyan-700 dark:to-sky-700
            text-white
            shadow-xl dark:shadow-glow-purple 
            transform transition-all duration-300 ease-in-out
            hover:scale-110 hover:-translate-y-1 hover:shadow-glow-indigo dark:hover:shadow-glow-indigo
            focus:outline-none focus:ring-4 focus:ring-cyan-400 dark:focus:ring-sky-500 focus:ring-opacity-50
            animate-subtleGlow 
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SaveSessionButton;
