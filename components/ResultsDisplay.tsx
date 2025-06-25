// components/ResultsDisplay.tsx
import React, { useState, useMemo } from 'react';
import type { CareerAdvisorResponse, JobRole } from '../types';

interface ResultsDisplayProps {
  results: CareerAdvisorResponse;
  onStartOver: () => void;
  onViewJobDetails: (job: JobRole) => void;
}

type PayBracketFilter = JobRole['estimatedPayBracket'] | 'Any';
type DemandFilter = JobRole['marketDemand'] | 'Any';
type EffortFilter = JobRole['learningEffort'] | 'Any';


const JobRoleCard: React.FC<{ role: JobRole, onViewDetails: (job: JobRole) => void }> = ({ role, onViewDetails }) => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg 
                 hover:shadow-2xl hover:scale-[1.02] dark:hover:shadow-purple-600/40 
                 transition-all duration-300 ease-in-out 
                 flex flex-col justify-between">
    <div>
      <h3 className="text-xl sm:text-2xl font-semibold text-indigo-700 dark:text-indigo-400 mb-2">{role.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4">{role.description}</p>
      
      <div className="text-xs space-y-1 mb-3">
        {role.estimatedPayBracket && <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">Pay:</span> {role.estimatedPayBracket}</p>}
        {role.marketDemand && <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">Demand:</span> {role.marketDemand}</p>}
        {role.learningEffort && <p className="text-gray-600 dark:text-gray-300"><span className="font-semibold">Effort:</span> {role.learningEffort}</p>}
      </div>
       {role.relevanceScore && (
        <p className="text-xs text-indigo-500 dark:text-indigo-300 mt-1 mb-3">Relevance: {Math.round(role.relevanceScore * 100)}%</p>
      )}
    </div>
    <button
      onClick={() => onViewDetails(role)}
      className="mt-auto w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-700 hover:scale-105 transform"
      aria-label={`View details and roadmap for ${role.title}`}
    >
      View Details & Plan
    </button>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onStartOver, onViewJobDetails }) => {
  const { suggestedRoles, keyConsiderations, generalAdvice } = results;

  const [payFilter, setPayFilter] = useState<PayBracketFilter>('Any');
  const [demandFilter, setDemandFilter] = useState<DemandFilter>('Any');
  const [effortFilter, setEffortFilter] = useState<EffortFilter>('Any');

  const payOptions: PayBracketFilter[] = ['Any', 'High', 'Above Average', 'Average', 'Entry-Level', 'Varies Widely'];
  const demandOptions: DemandFilter[] = ['Any', 'Very High', 'High', 'Medium', 'Stable', 'Niche'];
  const effortOptions: EffortFilter[] = ['Any', 'Low', 'Medium', 'High', 'Intensive'];


  const filteredRoles = useMemo(() => {
    if (!suggestedRoles) return [];
    return suggestedRoles.filter(role => {
      const payMatch = payFilter === 'Any' || role.estimatedPayBracket === payFilter;
      const demandMatch = demandFilter === 'Any' || role.marketDemand === demandFilter;
      const effortMatch = effortFilter === 'Any' || role.learningEffort === effortFilter;
      return payMatch && demandMatch && effortMatch;
    });
  }, [suggestedRoles, payFilter, demandFilter, effortFilter]);

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800/70 dark:via-gray-850/70 dark:to-gray-900/70 min-h-full text-gray-800 dark:text-gray-200 rounded-lg">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
          Your Personalized Career Insights
        </h2>

        {suggestedRoles && suggestedRoles.length > 0 && (
          <section className="mb-10 p-4 sm:p-6 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl shadow-lg">
            <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Filter Job Roles:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="payFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pay Level</label>
                <select id="payFilter" value={payFilter} onChange={e => setPayFilter(e.target.value as PayBracketFilter)} className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white">
                  {payOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="demandFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market Demand</label>
                <select id="demandFilter" value={demandFilter} onChange={e => setDemandFilter(e.target.value as DemandFilter)} className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white">
                  {demandOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="effortFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Learning Effort</label>
                <select id="effortFilter" value={effortFilter} onChange={e => setEffortFilter(e.target.value as EffortFilter)} className="w-full p-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white">
                  {effortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
             {filteredRoles.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">No job roles match your current filter selection. Try adjusting the filters.</p>
            )}
          </section>
        )}


        {filteredRoles.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Suggested Career Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map((role, index) => (
                <JobRoleCard key={index} role={role} onViewDetails={onViewJobDetails} />
              ))}
            </div>
          </section>
        )}
        
        {(keyConsiderations || generalAdvice) && (
          <section className="mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">General Advice & Considerations</h3>
            <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4">
              {keyConsiderations && (
                <div>
                  <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Key Considerations:</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">{keyConsiderations}</p>
                </div>
              )}
              {generalAdvice && (
                <div>
                  <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-1">General Advice:</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">{generalAdvice}</p>
                </div>
              )}
            </div>
          </section>
        )}


        {!suggestedRoles?.length && !keyConsiderations && !generalAdvice && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The AI advisor couldn't generate specific advice with the provided information. Try refining your selections or starting over.
            </p>
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={onStartOver}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-600"
            aria-label="Start over with new selections"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;