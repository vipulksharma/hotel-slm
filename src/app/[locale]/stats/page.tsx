'use client';
import { Card } from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsPage() {
  const { userStats } = useGameStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Detailed Statistics</h1>
        </div> */}

        <Card variant="elevated" className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Learning Progress</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Scenarios</span>
                    <span className="text-sm font-semibold">{userStats.totalScenariosCompleted}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Score</span>
                    <span className="text-sm font-semibold">{userStats.totalScore}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="text-sm font-semibold">{userStats.averageScore.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Time Spent</span>
                    <span className="text-sm font-semibold">
                      {Math.floor(userStats.totalTimeSpent / 60)} minutes
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Current Streak</span>
                    <span className="text-sm font-semibold">{userStats.currentStreak} days</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Longest Streak</span>
                    <span className="text-sm font-semibold">{userStats.longestStreak} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {Object.keys(userStats.progressByCategory).length > 0 && (
          <Card variant="elevated">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Performance</h2>
            <div className="space-y-4">
              {Object.entries(userStats.progressByCategory).map(([category, progress]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{category}</span>
                    <span className="text-sm text-gray-600">
                      {progress.completed} scenarios • {progress.averageScore.toFixed(0)}% average
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-primary-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(progress.completed / Math.max(progress.total, 1)) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

