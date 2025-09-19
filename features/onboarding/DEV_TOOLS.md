# Onboarding Development Tools

## Overview
Development tools for testing and controlling the onboarding flow during development.

## Features

### 1. Dev Controls Overlay
- **Location**: Top-right corner of the app (development mode only)
- **Features**:
  - View current onboarding status
  - Reset onboarding state
  - Start onboarding manually
  - Jump to specific onboarding steps

### 2. Auto-Reset on Reload
- **Configuration**: `DEV_ONBOARDING_CONFIG.AUTO_RESET_ON_RELOAD`
- **Default**: `false` (disabled)
- **Usage**: Set to `true` to automatically reset onboarding on every app reload

### 3. Configuration
Edit `/features/onboarding/config/dev-config.ts`:

```typescript
export const DEV_ONBOARDING_CONFIG = {
  AUTO_RESET_ON_RELOAD: false,     // Auto-reset on app reload
  SHOW_DEV_CONTROLS: true,         // Show dev controls overlay
  ENABLE_SHORTCUTS: true,          // Enable keyboard shortcuts
  AUTO_START_AFTER_RESET: true,    // Auto-start after reset
  DEBUG_LOGS: true,                // Show debug logs
};
```

## Quick Setup for Development

### Option 1: Manual Control (Recommended)
1. Keep `AUTO_RESET_ON_RELOAD: false`
2. Use the dev controls overlay to reset/test onboarding
3. Click "Reset Onboarding" → Reload app to see onboarding

### Option 2: Auto-Reset on Every Reload
1. Set `AUTO_RESET_ON_RELOAD: true` in dev-config.ts
2. Every app reload will show onboarding
3. Good for rapid iteration

## Usage Examples

### Testing Specific Steps
1. Open app in development mode
2. Look for dev controls in top-right corner
3. Click numbered buttons (1-5) to jump to specific steps

### Resetting Onboarding
1. Click "Reset Onboarding" in dev controls
2. Or modify `AUTO_RESET_ON_RELOAD` config
3. Reload app to see onboarding again

### Testing Completion Flow
1. Go through onboarding normally
2. Use dev controls to verify completed state
3. Reset and test skip functionality

## Development Workflow

1. **Initial Setup**: Enable dev controls in config
2. **Testing**: Use overlay to navigate between states
3. **Iteration**: Reset when needed, jump to specific steps
4. **Production**: All dev tools are automatically disabled

## Notes

- All dev tools are automatically disabled in production builds
- Dev controls overlay only appears when `__DEV__` is true
- Debug logs help track onboarding state changes
- Reset clears AsyncStorage and Redux state