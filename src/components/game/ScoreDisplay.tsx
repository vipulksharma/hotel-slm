'use client';
import { Card } from '@/components/ui/Card';
import { Trophy, Target, Clock } from 'lucide-react';
import { calculatePercentage, getScoreColor } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  timeSpent?: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore,
  timeSpent,
}) => {
  // Ensure percentage is capped at 100% and handle edge cases
  const rawPercentage = calculatePercentage(score, maxScore);
  const percentage = Math.min(100, Math.max(0, rawPercentage)); // Cap between 0-100%
  const scoreColor = getScoreColor(percentage);

  return (
    <Card variant="elevated" className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Score</h3>
        <div className="mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`text-5xl font-bold ${scoreColor} mb-2`}
          >
            {score} / {maxScore}
          </motion.div>
          <div className="text-xl text-gray-600">
            {percentage}%
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            <div>
              <div className="text-sm text-gray-500">Accuracy</div>
              <div className="font-semibold text-gray-900">{percentage}%</div>
            </div>
          </div>
          {timeSpent !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <div className="text-sm text-gray-500">Time</div>
                <div className="font-semibold text-gray-900">
                  {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

