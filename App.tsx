// App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import BackgroundPage from '@/components/BackgroundPage';
import SelectionGridPage from '@/components/SelectionGridPage';
import LoadingIndicator from './components/LoadingIndicator';
import ResultsDisplay from './components/ResultsDisplay';
import JobDetailPage from './components/JobDetailPage';
import ErrorDisplay from './components/ErrorDisplay';
import SaveSessionButton from '@/components/SaveSessionButton';
import SavedPlansPage from '@/components/SavedPlansPage';
import Modal from '@/components/Modal'; 
import QuoteDisplay from '@/components/QuoteDisplay'; // Import the new component
import type { ModalType as CustomModalType } from '@/components/Modal'; 
import { generateCareerAdvice, generateTimetable } from './services/aiService'; 
import type { AppState, UserInput, SkillItem, InterestItem, CareerAdvisorResponse, JobRole, HighestQualificationOption, StructuredTimetable, SavedSession, UserDefinedKnowledgeItem } from './types';
import { SKILL_CATEGORIES } from '@/data/skills';
import { INTEREST_CATEGORIES } from '@/data/interests';
import { INSPIRATIONAL_QUOTES, Quote } from '@/data/quotes';
import { addUserDefinedItem, getUserDefinedItems } from './services/localStorageService';


interface ModalState {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  type: CustomModalType;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [previousAppStateForSavedPlans, setPreviousAppStateForSavedPlans] = useState<AppState | null>(null);
  const [userInput, setUserInput] = useState<UserInput>({
    fullName: '',
    highestQualification: '', // Will store actual string
    fieldOfStudy: '',
    educationJourneyNotes: '',
    experience: '',
    selectedSkills: [],
    selectedInterests: [],
  });
  const [results, setResults] = useState<CareerAdvisorResponse | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [generatedTimetable, setGeneratedTimetable] = useState<StructuredTimetable | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSavePlanButton, setShowSavePlanButton] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [allSkillsData, setAllSkillsData] = useState<SkillItem[]>(() => SKILL_CATEGORIES.flatMap(cat => cat.items));
  const [allInterestsData, setAllInterestsData] = useState<InterestItem[]>(() => INTEREST_CATEGORIES.flatMap(cat => cat.items));
  
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [isViewingSavedPlan, setIsViewingSavedPlan] = useState<boolean>(false);

  // State for streaming AI responses - kept for knowing when AI is working
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  // streamingRawResponse is no longer directly displayed to the user
  const [streamingRawResponse, setStreamingRawResponse] = useState<string>(""); 

  // State for inspirational quotes
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteIntervalId, setQuoteIntervalId] = useState<number | null>(null);


  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success', 
  });

  const showModal = (config: Omit<ModalState, 'isOpen'>) => {
    setModalState({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (appState === 'JOB_DETAIL_VIEW' && generatedTimetable && selectedJob && userInput.fullName && !isViewingSavedPlan) {
      setShowSavePlanButton(true);
    } else {
      setShowSavePlanButton(false);
    }
  }, [appState, generatedTimetable, selectedJob, userInput.fullName, isViewingSavedPlan]);

  useEffect(() => {
    loadSavedSessionsFromStorage();
  }, []);
  
  const loadSavedSessionsFromStorage = () => {
    const existingSessionsJSON = localStorage.getItem('careerAdvisorSessions');
    const existingSessions: SavedSession[] = existingSessionsJSON ? JSON.parse(existingSessionsJSON) : [];
    setSavedSessions(existingSessions);
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const resetApp = (navigateToHome = true) => {
    setUserInput({
      fullName: '',
      highestQualification: '',
      fieldOfStudy: '',
      educationJourneyNotes: '',
      experience: '',
      selectedSkills: [],
      selectedInterests: [],
    });
    setResults(null);
    setSelectedJob(null);
    setGeneratedTimetable(null);
    setError(null);
    setShowSavePlanButton(false);
    setIsViewingSavedPlan(false);
    setAllSkillsData(SKILL_CATEGORIES.flatMap(cat => cat.items));
    setAllInterestsData(INTEREST_CATEGORIES.flatMap(cat => cat.items));
    setPreviousAppStateForSavedPlans(null);
    setIsStreaming(false);
    setStreamingRawResponse(""); // Still reset internal accumulator
    setCurrentQuote(null);
    if (quoteIntervalId) clearInterval(quoteIntervalId);
    setQuoteIntervalId(null);
    if (navigateToHome) {
      setAppState('HOME');
    }
  };

  const handleGetStarted = () => {
    resetApp(false);
    setAppState('BACKGROUND_INPUT');
  };

  const handleBackgroundSubmit = (
    fullName: string,
    highestQualification: string,
    fieldOfStudy: string,
    educationJourneyNotes: string,
    experience: string
  ) => {
    setUserInput(prev => ({ ...prev, fullName, highestQualification, fieldOfStudy, educationJourneyNotes, experience }));
    setAppState('SKILLS_SELECTION');
    setIsViewingSavedPlan(false);
  };

  const handleToggleSkill = useCallback((skill: SkillItem) => {
    setUserInput(prev => {
      const isSelected = prev.selectedSkills.some(s => s.id === skill.id);
      return {
        ...prev,
        selectedSkills: isSelected
          ? prev.selectedSkills.filter(s => s.id !== skill.id)
          : [...prev.selectedSkills, skill],
      };
    });
  }, []);

  const handleToggleInterest = useCallback((interest: InterestItem) => {
    setUserInput(prev => {
      const isSelected = prev.selectedInterests.some(i => i.id === interest.id);
      return {
        ...prev,
        selectedInterests: isSelected
          ? prev.selectedInterests.filter(i => i.id !== interest.id)
          : [...prev.selectedInterests, interest],
      };
    });
  }, []);

  const handleCustomItemAdded = (name: string, type: 'skill' | 'interest') => {
    const newItem: UserDefinedKnowledgeItem = {
      id: `user_defined_${type}_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: name,
      type: type,
    };
    addUserDefinedItem(newItem);
    console.log(`Custom ${type} added to dynamic KB: ${name}`);
  };

  const getRelevantQuotes = useCallback((): Quote[] => {
    const userSkillCats = new Set(userInput.selectedSkills.map(s => s.category.toLowerCase()));
    const userInterestCats = new Set(userInput.selectedInterests.map(i => i.category.toLowerCase()));

    const keywordsFromCats = (categories: Set<string>): string[] => {
        const words = new Set<string>();
        categories.forEach(cat => cat.split(/\s|&|,|\(|\)/).forEach(part => {
            const cleanedPart = part.trim().replace(/[^a-z]/gi, ''); 
            if (cleanedPart.length > 2) words.add(cleanedPart);
        }));
        return Array.from(words);
    };

    const skillKeywords = keywordsFromCats(userSkillCats);
    const interestKeywords = keywordsFromCats(userInterestCats);
    const allUserKeywords = new Set([...skillKeywords, ...interestKeywords, 'general', 'career', 'learning', 'skills', 'passion', 'work', 'future', 'dreams']);


    if (userInput.selectedSkills.length === 0 && userInput.selectedInterests.length === 0) {
      return INSPIRATIONAL_QUOTES.filter(q => q.tags?.some(tag => ['general', 'career', 'dreams', 'potential', 'action'].includes(tag)));
    }

    const relevant = INSPIRATIONAL_QUOTES.filter(q =>
      q.tags?.some(tag => allUserKeywords.has(tag.toLowerCase()))
    );
    
    if (relevant.length < 5) {
        const generalAndDefault = INSPIRATIONAL_QUOTES.filter(q => q.tags?.some(tag => ['general', 'career', 'learning', 'dreams', 'action', 'perseverance'].includes(tag.toLowerCase())) || !q.tags || q.tags.length === 0);
        const combined = Array.from(new Set([...relevant, ...generalAndDefault])); 
        return combined.length > 0 ? combined.slice(0, 20) : INSPIRATIONAL_QUOTES.slice(0, 20); // Return a limited set if still too few
    }
    return relevant.length > 0 ? relevant : INSPIRATIONAL_QUOTES;
  }, [userInput.selectedSkills, userInput.selectedInterests]);

  useEffect(() => {
    if (isStreaming || appState === 'LOADING' || appState === 'TIMETABLE_LOADING') { // Show quotes during these states
      const relevantQuotes = getRelevantQuotes();
      if (relevantQuotes.length > 0) {
        setCurrentQuote(relevantQuotes[Math.floor(Math.random() * relevantQuotes.length)]);
      } else { // Fallback if no relevant quotes found (should be rare with new logic)
        setCurrentQuote(INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);
      }

      const id = setInterval(() => {
        const newRelevantQuotes = getRelevantQuotes();
        if (newRelevantQuotes.length > 0) {
            setCurrentQuote(newRelevantQuotes[Math.floor(Math.random() * newRelevantQuotes.length)]);
        } else {
             setCurrentQuote(INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);
        }
      }, 7000); 
      setQuoteIntervalId(id as unknown as number); // Cast to number for browser environment
    } else {
      if (quoteIntervalId) clearInterval(quoteIntervalId);
      setQuoteIntervalId(null);
      setCurrentQuote(null); 
    }
    return () => {
      if (quoteIntervalId) clearInterval(quoteIntervalId);
    };
  }, [isStreaming, appState, getRelevantQuotes]);


  const handleFetchCareerAdvice = async () => {
    if (userInput.selectedInterests.length === 0 && userInput.selectedSkills.length === 0) {
       showModal({
        type: 'warning',
        title: 'Selection Needed',
        message: "Please select at least one skill or interest to get the best advice.",
        confirmText: 'OK, I\'ll Select',
        showCancelButton: false,
      });
      setAppState(userInput.selectedSkills.length === 0 ? 'SKILLS_SELECTION' : 'INTERESTS_SELECTION');
      return;
    }
    setAppState('LOADING');
    setError(null);
    setIsStreaming(true); // AI processing starts
    setStreamingRawResponse(""); // Reset for internal accumulation
    try {
      // Pass a no-op for onChunk if we don't display raw stream,
      // but keep it for internal accumulation for final parsing.
      const advice = await generateCareerAdvice(userInput, (chunk, isDone) => {
        // Accumulate internally for parsing when done
        setStreamingRawResponse(prev => prev + chunk); 
        // We might not set isStreaming to false here if Llama 3's done is per-chunk
      });
      setResults(advice);
      setAppState('RESULTS');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching career advice.');
      setAppState('ERROR');
    } finally {
      setIsStreaming(false); // Ensure streaming is false after AI call finishes/fails
    }
  };

  const handleViewJobDetails = (job: JobRole) => {
    setSelectedJob(job);
    setGeneratedTimetable(null); 
    setStreamingRawResponse(""); 
    setAppState('JOB_DETAIL_VIEW');
    if (isViewingSavedPlan) {
        setIsViewingSavedPlan(false); 
    }
  };

  const handleGenerateTimetable = async (job: JobRole, timeframe: string) => {
    if (!job) {
      setError("No job selected for timetable generation.");
      setAppState('ERROR');
      return;
    }
    setAppState('TIMETABLE_LOADING'); // Use this for main LoadingIndicator + Quote
    // setAppState('JOB_DETAIL_VIEW'); // Keep current view, show quote below
    setError(null);
    setIsStreaming(true);
    setStreamingRawResponse("");
    try {
      const timetable = await generateTimetable(job.title, job.description, job.roadmap, timeframe, (chunk, isDone) => {
        setStreamingRawResponse(prev => prev + chunk);
      });
      setGeneratedTimetable(timetable);
      setAppState('JOB_DETAIL_VIEW'); 
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the timetable.');
      setAppState('ERROR');
    } finally {
      setIsStreaming(false);
       if (appState === 'TIMETABLE_LOADING') { // If it was TIMETABLE_LOADING, ensure it transitions
            setAppState('JOB_DETAIL_VIEW');
        }
    }
  };

  const handleSaveSession = () => {
    if (isViewingSavedPlan) {
        showModal({
            type: 'warning',
            title: 'Already Saved',
            message: 'This plan is already saved. To save new changes, please start a new plan by going back and modifying inputs.',
            confirmText: 'OK',
            showCancelButton: false,
        });
        return;
    }
    if (!userInput.fullName || !selectedJob || !generatedTimetable) {
      showModal({
            type: 'error',
            title: 'Save Error',
            message: 'Cannot save session. Missing name, selected job, or timetable.',
            confirmText: 'OK',
            showCancelButton: false,
      });
      return;
    }
    const newSession: SavedSession = {
      id: `session_${Date.now()}_${userInput.fullName.replace(/\s+/g, '_')}`,
      timestamp: Date.now(),
      userName: userInput.fullName,
      userInput: { ...userInput },
      selectedJob: { ...selectedJob },
      generatedTimetable: { ...generatedTimetable },
    };

    try {
      const existingSessions: SavedSession[] = [...savedSessions];
      existingSessions.push(newSession);
      localStorage.setItem('careerAdvisorSessions', JSON.stringify(existingSessions));
      setSavedSessions(existingSessions);
      showModal({
          type: 'success',
          title: 'Plan Saved!',
          message: `Your career plan for ${newSession.userName} has been successfully saved.`,
          confirmText: 'Great!',
          showCancelButton: false,
      });
    } catch (error) {
      console.error("Error saving session to localStorage:", error);
      showModal({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save session. LocalStorage might be full or disabled.',
        confirmText: 'OK',
        showCancelButton: false,
      });
    }
  };

  const handleNavigateToSavedPlans = () => {
    setPreviousAppStateForSavedPlans(appState); 
    loadSavedSessionsFromStorage(); 
    setAppState('SAVED_PLANS_VIEW');
  };

  const handleViewSavedPlanDetails = (sessionId: string) => {
    const sessionToView = savedSessions.find(s => s.id === sessionId);
    if (sessionToView) {
      setUserInput(sessionToView.userInput);
      setSelectedJob(sessionToView.selectedJob);
      setGeneratedTimetable(sessionToView.generatedTimetable);
      setAppState('JOB_DETAIL_VIEW');
      setIsViewingSavedPlan(true); 
      setShowSavePlanButton(false); 
      setStreamingRawResponse(""); 
    }
  };

  const handleDeleteSavedPlan = (sessionId: string) => {
    showModal({
        type: 'confirmation',
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this saved plan? This action cannot be undone.',
        confirmText: 'Yes, Delete',
        cancelText: 'No, Cancel',
        onConfirm: () => {
            const updatedSessions = savedSessions.filter(s => s.id !== sessionId);
            localStorage.setItem('careerAdvisorSessions', JSON.stringify(updatedSessions));
            setSavedSessions(updatedSessions);
            showModal({
                type: 'success',
                title: 'Plan Deleted',
                message: 'The selected plan has been deleted.',
                confirmText: 'OK',
                showCancelButton: false,
            });
        }
    });
  };
  
  const handleClearAllSavedPlans = () => {
    showModal({
        type: 'confirmation',
        title: 'Confirm Clear All',
        message: 'Are you sure you want to delete ALL saved plans? This action cannot be undone.',
        confirmText: 'Yes, Clear All',
        cancelText: 'No, Cancel',
        onConfirm: () => {
            localStorage.removeItem('careerAdvisorSessions');
            setSavedSessions([]);
            showModal({
                type: 'success',
                title: 'All Plans Cleared',
                message: 'All saved plans have been successfully deleted.',
                confirmText: 'OK',
                showCancelButton: false,
            });
        }
    });
  };


  const handleBackToResults = () => {
    setSelectedJob(null);
    setGeneratedTimetable(null);
    setAppState('RESULTS');
    setShowSavePlanButton(false);
    setIsViewingSavedPlan(false);
    setStreamingRawResponse("");
  };

  const handleBackToSkills = () => {
    setAppState('SKILLS_SELECTION');
    setShowSavePlanButton(false);
    setIsViewingSavedPlan(false);
  };
  
  const handleBackToSavedPlansListFromDetail = () => {
    setAppState('SAVED_PLANS_VIEW');
    setIsViewingSavedPlan(false);
    setStreamingRawResponse("");
  };

  const handleBackFromSavedPlansList = () => {
    const targetState = previousAppStateForSavedPlans;
    setPreviousAppStateForSavedPlans(null);
    setIsViewingSavedPlan(false);
    setStreamingRawResponse("");

    if (targetState) {
      setAppState(targetState);
    } else {
      if (results) {
        setAppState('RESULTS');
      } else {
        setAppState('HOME');
      }
    }
  };

  const renderContent = () => {
    switch (appState) {
      case 'HOME':
        return <HomePage onGetStarted={handleGetStarted} />;
      case 'BACKGROUND_INPUT':
        return (
          <BackgroundPage
            initialFullName={userInput.fullName}
            initialHighestQualification={userInput.highestQualification}
            initialFieldOfStudy={userInput.fieldOfStudy}
            initialEducationJourneyNotes={userInput.educationJourneyNotes}
            initialExperience={userInput.experience}
            onSubmit={handleBackgroundSubmit}
            onBack={() => { resetApp(); setAppState('HOME');}}
          />
        );
      case 'SKILLS_SELECTION':
        return (
          <SelectionGridPage
            title="Select Your Awesome Skills"
            subTitle="Select all that apply. Your choices help us tailor the best suggestions for you!"
            categories={SKILL_CATEGORIES}
            allItems={allSkillsData}
            setAllItems={setAllSkillsData as React.Dispatch<React.SetStateAction<SkillItem[] | InterestItem[]>>}
            selectedItems={userInput.selectedSkills}
            onToggleItem={handleToggleSkill as (item: SkillItem | InterestItem) => void}
            onNext={() => setAppState('INTERESTS_SELECTION')}
            onBack={() => setAppState('BACKGROUND_INPUT')}
            searchPlaceholder="Search skills... (e.g., Python, Writing, Music)"
            itemType="skill"
            currentAppState={appState}
            onCustomItemAdded={handleCustomItemAdded}
          />
        );
      case 'INTERESTS_SELECTION':
        return (
          <SelectionGridPage
            title="Explore Your Passions"
            subTitle="Select all that apply. Your choices help us tailor the best suggestions for you! Choose a category, then pick your items."
            categories={INTEREST_CATEGORIES}
            allItems={allInterestsData}
            setAllItems={setAllInterestsData as React.Dispatch<React.SetStateAction<SkillItem[] | InterestItem[]>>}
            selectedItems={userInput.selectedInterests}
            onToggleItem={handleToggleInterest as (item: SkillItem | InterestItem) => void}
            onNext={handleFetchCareerAdvice}
            onBack={handleBackToSkills}
            nextButtonText="Get Career Insights"
            searchPlaceholder="Search interests... (e.g., AI, Gaming, Sustainability)"
            itemType="interest"
            currentAppState={appState}
            onCustomItemAdded={handleCustomItemAdded}
          />
        );
      case 'LOADING':
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <LoadingIndicator loadingText="Finding Suitable Jobs For You!" />
                {currentQuote && <QuoteDisplay quote={currentQuote} />}
            </div>
        );
      case 'TIMETABLE_LOADING':
        // For timetable loading, we show the main LoadingIndicator then the quote
        return (
             <div className="flex flex-col items-center justify-center h-full">
                <LoadingIndicator loadingText="Generating Your Personalized Timetable..." />
                {currentQuote && <QuoteDisplay quote={currentQuote} />}
            </div>
        );
      case 'RESULTS':
        return results ? (
          <ResultsDisplay
            results={results}
            onStartOver={() => resetApp()}
            onViewJobDetails={handleViewJobDetails}
          />
        ) : <ErrorDisplay message="No results to display." onRetry={handleFetchCareerAdvice} onStartOver={() => resetApp()} />;
      case 'JOB_DETAIL_VIEW':
        return selectedJob ? (
          <>
            <JobDetailPage
              job={selectedJob}
              generatedTimetable={generatedTimetable}
              onGenerateTimetable={handleGenerateTimetable}
              onBack={isViewingSavedPlan ? handleBackToSavedPlansListFromDetail : handleBackToResults} 
            />
             {/* Show quote if timetable is streaming/being generated for this view */}
             {isStreaming && currentQuote && <QuoteDisplay quote={currentQuote} />}
          </>
        ) : <ErrorDisplay message="No job details to display." onRetry={handleBackToResults} onStartOver={() => resetApp()} />;
      case 'ERROR':
        const isTimetableError = error?.toLowerCase().includes("timetable") || (selectedJob !== null && generatedTimetable === null);
        const retryAction = isTimetableError && selectedJob ?
          () => handleGenerateTimetable(selectedJob, 'your chosen timeframe')
          : handleFetchCareerAdvice;
        return <ErrorDisplay message={error || 'An unexpected error occurred.'} onRetry={retryAction} onStartOver={() => resetApp()} />;
      
      case 'SAVED_PLANS_VIEW': 
        return (
          <SavedPlansPage
            savedSessions={savedSessions}
            onViewDetails={handleViewSavedPlanDetails}
            onDelete={handleDeleteSavedPlan}
            onClearAll={handleClearAllSavedPlans}
            onBack={handleBackFromSavedPlansList}
            currentUserName={userInput.fullName}
          />
        );
      default:
        return <HomePage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen font-sans transition-colors duration-300`}
    >
      <Header
        appName="Solutions"
        currentStep={appState}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onNavigateHome={() => resetApp(true)}
        onNavigateToSavedPlans={handleNavigateToSavedPlans}
        hasSavedSessions={savedSessions.length > 0}
      />
      <main className="flex-grow w-full px-2 sm:px-4 py-4 sm:py-8 flex flex-col overflow-y-auto">
        <div
          key={appState} 
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden flex-grow flex flex-col page-content-wrapper transition-colors duration-300 w-full max-w-full md:max-w-7xl mx-auto animate-fadeInPage"
        >
          {renderContent()}
        </div>
      </main>
      <Footer />
      <SaveSessionButton
        isVisible={showSavePlanButton && !isViewingSavedPlan && !!userInput.fullName}
        onClick={handleSaveSession}
        userName={userInput.fullName}
        onViewSavedPlans={handleNavigateToSavedPlans}
        hasSavedSessions={savedSessions.length > 0} 
      />
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancelButton={modalState.showCancelButton}
      />
    </div>
  );
};

export default App;
