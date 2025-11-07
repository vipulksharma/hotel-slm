/**
 * Utility functions for the game
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculatePercentage(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  const percentage = (score / maxScore) * 100;
  // Cap at 100% to prevent showing more than 100%
  return Math.min(100, Math.round(percentage));
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-success-100 text-success-800 border-success-500';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-600';
    case 'advanced':
      return 'bg-danger-100 text-danger-800 border-danger-500';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-success-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-danger-600';
}

