// Development configuration for onboarding
export const DEV_ONBOARDING_CONFIG = {
  // Auto-reset onboarding on every app reload
  AUTO_RESET_ON_RELOAD: false,

  // Show dev controls overlay
  SHOW_DEV_CONTROLS: true,

  // Enable keyboard shortcuts
  ENABLE_SHORTCUTS: true,

  // Auto-start onboarding after reset
  AUTO_START_AFTER_RESET: true,

  // Show debug logs
  DEBUG_LOGS: true,
} as const;

// Helper to log debug information
export const devLog = (message: string, ...args: any[]) => {
  if (__DEV__ && DEV_ONBOARDING_CONFIG.DEBUG_LOGS) {
    console.log(`🔧 [Onboarding Dev]`, message, ...args);
  }
};