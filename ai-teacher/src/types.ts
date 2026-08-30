export type ScreenType = 
  | 'home' 
  | 'start-learning' 
  | 'personalize' 
  | 'lesson-planner' 
  | 'classroom' 
  | 'final-assessment' 
  | 'learning-report' 
  | 'dashboard' 
  | 'learning-path' 
  | 'profile' 
  | 'architecture';

export type SubjectType = 'physics' | 'math' | 'biology' | 'programming' | 'history';

export type TeacherPersonality = 
  | 'calm' 
  | 'energetic' 
  | 'coach' 
  | 'socratic'
  | 'Encouraging' 
  | 'Socratic' 
  | 'Direct & Rigorous' 
  | 'Storyteller';

export type TeachingMode = 'explaining' | 'demonstrating' | 'checking' | 'evaluating' | 'adapting' | 'practicing';

export type LanguageType = 
  | 'English' 
  | 'Hindi' 
  | 'Tamil' 
  | 'Telugu' 
  | 'Malayalam' 
  | 'Kannada' 
  | 'Hinglish';

export interface PersonalizationSettings {
  topic: string;
  sourceMaterialName?: string;
  sourceMaterialPages?: number;
  learningLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  existingKnowledge: 'New to this' | 'Basic understanding' | 'Comfortable with basics';
  learningObjective: 'Understand the concept' | 'Exam preparation' | 'Practical application' | 'Interview preparation';
  teachingLanguage: LanguageType;
  teachingStyle: 'Simple explanations' | 'Examples first' | 'Visual learning' | 'Step-by-step' | 'Socratic questioning';
  teacherPersonality: TeacherPersonality;
  availableTime: '5 minutes' | '10 minutes' | '20 minutes' | '30 minutes' | '60 minutes' | '7 days';
  desiredDepth: 'Essential' | 'Balanced' | 'Detailed';
}

export interface LessonStep {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  type: 'intro' | 'concept' | 'demo' | 'worked-example' | 'checkpoint' | 'adaptive' | 'assessment';
  completed: boolean;
  active: boolean;
}

export interface GroundingCitation {
  sourceFile: string;
  chapter: string;
  section: string;
  page: number;
  snippet: string;
  relevanceScore: number;
}

export interface QuizQuestion {
  id: number;
  type: 'mcq' | 'conceptual' | 'short-answer' | 'application';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  conceptTagged: string;
}

export interface StudentProfileData {
  name: string;
  email: string;
  learningLevel: string;
  preferredLanguage: LanguageType;
  teachingStyle: string;
  learningGoal: string;
  overallProgress: number;
  topicsStudied: number;
  learningTimeMinutes: number;
  currentStreakDays: number;
  strongConcepts: string[];
  weakConcepts: string[];
  recentScores: { topic: string; score: number; date: string }[];
  memoryLogs: { concept: string; note: string; date: string }[];
}

export interface AdaptiveEvent {
  misconception: string;
  originalAnswer: string;
  teacherSpeech: string;
  alternativeAnalogyTitle: string;
  alternativeAnalogyExplanation: string;
  newFormulaVisual: string;
  remediationQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  concept: string;
  mastered?: boolean;
}

export interface ConceptNode {
  id: string;
  label: string;
  status: 'mastered' | 'learning' | 'review';
  masteryPct: number;
  category: string;
  connections: string[];
}

export interface HomeworkProblem {
  id: number;
  tier: 'Basic' | 'Intermediate' | 'Application';
  concept: string;
  question: string;
  hint: string;
  solution: string;
}
