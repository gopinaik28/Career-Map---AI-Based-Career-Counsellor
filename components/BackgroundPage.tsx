// components/BackgroundPage.tsx
import React, { useState } from 'react';
import type { HighestQualificationOption } from '../types'; // Use Option type for dropdown
import ProgressStepper from './ProgressStepper'; // Import the new component

interface BackgroundPageProps {
  initialHighestQualification: string; // Now a string
  initialFieldOfStudy: string;
  initialEducationJourneyNotes: string;
  initialExperience: string;
  initialFullName: string; 
  onSubmit: (
    fullName: string, 
    highestQualification: string, // Now a string
    fieldOfStudy: string,
    educationJourneyNotes: string,
    experience: string
  ) => void;
  onBack: () => void;
}

const qualificationOptions: HighestQualificationOption[] = [
  "",
  "High School Diploma/GED",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate (Ph.D., Ed.D., etc.)",
  "Professional Degree (MD, JD, DDS)",
  "Vocational/Technical Certificate",
  "Some College, No Degree",
  "Currently Studying",
  "Self-Taught/Online Courses",
  "Other"
];

const BackgroundPage: React.FC<BackgroundPageProps> = ({
  initialHighestQualification,
  initialFieldOfStudy,
  initialEducationJourneyNotes,
  initialExperience,
  initialFullName, 
  onSubmit,
  onBack,
}) => {
  const [fullName, setFullName] = useState(initialFullName); 
  const [highestQualificationSelection, setHighestQualificationSelection] = useState<HighestQualificationOption>(
    qualificationOptions.includes(initialHighestQualification as HighestQualificationOption) ? initialHighestQualification as HighestQualificationOption : (initialHighestQualification ? "Other" : "")
  );
  const [otherQualificationText, setOtherQualificationText] = useState(
    qualificationOptions.includes(initialHighestQualification as HighestQualificationOption) || !initialHighestQualification ? "" : initialHighestQualification
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(initialFieldOfStudy);
  const [educationJourneyNotes, setEducationJourneyNotes] = useState(initialEducationJourneyNotes);
  const [experience, setExperience] = useState(initialExperience);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQualification = highestQualificationSelection === 'Other' ? otherQualificationText.trim() : highestQualificationSelection;
    if (fullName.trim() && finalQualification && fieldOfStudy.trim()) { 
        if (highestQualificationSelection === 'Other' && !otherQualificationText.trim()){
            alert('Please specify your qualification if "Other" is selected.');
            return;
        }
        onSubmit(fullName.trim(), finalQualification, fieldOfStudy.trim(), educationJourneyNotes.trim(), experience.trim());
    } else {
        let missingFields = [];
        if (!fullName.trim()) missingFields.push("Full Name");
        if (!finalQualification || (highestQualificationSelection === 'Other' && !otherQualificationText.trim())) missingFields.push("Highest Education Level");
        if (!fieldOfStudy.trim()) missingFields.push("Field of Study");
        alert(`Please fill in the required fields: ${missingFields.join(', ')}.`);
    }
  };

  const isFormValid = fullName.trim() && 
                      (highestQualificationSelection !== '' && (highestQualificationSelection !== 'Other' || otherQualificationText.trim() !== '')) && 
                      fieldOfStudy.trim();

  return (
    <div className="flex flex-col h-full"> {/* Ensure page takes full height of its container */}
      <ProgressStepper currentAppState="BACKGROUND_INPUT" />
      {/* Scrollable content area */}
      <div className="flex-grow overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-start text-gray-800 dark:text-gray-200 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800/70 dark:via-gray-850/70 dark:to-gray-900/70">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 pt-2 pb-2 sm:pb-4">
            Your Academic Background
          </h2>

          <div>
            <label htmlFor="fullName" className="block text-lg sm:text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 text-base"
              placeholder="Enter your full name"
              aria-label="Full Name"
              required
            />
          </div>

          <div>
            <label htmlFor="highestQualification" className="block text-lg sm:text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Highest Education Level <span className="text-red-500">*</span>
            </label>
            <select
              id="highestQualification"
              value={highestQualificationSelection}
              onChange={(e) => {
                setHighestQualificationSelection(e.target.value as HighestQualificationOption);
                if (e.target.value !== 'Other') {
                  setOtherQualificationText(''); // Clear "Other" text if a different option is selected
                }
              }}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 focus:border-indigo-500 text-base"
              required
              aria-label="Highest Educational Qualification"
            >
              {qualificationOptions.map(option => (
                <option key={option} value={option}>{option || "Select your education level"}</option>
              ))}
            </select>
            {highestQualificationSelection === 'Other' && (
              <div className="mt-3">
                <label htmlFor="otherQualificationText" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Please specify your qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="otherQualificationText"
                  value={otherQualificationText}
                  onChange={(e) => setOtherQualificationText(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 text-base"
                  placeholder="Your specific qualification"
                  required={highestQualificationSelection === 'Other'}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="fieldOfStudy" className="block text-lg sm:text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Field of Study (if applicable) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fieldOfStudy"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 text-base"
              placeholder="e.g., Computer Science, Business Administration"
              aria-label="Stream or Field of Study"
              required
            />
          </div>
          
          <div>
            <label htmlFor="educationJourneyNotes" className="block text-lg sm:text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Key Academic Achievements/Projects (optional)
            </label>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
              Briefly describe any significant academic achievements, projects, or theses.
            </p>
            <textarea
              id="educationJourneyNotes"
              value={educationJourneyNotes}
              onChange={(e) => setEducationJourneyNotes(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 text-base"
              placeholder="e.g., Dean's List, capstone project on renewable energy..."
              aria-label="Additional Educational Notes"
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-lg sm:text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Relevant Experience (Internships, Work) (optional)
            </label>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">
              Detail any internships or work roles, focusing on skills and responsibilities.
            </p>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 text-base"
              placeholder="e.g., Marketing Intern at XYZ Corp (managed social media)..."
              aria-label="Your Journey So Far including experience and projects"
            />
          </div>
        </form>
      </div>
      {/* Fixed Footer Buttons */}
      <div className="shrink-0 sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-300 dark:border-gray-600 shadow-top-lg z-20">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:scale-105"
              aria-label="Go back to Home"
            >
              Back to Home
            </button>
            <button
              type="submit" 
              onClick={handleSubmit} 
              className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:scale-105
              ${(!isFormValid)
                ? 'bg-gray-400 dark:bg-gray-500 cursor-not-allowed text-gray-700 dark:text-gray-400'
                : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white focus:ring-green-500'
              }`}
              disabled={!isFormValid}
              aria-label="Next: Select Skills"
            >
              Next: Select Skills
            </button>
          </div>
      </div>
    </div>
  );
};

export default BackgroundPage;
