'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ScenarioCard } from '@/components/game/ScenarioCard';
import { scenarios } from '@/data/scenarios';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export default function GamePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');
  const { completedScenarios, isRoundUnlocked, isRoundPassed } = useGameStore();

  const filteredScenarios = scenarios
    .sort((a, b) => {
      // Sort by round number (scenario-1, scenario-2, etc.)
      const aMatch = a.id.match(/scenario-(\d+)/);
      const bMatch = b.id.match(/scenario-(\d+)/);
      const aNum = aMatch ? parseInt(aMatch[1], 10) : 0;
      const bNum = bMatch ? parseInt(bMatch[1], 10) : 0;
      return aNum - bNum;
    });

  const handleStartScenario = (scenario: typeof scenarios[0]) => {
    // Check if round is unlocked before starting
    if (!isRoundUnlocked(scenario.id)) {
      return; // Don't start if locked
    }
    useGameStore.getState().startScenario(scenario);
    router.push(`/${locale}/game/${scenario.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('chooseRound')}
        </h1>
        <p className="text-gray-600">
          {t('selectRound')}
        </p>
      </motion.div> */}

      {/* Filters */}
      {/* <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative z-10">
            <Search className="search-icon text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('searchRounds')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? t('allDifficulties') : t(diff as 'beginner' | 'intermediate' | 'advanced')}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? t('allCategories') : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div> */}

      {/* Scenarios Grid */}
      {filteredScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ScenarioCard
                scenario={scenario}
                isCompleted={completedScenarios.includes(scenario.id)}
                isPassed={isRoundPassed(scenario.id)}
                isUnlocked={isRoundUnlocked(scenario.id)}
                onStart={handleStartScenario}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('noRoundsFound')}</p>
        </div>
      )}
    </div>
  );
}

