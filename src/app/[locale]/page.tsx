'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BookOpen, Target, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const t = useTranslations('common');
  
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Scenarios',
      description: 'Learn through real-world driving situations with multiple choice questions',
    },
    {
      icon: Target,
      title: 'Progressive Learning',
      description: 'Start with beginner scenarios and advance to complex situations',
    },
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Monitor your scores and achievements as you learn',
    },
    {
      icon: TrendingUp,
      title: 'Legal References',
      description: 'Each question includes references to specific Indian traffic laws',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Learn Indian Road Laws
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Master Indian traffic rules and driving laws through interactive scenarios
          and engaging quizzes. Test your knowledge and become a safer driver.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/game">
            <Button variant="primary" size="lg">
              {t('start')} Learning
            </Button>
          </Link>
          <Link href="/results">
            <Button variant="outline" size="lg">
              View {t('results')}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="text-center h-full hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card variant="elevated" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-primary-100">Scenarios</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-primary-100">Difficulty Levels</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
