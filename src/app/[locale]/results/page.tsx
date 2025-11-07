'use client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useGameStore } from '@/store/gameStore';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculatePercentage } from '@/lib/utils';

export default function ResultsPage() {
  const { userStats, completedScenarios } = useGameStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Statistics</h1> */}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-full">
                <Trophy className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userStats.totalScenariosCompleted}
                </div>
                <div className="text-sm text-gray-600">Scenarios Completed</div>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success-100 rounded-full">
                <Target className="w-8 h-8 text-success-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userStats.averageScore.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor(userStats.totalTimeSpent / 60)}
                </div>
                <div className="text-sm text-gray-600">Minutes Played</div>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {userStats.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Progress */}
        {Object.keys(userStats.progressByCategory).length > 0 && (
          <Card variant="elevated" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress by Category</h2>
            <div className="space-y-4">
              {Object.entries(userStats.progressByCategory).map(([category, progress]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {progress.completed} completed
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {progress.averageScore.toFixed(0)}% avg
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="bg-primary-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${calculatePercentage(progress.completed, progress.total)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Achievements */}
        {userStats.achievements.length > 0 && (
          <Card variant="elevated">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
            <div className="flex flex-wrap gap-2">
              {userStats.achievements.map((achievement) => (
                <Badge key={achievement} variant="success">
                  {achievement}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {completedScenarios.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              You haven't completed any scenarios yet.
            </p>
            <p className="text-gray-400">
              Start playing to see your statistics here!
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

