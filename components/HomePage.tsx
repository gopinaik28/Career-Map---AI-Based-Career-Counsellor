// components/HomePage.tsx
import React from 'react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    // This div now defines the specific background for the homepage content area
    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800/70 dark:via-gray-850/70 dark:to-gray-900/70 text-gray-800 dark:text-gray-200 rounded-lg">
      {/* Max width set here to control content width within the wider app card */}
      <div className="w-full max-w-5xl mx-auto"> 
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 mt-8">
          Discover Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">Future Path</span>
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          Discover tailored career insights, specific roadmaps, and personalized plans based on your unique background, skills, and interests.
        </p>
        
        <button
          onClick={onGetStarted}
          className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xl rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-600"
          aria-label="Take your first step with the career advisor"
        >
          Take Your First Step
        </button>

        <p className="text-md sm:text-lg mt-12 mb-8 text-gray-600 dark:text-gray-300">
          Let's chart your course to a fulfilling career. Tell us about yourself, and your advisor will help you navigate the possibilities.
        </p>
      </div>
    </div>
  );
};

export default HomePage;