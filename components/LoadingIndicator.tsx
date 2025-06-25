// components/LoadingIndicator.tsx
import React from 'react';

interface LoadingIndicatorProps {
  loadingText?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loadingText = "Analyzing your profile..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-350px)] sm:min-h-[calc(100vh-400px)] p-6 sm:p-8 text-center bg-transparent text-gray-700 dark:text-gray-300 rounded-lg">
      
      {/* SVG Insight Weaver Animation */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-10">
        <svg className="w-full h-full" viewBox="-50 -50 300 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="weaverGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(129, 140, 248)' }} /> {/* Indigo */}
              <stop offset="100%" style={{ stopColor: 'rgb(168, 85, 247)' }} /> {/* Purple */}
            </linearGradient>
            <linearGradient id="weaverGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(168, 85, 247)' }} /> {/* Purple */}
              <stop offset="100%" style={{ stopColor: 'rgb(236, 72, 153)' }} /> {/* Pink */}
            </linearGradient>
             <linearGradient id="weaverGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(236, 72, 153)' }} /> {/* Pink */}
              <stop offset="100%" style={{ stopColor: 'rgb(99, 102, 241)' }} />   {/* Indigo-ish */}
            </linearGradient>
          </defs>
          
          {/* Central emanating point (optional subtle pulse) */}
          <circle cx="100" cy="100" r="3" fill="url(#weaverGradient1)" className="opacity-75 animate-pulse" />

          {/* Weaving Lines */}
          <path d="M100,100 C50,50 150,50 100,0" stroke="url(#weaverGradient1)" strokeWidth="2.5" fill="none" className="line-path animate-draw-line-1" />
          <path d="M100,100 C150,50 150,150 200,100" stroke="url(#weaverGradient2)" strokeWidth="2.5" fill="none" className="line-path animate-draw-line-2" />
          <path d="M100,100 C150,150 50,150 100,200" stroke="url(#weaverGradient3)" strokeWidth="2.5" fill="none" className="line-path animate-draw-line-3" />
          <path d="M100,100 C50,150 50,50 0,100" stroke="url(#weaverGradient1)" strokeWidth="2.5" fill="none" className="line-path animate-draw-line-4" />
          
          <path d="M100,100 Q125,25 150,50 T200,80" stroke="url(#weaverGradient2)" strokeWidth="2" fill="none" className="line-path animate-draw-line-5 opacity-80" />
          <path d="M100,100 Q25,125 50,150 T80,200" stroke="url(#weaverGradient3)" strokeWidth="2" fill="none" className="line-path animate-draw-line-6 opacity-80" />
          <path d="M100,100 Q175,75 150,150 T120,180" stroke="url(#weaverGradient1)" strokeWidth="2" fill="none" className="line-path animate-draw-line-7 opacity-80" />

        </svg>
      </div>
      
      <h2 className="text-3xl sm:text-4xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
        {loadingText}
      </h2>
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
        Your AI advisor is crafting your personalized insights.
      </p>
      <p className="text-md sm:text-lg text-gray-500 dark:text-gray-400 mt-1.5">
        This might take just a moment...
      </p>
    </div>
  );
};

export default LoadingIndicator;
