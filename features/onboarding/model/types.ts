export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  illustration: 'welcome' | 'themes' | 'levels' | 'gameplay' | 'achievements';
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  hasCompletedOnboarding: boolean;
  hasSkippedOnboarding: boolean;
  isVisible: boolean;
  completedSteps: number[];
  analytics: {
    startTime: number | null;
    stepTimes: Record<number, number>;
    interactions: OnboardingInteraction[];
  };
}

export interface OnboardingInteraction {
  step: number;
  action: 'next' | 'back' | 'skip' | 'interact' | 'complete';
  timestamp: number;
  metadata?: Record<string, any>;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'onboarding.welcome.title',
    description: 'onboarding.welcome.description',
    illustration: 'welcome'
  },
  {
    id: 2,
    title: 'onboarding.themes.title',
    description: 'onboarding.themes.description',
    illustration: 'themes'
  },
  {
    id: 3,
    title: 'onboarding.levels.title',
    description: 'onboarding.levels.description',
    illustration: 'levels'
  },
  {
    id: 4,
    title: 'onboarding.gameplay.title',
    description: 'onboarding.gameplay.description',
    illustration: 'gameplay'
  },
  {
    id: 5,
    title: 'onboarding.achievements.title',
    description: 'onboarding.achievements.description',
    illustration: 'achievements'
  }
];