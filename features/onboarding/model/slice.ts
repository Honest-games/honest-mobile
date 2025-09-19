import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingState, OnboardingInteraction, ONBOARDING_STEPS } from './types';

const ONBOARDING_STORAGE_KEY = 'onboarding_completed';

const initialState: OnboardingState = {
  currentStep: 0,
  totalSteps: ONBOARDING_STEPS.length,
  hasCompletedOnboarding: false,
  hasSkippedOnboarding: false,
  isVisible: false,
  completedSteps: [],
  analytics: {
    startTime: null,
    stepTimes: {},
    interactions: []
  }
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    startOnboarding: (state) => {
      state.isVisible = true;
      state.currentStep = 0;
      state.analytics.startTime = Date.now();
      state.analytics.stepTimes[0] = Date.now();
    },

    nextStep: (state) => {
      if (state.currentStep < state.totalSteps - 1) {
        state.completedSteps.push(state.currentStep);
        state.currentStep += 1;
        state.analytics.stepTimes[state.currentStep] = Date.now();
      }
    },

    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        state.analytics.stepTimes[state.currentStep] = Date.now();
      }
    },

    goToStep: (state, action: PayloadAction<number>) => {
      const targetStep = action.payload;
      if (targetStep >= 0 && targetStep < state.totalSteps) {
        state.currentStep = targetStep;
        state.analytics.stepTimes[targetStep] = Date.now();
      }
    },

    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
      state.isVisible = false;
      state.completedSteps.push(state.currentStep);

      // Persist completion status
      AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
        completed: true,
        completedAt: Date.now()
      })).catch((error) => {
        console.error('Failed to save onboarding completion status:', error);
      });
    },

    skipOnboarding: (state) => {
      state.hasSkippedOnboarding = true;
      state.isVisible = false;

      // Persist skip status
      AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({
        completed: true,
        skipped: true,
        skippedAt: Date.now()
      })).catch((error) => {
        console.error('Failed to save onboarding skip status:', error);
      });
    },

    hideOnboarding: (state) => {
      state.isVisible = false;
    },

    showOnboarding: (state) => {
      state.isVisible = true;
    },

    trackInteraction: (state, action: PayloadAction<Omit<OnboardingInteraction, 'timestamp'>>) => {
      const interaction: OnboardingInteraction = {
        ...action.payload,
        timestamp: Date.now()
      };
      state.analytics.interactions.push(interaction);
    },

    resetOnboarding: (state) => {
      Object.assign(state, initialState);

      // Clear persisted data
      AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY).catch((error) => {
        console.error('Failed to clear onboarding status:', error);
      });
    },

    loadOnboardingStatus: (state, action: PayloadAction<{ completed: boolean; skipped?: boolean }>) => {
      state.hasCompletedOnboarding = action.payload.completed;
      state.hasSkippedOnboarding = action.payload.skipped || false;
    }
  }
});

export const {
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
  loadOnboardingStatus
} = onboardingSlice.actions;

// Manual selectors to avoid circular dependency
export const selectCurrentStep = (state: any) => state.onboarding.currentStep;
export const selectTotalSteps = (state: any) => state.onboarding.totalSteps;
export const selectIsVisible = (state: any) => state.onboarding.isVisible;
export const selectHasCompletedOnboarding = (state: any) => state.onboarding.hasCompletedOnboarding;
export const selectHasSkippedOnboarding = (state: any) => state.onboarding.hasSkippedOnboarding;
export const selectCurrentStepData = (state: any) => ONBOARDING_STEPS[state.onboarding.currentStep];
export const selectProgress = (state: any) => (state.onboarding.currentStep + 1) / state.onboarding.totalSteps;
export const selectIsFirstStep = (state: any) => state.onboarding.currentStep === 0;
export const selectIsLastStep = (state: any) => state.onboarding.currentStep === state.onboarding.totalSteps - 1;
export const selectAnalytics = (state: any) => state.onboarding.analytics;
export const selectShouldShowOnboarding = (state: any) => !state.onboarding.hasCompletedOnboarding && !state.onboarding.hasSkippedOnboarding;

export default onboardingSlice.reducer;