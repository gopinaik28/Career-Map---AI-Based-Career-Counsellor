// types.ts

export type AppState =
  | 'HOME'
  | 'BACKGROUND_INPUT'
  | 'SKILLS_SELECTION'
  | 'INTERESTS_SELECTION'
  | 'LOADING'
  | 'RESULTS'
  | 'JOB_DETAIL_VIEW'
  | 'TIMETABLE_LOADING'
  | 'SAVED_PLANS_VIEW' // New state for viewing saved plans
  | 'ERROR';

export interface SkillItem {
  id: string;
  name: string;
  category: string; // This is the skill's functional category, e.g., "Software & Web Development"
  relevance?: number; 
}

export interface InterestItem {
  id: string;
  name: string;
  category: string;
  relevance?: number;
}

export interface CategoryColorTheme {
  activeClass: string; // Tailwind classes for active state
  inactiveClass: string; // Tailwind classes for inactive state
  textClass?: string; // Optional: Tailwind class for text color when used in headers like "Items in: Category"
}

export interface SkillCategory {
  id: string;
  name: string; // This is the display name for the category button, e.g., "Technical Skills"
  items: SkillItem[];
  colorTheme?: CategoryColorTheme; // Added for styling
}

export interface InterestCategory {
  id: string;
  name: string;
  items: InterestItem[];
  colorTheme?: CategoryColorTheme; // Added for styling
}

// This type now represents the options for the dropdown. The actual stored value will be a string.
export type HighestQualificationOption = 
  | ''
  | "High School Diploma/GED"
  | "Associate's Degree"
  | "Bachelor's Degree"
  | "Master's Degree"
  | "Doctorate (Ph.D., Ed.D., etc.)"
  | "Professional Degree (MD, JD, DDS)"
  | "Vocational/Technical Certificate"
  | "Some College, No Degree"
  | "Currently Studying"
  | "Self-Taught/Online Courses"
  | "Other";

export interface UserInput {
  fullName: string; 
  highestQualification: string; // Changed to string to directly hold "Other" text or selected option
  fieldOfStudy: string;
  educationJourneyNotes: string; 
  experience: string; 
  selectedSkills: SkillItem[];
  selectedInterests: InterestItem[];
}

export interface JobRole {
  title: string;
  description: string;
  relevanceScore?: number;
  roadmap: string;
  estimatedPayBracket?: 'High' | 'Above Average' | 'Average' | 'Entry-Level' | 'Varies Widely';
  marketDemand?: 'Very High' | 'High' | 'Medium' | 'Stable' | 'Niche';
  learningEffort?: 'Low' | 'Medium' | 'High' | 'Intensive';
}

export interface CareerAdvisorResponse {
  suggestedRoles: JobRole[];
  keyConsiderations?: string;
  generalAdvice?: string;
}

export interface TimetableResourceSuggestion {
  type: string; 
  details: string; 
}

export interface TimetableTask {
  taskDescription: string;
  skillsToFocus?: string[];
  suggestedResources?: TimetableResourceSuggestion[];
}

export interface TimetableWeek {
  weekRange: string; 
  focusArea: string;
  tasks: TimetableTask[];
}

export interface TimetablePhase {
  phaseTitle: string;
  phaseDuration?: string; 
  summary?: string;
  weeks: TimetableWeek[];
}

export interface StructuredTimetable {
  title: string; 
  introductoryNote?: string;
  phases: TimetablePhase[];
  generalTips?: string[];
}

export interface PersonalizedTimetable {
    jobTitle: string;
    userTimeframe: string;
    generatedSchedule: StructuredTimetable | null; 
}

// For saving sessions to localStorage
export interface SavedSession {
  id: string; // Unique ID for the session, e.g., timestamp_username
  timestamp: number;
  userName: string;
  userInput: UserInput;
  selectedJob: JobRole;
  generatedTimetable: StructuredTimetable;
}

// For storing user-defined skills/interests for dynamic RAG
export interface UserDefinedKnowledgeItem {
  id: string;
  name: string;
  type: 'skill' | 'interest';
  count?: number; // Optional: how many times it has been added/matched
  // We could add a 'contextSnippet' if we were to generate context for these,
  // but for now, we'll just use their names.
}
