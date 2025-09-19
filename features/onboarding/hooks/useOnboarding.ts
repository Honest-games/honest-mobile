import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '@shared/config/_providers/store';
import {
  startOnboarding,
  nextStep,
  previousStep,
  goToStep,
  completeOnboarding,
  skipOnboarding,
  hideOnboarding,
  showOnboarding,
  trackInteraction,
  resetOnboarding,
  loadOnboardingStatus,
  selectCurrentStep,
  selectTotalSteps,
  selectIsVisible,
  selectHasCompletedOnboarding,
  selectHasSkippedOnboarding,
  selectCurrentStepData,
  selectProgress,
  selectIsFirstStep,
  selectIsLastStep,
  selectAnalytics,
  selectShouldShowOnboarding
} from '../model/slice';

const ONBOARDING_STORAGE_KEY = 'onboarding_completed';

export const useOnboarding = () => {
  const dispatch = useDispatch();

  const currentStep = useSelector((state: RootState) => selectCurrentStep(state));
  const totalSteps = useSelector((state: RootState) => selectTotalSteps(state));
  const isVisible = useSelector((state: RootState) => selectIsVisible(state));
  const hasCompletedOnboarding = useSelector((state: RootState) => selectHasCompletedOnboarding(state));
  const hasSkippedOnboarding = useSelector((state: RootState) => selectHasSkippedOnboarding(state));
  const currentStepData = useSelector((state: RootState) => selectCurrentStepData(state));
  const progress = useSelector((state: RootState) => selectProgress(state));
  const isFirstStep = useSelector((state: RootState) => selectIsFirstStep(state));
  const isLastStep = useSelector((state: RootState) => selectIsLastStep(state));
  const analytics = useSelector((state: RootState) => selectAnalytics(state));
  const shouldShowOnboarding = useSelector((state: RootState) => selectShouldShowOnboarding(state));

  // Load onboarding status from AsyncStorage on mount
  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          dispatch(loadOnboardingStatus({
            completed: data.completed || false,
            skipped: data.skipped || false
          }));
        }
      } catch (error) {
        console.error('Failed to load onboarding status:', error);
      }
    };

    loadOnboardingData();
  }, [dispatch]);

  const handleStart = () => {
    dispatch(startOnboarding());
    dispatch(trackInteraction({ step: 0, action: 'interact', metadata: { action: 'start' } }));
  };

  const handleNext = () => {
    dispatch(trackInteraction({ step: currentStep, action: 'next' }));

    if (isLastStep) {
      handleComplete();
    } else {
      dispatch(nextStep());
    }
  };

  const handlePrevious = () => {
    dispatch(trackInteraction({ step: currentStep, action: 'back' }));
    dispatch(previousStep());
  };

  const handleGoToStep = (step: number) => {
    dispatch(trackInteraction({ step: currentStep, action: 'interact', metadata: { targetStep: step } }));
    dispatch(goToStep(step));
  };

  const handleComplete = () => {
    dispatch(trackInteraction({ step: currentStep, action: 'complete' }));
    dispatch(completeOnboarding());
  };

  const handleSkip = () => {
    dispatch(trackInteraction({ step: currentStep, action: 'skip' }));
    dispatch(skipOnboarding());
  };

  const handleHide = () => {
    dispatch(hideOnboarding());
  };

  const handleShow = () => {
    dispatch(showOnboarding());
  };

  const handleReset = () => {
    dispatch(resetOnboarding());
  };

  return {
    // State
    currentStep,
    totalSteps,
    isVisible,
    hasCompletedOnboarding,
    hasSkippedOnboarding,
    currentStepData,
    progress,
    isFirstStep,
    isLastStep,
    analytics,
    shouldShowOnboarding,

    // Actions
    start: handleStart,
    next: handleNext,
    previous: handlePrevious,
    goToStep: handleGoToStep,
    complete: handleComplete,
    skip: handleSkip,
    hide: handleHide,
    show: handleShow,
    reset: handleReset
  };
};