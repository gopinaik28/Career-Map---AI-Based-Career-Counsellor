// components/Header.tsx
import React from 'react';
import type { AppState } from '../types';

interface HeaderProps {
  appName: string;
  currentStep: AppState;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onNavigateHome: () => void;
  onNavigateToSavedPlans: () => void;
  hasSavedSessions: boolean;
}

const getStepName = (step: AppState): string => {
  switch (step) {
    case 'HOME':               return ''; 
    case 'BACKGROUND_INPUT':   return 'Your Background';
    case 'SKILLS_SELECTION':   return 'Select Skills';
    case 'INTERESTS_SELECTION':return 'Select Interests';
    case 'LOADING':            return 'Analyzing Profile...';
    case 'TIMETABLE_LOADING':  return 'Generating Timetable...';
    case 'RESULTS':            return 'Career Insights';
    case 'JOB_DETAIL_VIEW':    return 'Job Details & Plan';
    case 'SAVED_PLANS_VIEW':   return 'Your Saved Plans';
    case 'ERROR':              return 'Error Occurred';
    default:                   return '';
  }
};

const TOTAL_MAIN_STEPS = 4; // Background, Skills, Interests, Results/JobView
const getCurrentProgressStep = (appState: AppState): number => {
  switch (appState) {
    case 'HOME':                return 0;
    case 'BACKGROUND_INPUT':    return 1;
    case 'SKILLS_SELECTION':    return 2;
    case 'INTERESTS_SELECTION':
    case 'LOADING':             return 3; 
    case 'RESULTS':
    case 'JOB_DETAIL_VIEW':
    case 'TIMETABLE_LOADING':   return 4; 
    case 'SAVED_PLANS_VIEW':    return TOTAL_MAIN_STEPS; // Saved plans can be considered a final step or full progress
    case 'ERROR':               return 0; 
    default:                    return 0;
  }
};

const Header: React.FC<HeaderProps> = ({
  appName,
  currentStep,
  darkMode,
  toggleDarkMode,
  onNavigateHome,
  onNavigateToSavedPlans,
  hasSavedSessions,
}) => {
  const stepName   = getStepName(currentStep);
  const progressPct = (getCurrentProgressStep(currentStep) / TOTAL_MAIN_STEPS) * 100;

  const NsgSolutionsLogo = () => (
    <div className="flex items-center space-x-2">
      <span className="text-3xl font-extrabold">NSG</span>
      <span className="text-indigo-200 dark:text-indigo-300 opacity-90 font-semibold">
        {appName}
      </span>
    </div>
  );

  return (
    <header
      className="
        bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
        dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800
        text-white shadow-lg sticky top-0 z-50
      "
      style={{ backgroundSize: '300% 100%' }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Section: NSG Solutions Logo/App Name as Home Button */}
        {currentStep !== 'HOME' ? (
          <button
            onClick={onNavigateHome}
            aria-label="Back to Home"
            title="Back to Home"
            className="p-1 rounded-md hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            <NsgSolutionsLogo />
          </button>
        ) : (
          // Non-interactive version for HOME page
          <div className="p-1 cursor-default">
            <NsgSolutionsLogo />
          </div>
        )}
      
        {/* Center Section: Hero Text */}
        <div className="flex-1 text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold truncate">
            Welcome to Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Career Advisor
            </span>
          </h2>
        </div>

        {/* Right Section: Step Name, Saved Plans, Theme Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {stepName && ( 
            <span
              className={`hidden md:inline text-sm font-medium opacity-90 ${
                currentStep === 'ERROR'
                  ? 'text-red-300 dark:text-red-200'
                  : 'text-indigo-200 dark:text-indigo-300'
              }`}
            >
              {stepName}
            </span>
          )}
          <button
            onClick={onNavigateToSavedPlans}
            aria-label="View Saved Plans"
            title={hasSavedSessions ? "View Saved Plans" : "No Saved Plans Yet"}
            className={`p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors ${!hasSavedSessions ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!hasSavedSessions}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${hasSavedSessions ? 'text-indigo-200 dark:text-indigo-300' : 'text-gray-400 dark:text-gray-500'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" />
            </svg>
          </button>
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-300">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-200">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {(currentStep !== 'HOME') && ( // Show progress bar if not on HOME
        <div
          className={`w-full h-1.5 ${
            currentStep === 'ERROR'
              ? 'bg-red-300/50 dark:bg-red-700/50'
              : 'bg-indigo-300/30 dark:bg-indigo-900/40'
          }`}
        >
          <div
            className={`h-full transition-all duration-500 ease-out ${
              currentStep === 'ERROR'
                ? 'bg-red-500 dark:bg-red-400'
                : 'bg-gradient-to-r from-pink-400 to-purple-400 dark:from-pink-500 dark:to-purple-500'
            }`}
            style={{ width: `${progressPct}%` }} // Progress is 0% on HOME, so bar effectively hides
          />
        </div>
      )}
    </header>
  );
};

export default Header;