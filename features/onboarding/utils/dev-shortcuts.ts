import { AppDispatch } from '@shared/config/_providers/store';
import { resetOnboarding } from '../model/slice';

// Development shortcuts for onboarding control
export const setupDevShortcuts = (dispatch: AppDispatch) => {
  if (!__DEV__) return;

  // Listen for keyboard shortcuts in development
  if (typeof window !== 'undefined') {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + O to reset onboarding
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'O') {
        console.log('🔄 Resetting onboarding...');
        dispatch(resetOnboarding());
        alert('Onboarding has been reset! Reload the app to see it again.');
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Log available shortcuts
    console.log('🛠️ Dev Shortcuts Available:');
    console.log('  Ctrl/Cmd + Shift + O: Reset onboarding');

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }
};

// Quick function to reset onboarding programmatically
export const quickResetOnboarding = (dispatch: AppDispatch) => {
  if (__DEV__) {
    dispatch(resetOnboarding());
    console.log('✅ Onboarding reset complete');
  }
};