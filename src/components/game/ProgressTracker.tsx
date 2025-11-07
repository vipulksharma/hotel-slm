'use client';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Scenario } from '@/types/game';

interface ProgressTrackerProps {
  scenario: Scenario;
  currentQuestionIndex: number;
  answeredQuestions: string[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  scenario,
  currentQuestionIndex,
  answeredQuestions,
}) => {
  const progressPercentage = (currentQuestionIndex / scenario.questions.length) * 100;

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Progress</h3>
          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {scenario.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            className="bg-primary-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {scenario.questions.map((question, index) => {
          const isAnswered = answeredQuestions.includes(question.id);
          const isCurrent = index === currentQuestionIndex;

          return (
            <motion.div
              key={question.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                ${isCurrent
                  ? 'border-primary-600 bg-primary-100 scale-110'
                  : isAnswered
                  ? 'border-success-500 bg-success-100'
                  : 'border-gray-300 bg-gray-50'
                }
              `}
            >
              {isAnswered ? (
                <CheckCircle2 className="w-5 h-5 text-success-600" />
              ) : (
                <Circle className={`w-5 h-5 ${isCurrent ? 'text-primary-600' : 'text-gray-400'}`} />
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

