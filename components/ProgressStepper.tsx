// components/ProgressStepper.tsx
import React from 'react';
import type { AppState } from '../types';

interface ProgressStepperProps {
  currentAppState: AppState;
}

interface ProgressStep {
  id: string;
  name: string;
  appStates: AppState[];
}

const STEPS: ProgressStep[] = [
  { id: 'qualifications', name: 'Qualifications', appStates: ['BACKGROUND_INPUT'] },
  { id: 'skills', name: 'Skills', appStates: ['SKILLS_SELECTION'] },
  { id: 'interests', name: 'Interests', appStates: ['INTERESTS_SELECTION'] },
  { id: 'results', name: 'Results', appStates: ['LOADING', 'RESULTS', 'JOB_DETAIL_VIEW', 'TIMETABLE_LOADING'] },
];

const getStepStatus = (stepAppStates: AppState[], currentAppState: AppState, currentStepIndex: number, activeStepIndex: number) => {
  if (stepAppStates.includes(currentAppState)) {
    return 'active';
  }
  if (currentStepIndex < activeStepIndex) {
    return 'completed';
  }
  return 'pending';
};

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentAppState }) => {
  const activeStepIndex = STEPS.findIndex(step => step.appStates.includes(currentAppState));

  // If currentAppState is HOME or ERROR, we might not want to show the stepper,
  // or show it in a default state. For now, let's assume it's only shown on relevant pages.
  if (activeStepIndex === -1 && currentAppState !== 'HOME' && currentAppState !== 'ERROR') {
      // Potentially handle cases where appState is valid for stepper but not directly in a step (e.g., initial loading for results)
      // For now, if activeStepIndex is -1, it means we are likely past the main input steps or in an error state.
      // If we are 'LOADING' for results, we mark 'Results' as active.
      if (STEPS[STEPS.length -1].appStates.includes(currentAppState)) {
        // This ensures 'Results' is active if we are in LOADING, RESULTS, etc.
      } else {
        return null; // Don't render stepper if the state isn't explicitly tied to a step
      }
  }


  return (
    <div className="w-full py-4 sm:py-6 px-4 mb-4 sm:mb-6 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-b-lg shadow-md">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center justify-center">
          {STEPS.map((step, stepIdx) => {
            // Recalculate effectiveActiveStepIndex inside map to ensure it's fresh for each step.
            // This is particularly important if activeStepIndex itself is -1 but currentAppState matches the last step's appStates.
            let effectiveActiveStepIndex = activeStepIndex;
            if (activeStepIndex === -1 && STEPS[STEPS.length - 1].appStates.includes(currentAppState)) {
                effectiveActiveStepIndex = STEPS.length - 1;
            }
            const status = getStepStatus(step.appStates, currentAppState, stepIdx, effectiveActiveStepIndex);


            return (
              <li key={step.name} className={`relative ${stepIdx !== STEPS.length - 1 ? 'flex-1' : ''}`}>
                <div className="flex items-center text-sm font-medium">
                  {/* Connector Line */}
                  {stepIdx > 0 && (
                    <div className={`absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 w-full h-1 
                                     ${stepIdx <= effectiveActiveStepIndex ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                     style={{ zIndex: -1, right: '50%' }}>
                    </div>
                  )}

                  {/* Step Circle/Icon and Text */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`
                        flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full
                        transition-all duration-300 ease-in-out transform
                        ${status === 'active' ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white scale-110 shadow-lg ring-2 ring-white dark:ring-gray-900' : ''}
                        ${status === 'completed' ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md' : ''}
                        ${status === 'pending' ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : ''}
                      `}
                      aria-current={status === 'active' ? 'step' : undefined}
                    >
                      {status === 'completed' ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs sm:text-sm">{stepIdx + 1}</span>
                      )}
                    </span>
                    <span
                      className={`
                        mt-2 text-xs sm:text-sm text-center px-1
                        ${status === 'active' ? 'text-indigo-700 dark:text-indigo-300 font-semibold' : ''}
                        ${status === 'completed' ? 'text-green-700 dark:text-green-400' : ''}
                        ${status === 'pending' ? 'text-gray-500 dark:text-gray-400' : ''}
                      `}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Right-side connector part for flex layout (only for non-last items) */}
                   {stepIdx < STEPS.length - 1 && stepIdx !== STEPS.length -1 && (
                     <div className={`h-1 flex-grow transition-colors duration-300
                                     ${stepIdx < effectiveActiveStepIndex ? 'bg-gradient-to-r from-teal-500 to-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    </div>
                  )}
                </div>
                {/* Step of text */}
                {status === 'active' && (
                    <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-2 absolute w-full left-0 whitespace-nowrap">
                        Step {stepIdx + 1} of {STEPS.length}: {step.name}
                    </p>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default ProgressStepper;