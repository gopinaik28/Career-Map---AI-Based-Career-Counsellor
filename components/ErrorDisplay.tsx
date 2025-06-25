// components/ErrorDisplay.tsx
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onStartOver: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry, onStartOver }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8 text-center bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 dark:text-red-400 mb-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <h2 className="text-3xl font-semibold mb-3">Oops! Something Went Wrong</h2>
      <p className="text-lg mb-8 max-w-md">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label="Retry the last action"
          >
            Try Again
          </button>
        )}
        <button
          onClick={onStartOver}
          className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Start over from the beginning"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;