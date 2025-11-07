'use client';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ScoreDisplay } from '@/components/game/ScoreDisplay';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';
import { getScenarioById } from '@/data/scenarios';
import { Home, RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('common');
  const tGame = useTranslations('game');
  const tQuestions = useTranslations('questions');
  const tScenarios = useTranslations('scenarios');
  const tResults = useTranslations('results');
  
  const scenarioId = params.scenarioId as string;

  const { progress, resetGame } = useGameStore();
  const scenario = getScenarioById(scenarioId);
  
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

  if (!progress || !scenario) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">No results available.</p>
          <Button
            variant="primary"
            onClick={() => router.push(`/${locale}/game`)}
            className="mt-4"
          >
            {t('backToScenarios')}
          </Button>
        </div>
      </div>
    );
  }

  const handlePlayAgain = () => {
    resetGame();
    router.push(`/${locale}/game/${scenarioId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {safeTranslate(tResults, 'scenarioComplete', 'Scenario Complete!')}
          </h1>
          <p className="text-gray-600">
            {safeTranslate(tScenarios, `${scenario.id}.title`, scenario.title)}
          </p>
        </div>

        <ScoreDisplay
          score={progress.score}
          maxScore={progress.maxScore}
          timeSpent={progress.timeSpent}
        />

        {/* Detailed Results */}
        <Card className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {safeTranslate(tResults, 'questionBreakdown', 'Question Breakdown')}
          </h2>
          <div className="space-y-3">
            {scenario.questions.map((question, index) => {
              const selectedAnswerId = progress.answers[question.id];
              const selectedOption = question.options.find((opt) => opt.id === selectedAnswerId);
              const correctOption = question.options.find((opt) => opt.isCorrect);
              const isCorrect = selectedOption?.isCorrect || false;
              
              // Get translated question text with fallback
              const questionKey = `${question.id}.question`;
              const translatedQuestion = safeTranslate(tQuestions, questionKey, question.question);
              
              // Get translated option text with fallback
              const translatedOptionText = selectedOption 
                ? safeTranslate(tQuestions, `${question.id}.options.${selectedOption.id}.text`, selectedOption.text)
                : safeTranslate(tResults, 'notAnswered', 'Not answered');
              
              // Get translated correct answer text
              const translatedCorrectAnswerText = correctOption
                ? safeTranslate(tQuestions, `${question.id}.options.${correctOption.id}.text`, correctOption.text)
                : '';
              
              // Get translated explanation if available
              const translatedExplanation = selectedOption
                ? safeTranslate(tQuestions, `${question.id}.options.${selectedOption.id}.explanation`, selectedOption.explanation || '')
                : '';

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-success-200 bg-success-50'
                      : 'border-danger-200 bg-danger-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {tGame('question')} {index + 1}
                        </span>
                        {isCorrect ? (
                          <span className="text-success-600 font-semibold">
                            +{question.points} {tGame('points')}
                          </span>
                        ) : (
                          <span className="text-danger-600 font-semibold">0 {tGame('points')}</span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2 font-medium">{translatedQuestion}</p>
                      <p className={`text-sm mb-1 ${isCorrect ? 'text-success-700' : 'text-danger-700'}`}>
                        <span className="font-semibold">{tResults('yourAnswer')}:</span> {translatedOptionText}
                      </p>
                      {!isCorrect && translatedCorrectAnswerText && (
                        <p className="text-sm text-success-700 mb-1">
                          <span className="font-semibold">{tGame('correctAnswer')}:</span> {translatedCorrectAnswerText}
                        </p>
                      )}
                      {translatedExplanation && (
                        <p className="text-sm text-gray-500 italic mt-1">
                          {translatedExplanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
          <Button variant="primary" onClick={handlePlayAgain} className="w-full sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            {tResults('playAgain')}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/${locale}/game`)} className="w-full sm:w-auto">
            <Home className="w-4 h-4 mr-2" />
            {t('backToScenarios')}
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/${locale}/results`)} className="w-full sm:w-auto">
            <Trophy className="w-4 h-4 mr-2" />
            {tResults('viewAllResults')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

