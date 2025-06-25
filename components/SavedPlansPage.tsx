
// components/SavedPlansPage.tsx
import React from 'react';
import type { SavedSession } from '../types';

interface SavedPlansPageProps {
  savedSessions: SavedSession[];
  onViewDetails: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onClearAll: () => void;
  onBack: () => void;
  currentUserName: string | null;
}

const SavedPlansPage: React.FC<SavedPlansPageProps> = ({
  savedSessions,
  onViewDetails,
  onDelete,
  onClearAll,
  onBack,
  currentUserName
}) => {
  const pageTitle = currentUserName ? `Saved Plans for ${currentUserName}` : "Your Saved Career Plans";

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800/70 dark:via-gray-850/70 dark:to-gray-900/70 min-h-full text-gray-800 dark:text-gray-200 rounded-lg">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center px-5 py-2.5 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transform hover:scale-105"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          {savedSessions.length > 0 && (
             <button
                onClick={onClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Delete all saved plans"
            >
                Clear All Plans
            </button>
          )}
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
          {pageTitle}
        </h2>

        {savedSessions.length === 0 ? (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
            </svg>
            <p className="text-xl text-gray-600 dark:text-gray-400">You have no saved career plans yet.</p>
            <p className="text-md text-gray-500 dark:text-gray-500 mt-2">
              Generate a plan and click the save button to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {savedSessions.sort((a,b) => b.timestamp - a.timestamp).map((session) => (
              <div key={session.id} className="bg-white dark:bg-gray-700/80 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{session.selectedJob.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Saved for: {session.userName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      On: {new Date(session.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-3 sm:mt-0 self-start sm:self-center">
                    <button
                      onClick={() => onViewDetails(session.id)}
                      className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition-colors"
                      aria-label={`View details for ${session.selectedJob.title} saved by ${session.userName}`}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onDelete(session.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition-colors"
                      aria-label={`Delete plan for ${session.selectedJob.title} saved by ${session.userName}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  <span className="font-medium">Plan Overview:</span> {session.generatedTimetable.introductoryNote || session.generatedTimetable.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlansPage;
