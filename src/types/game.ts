/**
 * Core type definitions for the Indian Road Laws Learning Game
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type QuestionType = 'multiple-choice' | 'true-false' | 'scenario-based';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options: AnswerOption[];
  points: number;
  category: string;
  lawReference?: string; // Reference to specific Indian law
  imageUrl?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  questions: Question[];
  imageUrl?: string;
  videoUrl?: string;
  estimatedTime: number; // in minutes
  category: string;
  tags: string[];
}

export interface GameProgress {
  scenarioId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  timeSpent: number; // in seconds
  answers: Record<string, string>; // questionId -> selectedAnswerId
  completedAt?: Date;
}

export interface UserStats {
  totalScenariosCompleted: number;
  totalScore: number;
  totalTimeSpent: number;
  averageScore: number;
  totalPercentageSum: number; // Sum of all scenario percentages for accurate average calculation
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  progressByCategory: Record<string, {
    completed: number;
    total: number;
    averageScore: number;
    totalPercentageSum: number; // Sum of percentages for this category
  }>;
}

export interface GameState {
  currentScenario: Scenario | null;
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  showExplanation: boolean;
  progress: GameProgress | null;
  userStats: UserStats;
  completedScenarios: string[];
  isGameActive: boolean;
}

export type GameAction =
  | { type: 'START_SCENARIO'; scenario: Scenario }
  | { type: 'SELECT_ANSWER'; answerId: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_SCENARIO' }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_STATS'; stats: Partial<UserStats> };

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

