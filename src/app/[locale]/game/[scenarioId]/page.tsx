'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { QuestionCard } from '@/components/game/QuestionCard';
import { ProgressTracker } from '@/components/game/ProgressTracker';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';
import { getScenarioById } from '@/data/scenarios';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameScenarioPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('common');
  const tScenarios = useTranslations('scenarios');
  
  const scenarioId = params.scenarioId as string;
  
  // Helper to safely get translation with fallback to English
  const safeTranslate = (translator: ReturnType<typeof useTranslations>, key: string, fallback: string): string => {
    try {
      const result = translator(key);
      if (!result || typeof result !== 'string' || result === key) {
        return fallback;
      }
      return result;
    } catch {
      return fallback;
    }
  };

  const {
    currentScenario,
    currentQuestionIndex,
    selectedAnswer,
    showExplanation,
    progress,
    getCurrentQuestion,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeScenario,
    startScenario,
  } = useGameStore();

  useEffect(() => {
    if (!currentScenario || currentScenario.id !== scenarioId) {
      const scenario = getScenarioById(scenarioId);
      if (scenario) {
        startScenario(scenario);
      } else {
        router.push(`/${locale}/game`);
      }
    }
  }, [scenarioId, currentScenario, startScenario, router]);

  const currentQuestion = getCurrentQuestion();
  const isLastQuestion = currentScenario
    ? currentQuestionIndex === currentScenario.questions.length - 1
    : false;
  const isFirstQuestion = currentQuestionIndex === 0;
  const answeredQuestions = progress ? Object.keys(progress.answers) : [];

  if (!currentScenario || !currentQuestion) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (isLastQuestion) {
      completeScenario();
      router.push(`/${locale}/game/${scenarioId}/results`);
    } else {
      nextQuestion();
    }
  };

  const handleSubmit = () => {
    submitAnswer();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        {/* <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/game`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToScenarios')}
        </Button> */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {safeTranslate(tScenarios, `${currentScenario.id}.title`, currentScenario.title)}
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          {safeTranslate(tScenarios, `${currentScenario.id}.description`, currentScenario.description)}
        </p>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker
        scenario={currentScenario}
        currentQuestionIndex={currentQuestionIndex}
        answeredQuestions={answeredQuestions}
      />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            showExplanation={showExplanation}
            onSelectAnswer={selectAnswer}
            onSubmit={handleSubmit}
            onNext={handleNext}
            isAnswered={showExplanation}
            isLastQuestion={isLastQuestion}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation - Only show back button, next is in QuestionCard */}
      {!showExplanation && (
        <div className="flex justify-start mt-4 sm:mt-6">
          <Button
            variant="secondary"
            onClick={previousQuestion}
            disabled={isFirstQuestion}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
        </div>
      )}
    </div>
  );
}

