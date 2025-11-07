/**
 * Zustand store for game state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Scenario,
  GameProgress,
  UserStats,
  Question,
} from '@/types/game';

interface GameStore {
  // Current game state
  currentScenario: Scenario | null;
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  showExplanation: boolean;
  isGameActive: boolean;
  scenarioStartTime: number | null;
  
  // Progress tracking
  progress: GameProgress | null;
  completedScenarios: string[];
  passedRounds: string[]; // Rounds that have been passed (score >= 60%)
  
  // User statistics
  userStats: UserStats;
  
  // Actions
  startScenario: (scenario: Scenario) => void;
  selectAnswer: (answerId: string) => void;
  submitAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeScenario: () => void;
  resetGame: () => void;
  updateStats: (stats: Partial<UserStats>) => void;
  calculateScore: () => number;
  getCurrentQuestion: () => Question | null;
  isAnswerCorrect: (questionId: string, answerId: string) => boolean;
  isRoundPassed: (roundId: string) => boolean;
  isRoundUnlocked: (roundId: string) => boolean;
}

const initialUserStats: UserStats = {
  totalScenariosCompleted: 0,
  totalScore: 0,
  totalTimeSpent: 0,
  averageScore: 0,
  totalPercentageSum: 0,
  currentStreak: 0,
  longestStreak: 0,
  achievements: [],
  progressByCategory: {},
};

type GameStorePersist = Pick<GameStore, 'completedScenarios' | 'passedRounds' | 'userStats'>;

export const useGameStore = create<GameStore>()(
  // @ts-ignore - Zustand v5 persist middleware type inference issue with TypeScript strict mode
  persist<GameStore, [], [], GameStorePersist>(
    (set, get) => ({
      // Initial state
      currentScenario: null,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      isGameActive: false,
      scenarioStartTime: null,
      progress: null,
      completedScenarios: [],
      passedRounds: [],
      userStats: initialUserStats,

      // Start a new scenario
      startScenario: (scenario: Scenario) => {
        const startTime = Date.now();
        set({
          currentScenario: scenario,
          currentQuestionIndex: 0,
          selectedAnswer: null,
          showExplanation: false,
          isGameActive: true,
          scenarioStartTime: startTime,
          progress: {
            scenarioId: scenario.id,
            completed: false,
            score: 0,
            maxScore: scenario.questions.reduce((sum, q) => sum + q.points, 0),
            timeSpent: 0,
            answers: {},
          },
        });
      },

      // Select an answer
      selectAnswer: (answerId: string) => {
        set({ selectedAnswer: answerId, showExplanation: false });
      },

      // Submit answer and show explanation
      submitAnswer: () => {
        const state = get();
        if (!state.currentScenario || !state.selectedAnswer) return;

        const currentQuestion = state.currentScenario.questions[state.currentQuestionIndex];

        // Update progress - recalculate score from all answers to avoid double counting
        const newAnswers = {
          ...state.progress?.answers,
          [currentQuestion.id]: state.selectedAnswer,
        };

        // Recalculate total score from all answers to ensure accuracy
        let totalScore = 0;
        state.currentScenario.questions.forEach((question) => {
          const answerId = newAnswers[question.id];
          if (answerId) {
            const option = question.options.find((opt) => opt.id === answerId);
            if (option?.isCorrect) {
              totalScore += question.points;
            }
          }
        });

        set({
          showExplanation: true,
          progress: {
            ...state.progress!,
            answers: newAnswers,
            score: totalScore,
          },
        });
      },

      // Move to next question
      nextQuestion: () => {
        const state = get();
        if (!state.currentScenario) return;

        const nextIndex = state.currentQuestionIndex + 1;
        if (nextIndex < state.currentScenario.questions.length) {
          set({
            currentQuestionIndex: nextIndex,
            selectedAnswer: null,
            showExplanation: false,
          });
        }
      },

      // Move to previous question
      previousQuestion: () => {
        const state = get();
        const prevIndex = state.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
          set({
            currentQuestionIndex: prevIndex,
            selectedAnswer: state.progress?.answers[
              state.currentScenario?.questions[prevIndex].id || ''
            ] || null,
            showExplanation: false,
          });
        }
      },

      // Complete the scenario
      completeScenario: () => {
        const state = get();
        if (!state.currentScenario || !state.progress) return;

        const finalScore = state.calculateScore();
        const timeSpent = state.scenarioStartTime
          ? Math.floor((Date.now() - state.scenarioStartTime) / 1000)
          : 0;

        const updatedProgress: GameProgress = {
          ...state.progress,
          completed: true,
          score: finalScore,
          timeSpent,
          completedAt: new Date(),
        };

        // Check if round is passed (60% or higher score)
        const passThreshold = 0.6; // 60%
        const scorePercentage = finalScore / updatedProgress.maxScore;
        const isPassed = scorePercentage >= passThreshold;
        
        // Calculate percentage score (0-100)
        const percentageScore = (finalScore / updatedProgress.maxScore) * 100;
        
        // Update passed rounds
        const wasAlreadyPassed = state.passedRounds.includes(state.currentScenario.id);
        const newPassedRounds = isPassed && !wasAlreadyPassed
          ? [...state.passedRounds, state.currentScenario.id]
          : state.passedRounds;

        // Update user stats
        const wasAlreadyCompleted = state.completedScenarios.includes(state.currentScenario.id);
        const newCompletedScenarios = wasAlreadyCompleted
          ? state.completedScenarios
          : [...state.completedScenarios, state.currentScenario.id];

        const newTotalScenarios = wasAlreadyCompleted
          ? state.userStats.totalScenariosCompleted
          : state.userStats.totalScenariosCompleted + 1;

        // Update total score (raw points, used for other stats)
        const newTotalScore = wasAlreadyCompleted
          ? state.userStats.totalScore - (state.progress.score || 0) + finalScore
          : state.userStats.totalScore + finalScore;

        // Calculate average percentage score using sum of percentages
        // Track totalPercentageSum for accurate average calculation
        const currentTotalPercentageSum = state.userStats.totalPercentageSum || 0;
        let newTotalPercentageSum = 0;
        let newAverageScore = 0;
        
        if (wasAlreadyCompleted) {
          // For re-completion: we need to find and replace the old percentage
          // Since we don't track individual scenario percentages, we'll use the stored progress
          // Get the old percentage from the previous completion
          const oldPercentage = state.progress 
            ? (state.progress.score / state.progress.maxScore) * 100 
            : state.userStats.averageScore; // Fallback to average if no progress
          
          // Update: subtract old percentage, add new percentage
          newTotalPercentageSum = currentTotalPercentageSum - oldPercentage + percentageScore;
          newAverageScore = newTotalScenarios > 0 
            ? newTotalPercentageSum / newTotalScenarios 
            : percentageScore;
        } else {
          // New completion: add the new percentage to the sum
          newTotalPercentageSum = currentTotalPercentageSum + percentageScore;
          newAverageScore = newTotalScenarios > 0
            ? newTotalPercentageSum / newTotalScenarios
            : percentageScore;
        }

        // Update category progress
        const category = state.currentScenario.category;
        const categoryProgress = state.userStats.progressByCategory[category] || {
          completed: 0,
          total: 0,
          averageScore: 0,
          totalPercentageSum: 0,
        };

        // Calculate category average percentage score using sum
        const categoryCurrentTotalPercentageSum = categoryProgress.totalPercentageSum || 0;
        const categoryPreviousCount = categoryProgress.completed;
        const categoryNewCount = wasAlreadyCompleted 
          ? categoryProgress.completed 
          : categoryProgress.completed + 1;
        
        let categoryNewTotalPercentageSum = 0;
        let categoryNewAverage = 0;
        
        if (wasAlreadyCompleted) {
          // Re-completion: get old percentage and replace it
          const oldCategoryPercentage = state.progress 
            ? (state.progress.score / state.progress.maxScore) * 100 
            : categoryProgress.averageScore; // Fallback
          
          categoryNewTotalPercentageSum = categoryCurrentTotalPercentageSum - oldCategoryPercentage + percentageScore;
          categoryNewAverage = categoryPreviousCount > 0 
            ? categoryNewTotalPercentageSum / categoryPreviousCount 
            : percentageScore;
        } else {
          // New completion: add new percentage to sum
          categoryNewTotalPercentageSum = categoryCurrentTotalPercentageSum + percentageScore;
          categoryNewAverage = categoryNewCount > 0
            ? categoryNewTotalPercentageSum / categoryNewCount
            : percentageScore;
        }

        const updatedCategoryProgress = {
          ...categoryProgress,
          completed: categoryNewCount,
          averageScore: categoryNewAverage,
          totalPercentageSum: categoryNewTotalPercentageSum,
        };

        set({
          progress: updatedProgress,
          completedScenarios: newCompletedScenarios,
          passedRounds: newPassedRounds,
          isGameActive: false,
          scenarioStartTime: null,
          userStats: {
            ...state.userStats,
            totalScenariosCompleted: newTotalScenarios,
            totalScore: newTotalScore,
            totalTimeSpent: state.userStats.totalTimeSpent + timeSpent,
            averageScore: newAverageScore,
            totalPercentageSum: newTotalPercentageSum,
            progressByCategory: {
              ...state.userStats.progressByCategory,
              [category]: updatedCategoryProgress,
            },
          },
        });
      },

      // Reset game state
      resetGame: () => {
        set({
          currentScenario: null,
          currentQuestionIndex: 0,
          selectedAnswer: null,
          showExplanation: false,
          isGameActive: false,
          scenarioStartTime: null,
          progress: null,
        });
      },

      // Update user stats
      updateStats: (stats: Partial<UserStats>) => {
        set((state) => ({
          userStats: { ...state.userStats, ...stats },
        }));
      },

      // Calculate current score
      calculateScore: () => {
        const state = get();
        if (!state.progress || !state.currentScenario) return 0;

        let score = 0;
        state.currentScenario.questions.forEach((question) => {
          const selectedAnswerId = state.progress?.answers[question.id];
          if (selectedAnswerId && state.isAnswerCorrect(question.id, selectedAnswerId)) {
            score += question.points;
          }
        });

        return score;
      },

      // Get current question
      getCurrentQuestion: () => {
        const state = get();
        if (!state.currentScenario) return null;
        return state.currentScenario.questions[state.currentQuestionIndex] || null;
      },

      // Check if answer is correct
      isAnswerCorrect: (questionId: string, answerId: string) => {
        const state = get();
        if (!state.currentScenario) return false;

        const question = state.currentScenario.questions.find((q) => q.id === questionId);
        if (!question) return false;

        const option = question.options.find((opt) => opt.id === answerId);
        return option?.isCorrect || false;
      },

      // Check if a round is passed
      isRoundPassed: (roundId: string) => {
        const state = get();
        return state.passedRounds.includes(roundId);
      },

      // Check if a round is unlocked (previous round passed or it's the first round)
      isRoundUnlocked: (roundId: string) => {
        const state = get();
        
        // First round (scenario-1) is always unlocked
        if (roundId === 'scenario-1') return true;
        
        // Extract round number
        const roundMatch = roundId.match(/scenario-(\d+)/);
        if (!roundMatch) return false;
        
        const currentRoundNum = parseInt(roundMatch[1], 10);
        const previousRoundId = `scenario-${currentRoundNum - 1}`;
        
        // Round is unlocked if previous round is passed
        return state.passedRounds.includes(previousRoundId);
      },
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        completedScenarios: state.completedScenarios,
        passedRounds: state.passedRounds,
        userStats: state.userStats,
      }),
    }
  )
);

