'use client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, TrendingUp, ArrowRight, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getDifficultyColor } from '@/lib/utils';
import type { Scenario } from '@/types/game';

interface ScenarioCardProps {
  scenario: Scenario;
  isCompleted?: boolean;
  isPassed?: boolean;
  isUnlocked?: boolean;
  onStart: (scenario: Scenario) => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  isCompleted = false,
  isPassed = false,
  isUnlocked = true,
  onStart,
}) => {
  const t = useTranslations('common');
  const tGame = useTranslations('game');
  const tScenarios = useTranslations('scenarios');
  
  // Helper to safely get translation with fallback to English
  const safeTranslate = (translator: ReturnType<typeof useTranslations>, key: string, fallback: string): string => {
    try {
      const result = translator(key);
      // If result is the key itself (not found) or not a string, use fallback
      if (!result || typeof result !== 'string' || result === key) {
        return fallback;
      }
      return result;
    } catch {
      return fallback;
    }
  };
  
  // Get translated scenario title and description with fallback to English
  const translatedTitle = safeTranslate(tScenarios, `${scenario.id}.title`, scenario.title);
  const translatedDescription = safeTranslate(tScenarios, `${scenario.id}.description`, scenario.description);
  
  // Get translated category with fallback to English
  const translatedCategory = safeTranslate(tGame, `categories.${scenario.category}`, scenario.category);
  const handleClick = () => {
    if (isUnlocked) {
      onStart(scenario);
    }
  };

  return (
    <Card 
      variant="elevated" 
      className={`transition-all duration-300 ${
        isUnlocked 
          ? 'hover:shadow-xl cursor-pointer' 
          : 'opacity-60 cursor-not-allowed bg-gray-50'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {translatedTitle}
            </h3>
              {!isUnlocked && (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
              {isPassed && (
                <Badge variant="success" className="ml-2">
                  {t('passed')}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {translatedDescription}
            </p>
            {!isUnlocked && (
              <p className="text-sm text-yellow-600 font-medium mb-2">
                {t('roundLocked')}
              </p>
            )}
          </div>
          {isCompleted && !isPassed && (
            <Badge variant="info" className="ml-2">
              {tGame('completed')}
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getDifficultyColor(scenario.difficulty)}>
            {t(scenario.difficulty as 'beginner' | 'intermediate' | 'advanced')}
          </Badge>
          <Badge variant="info">
            {translatedCategory}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{scenario.estimatedTime} {tGame('minutes')}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{scenario.questions.length} {tGame('questions')}</span>
          </div>
        </div>

        {isUnlocked && (
          <Button
            variant="primary"
            className="w-full mt-auto"
            onClick={handleClick}
          >
            {t('start')} {t('round')}
            <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        )}
      </div>
    </Card>
  );
};

