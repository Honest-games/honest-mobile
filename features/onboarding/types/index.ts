export interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  illustration: 'welcome' | 'topics' | 'levels' | 'gameplay' | 'achievements';
  primaryAction: string;
  secondaryAction?: string;
}

export interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  hasSkipped: boolean;
}

export interface OnboardingNavigation {
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}