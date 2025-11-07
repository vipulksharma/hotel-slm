'use client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Question, AnswerOption } from '@/types/game';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  showExplanation: boolean;
  onSelectAnswer: (answerId: string) => void;
  onSubmit: () => void;
  isAnswered: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
  onSubmit,
  isAnswered,
}) => {
  const t = useTranslations('game');
  const tQuestions = useTranslations('questions');
  
  // Helper to safely get translation with fallback
  const safeTranslate = (key: string, fallback: string): string => {
    try {
      const result = tQuestions(key);
      // If next-intl returns the key itself (not found), or if it's not a string, use fallback
      if (!result || typeof result !== 'string' || result === key) {
        return fallback;
      }
      return result;
    } catch {
      // If any error occurs, return fallback
      return fallback;
    }
  };
  
  // Get translated question text
  const questionKey = `${question.id}.question`;
  const translatedQuestion = safeTranslate(questionKey, question.question);
  
  // Get translated options
  const translatedOptions = question.options.map((option) => {
    const textKey = `${question.id}.options.${option.id}.text`;
    const explanationKey = `${question.id}.options.${option.id}.explanation`;
    
    return {
      ...option,
      text: safeTranslate(textKey, option.text),
      explanation: safeTranslate(explanationKey, option.explanation || ''),
    };
  });
  
  const translatedQuestionObj = {
    ...question,
    question: translatedQuestion,
    options: translatedOptions,
  };
  
  const getAnswerStatus = (option: AnswerOption) => {
    if (!showExplanation) return null;
    if (option.isCorrect) return 'correct';
    if (option.id === selectedAnswer && !option.isCorrect) return 'incorrect';
    return null;
  };

  return (
    <Card variant="elevated" className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="info">
            {question.category}
          </Badge>
          <span className="text-sm text-gray-500">
            {question.points} {t('points')}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {translatedQuestionObj.question}
        </h2>
        {question.lawReference && (
          <p className="text-sm text-gray-500 italic">
            {t('lawReference')}: {question.lawReference}
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {translatedQuestionObj.options.map((option, index) => {
            const status = getAnswerStatus(option);
            const isSelected = option.id === selectedAnswer;

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isAnswered && onSelectAnswer(option.id)}
                disabled={isAnswered}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                  ${isSelected
                    ? status === 'correct'
                      ? 'border-success-500 bg-success-50'
                      : status === 'incorrect'
                      ? 'border-danger-500 bg-danger-50'
                      : 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }
                  ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">
                    {option.text}
                  </span>
                  {showExplanation && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-2"
                    >
                      {status === 'correct' && (
                        <CheckCircle2 className="w-6 h-6 text-success-600" />
                      )}
                      {status === 'incorrect' && (
                        <XCircle className="w-6 h-6 text-danger-600" />
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showExplanation && selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900 mb-1">{t('explanation')}:</p>
                <p className="text-blue-800 text-sm">
                  {translatedQuestionObj.options.find((opt) => opt.id === selectedAnswer)?.explanation ||
                   (translatedQuestionObj.options.find((opt) => opt.isCorrect)?.explanation || t('noExplanation'))}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={!selectedAnswer || isAnswered}
        >
          {isAnswered ? t('answered') : t('submitAnswer')}
        </Button>
      </div>
    </Card>
  );
};

