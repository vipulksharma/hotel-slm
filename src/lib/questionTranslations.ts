import { useTranslations } from 'next-intl';
import type { Question } from '@/types/game';

/**
 * Get translated question content
 * This function takes a question object and returns it with translated text
 */
export function useTranslatedQuestion(question: Question): Question {
  const t = useTranslations('questions');
  
  const questionKey = question.id;
  
  // Get translated question text
  const translatedQuestion = t(`${questionKey}.question`, { defaultValue: question.question });
  
  // Get translated options
  const translatedOptions = question.options.map((option) => {
    const optionKey = `${questionKey}.options.${option.id}`;
    return {
      ...option,
      text: t(`${optionKey}.text`, { defaultValue: option.text }),
      explanation: t(`${optionKey}.explanation`, { defaultValue: option.explanation || '' }),
    };
  });
  
  return {
    ...question,
    question: translatedQuestion,
    options: translatedOptions,
  };
}

/**
 * Get translated scenario metadata
 */
export function useTranslatedScenario(scenarioId: string) {
  const t = useTranslations('scenarios');
  
  return {
    title: t(`${scenarioId}.title`, { defaultValue: '' }),
    description: t(`${scenarioId}.description`, { defaultValue: '' }),
  };
}

