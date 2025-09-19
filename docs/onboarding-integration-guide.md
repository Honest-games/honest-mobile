# Onboarding Integration Guide

## Quick Start

### 1. Add to Redux Store

Add the onboarding reducer to your store configuration:

```typescript
// shared/config/store/index.ts
import { onboardingSlice } from '@features/onboarding/model/slice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    onboarding: onboardingSlice.reducer,
  },
});
```

### 2. Add Route

Add the onboarding route to your navigation:

```typescript
// app/_layout.tsx or navigation setup
import { useOnboarding } from '@features/onboarding/hooks/useOnboarding';

export default function RootLayout() {
  const { shouldShowOnboarding } = useOnboarding();

  // Redirect to onboarding if needed
  if (shouldShowOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    // ... your main app layout
  );
}
```

### 3. Basic Implementation

```typescript
// app/onboarding.tsx (already created)
import React from 'react';
import { useRouter } from 'expo-router';
import { OnboardingContainer } from '@features/onboarding';
import { useOnboarding } from '@features/onboarding/hooks/useOnboarding';

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();

  const handleComplete = () => {
    completeOnboarding();
    router.replace('/(tabs)'); // Navigate to main app
  };

  return (
    <OnboardingContainer onComplete={handleComplete} />
  );
}
```

## Advanced Configuration

### Custom Step Content

Modify the steps configuration to customize content:

```typescript
// features/onboarding/config/steps.ts
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: 'Your Custom Title',
    subtitle: 'Your Custom Subtitle',
    description: 'Your custom description here...',
    illustration: 'welcome',
    primaryAction: 'Get Started',
    secondaryAction: 'Skip'
  },
  // ... more steps
];
```

### Custom Styling

Override styles using StyleSheet.create():

```typescript
// features/onboarding/ui/onboarding-screen/ui.tsx
const customStyles = StyleSheet.create({
  container: {
    backgroundColor: 'your-custom-color'
  },
  title: {
    fontSize: 32,
    color: 'your-brand-color'
  }
});
```

### Analytics Integration

Add analytics tracking to the onboarding flow:

```typescript
// features/onboarding/hooks/useOnboarding.ts
import { analytics } from '@shared/services/analytics';

export const useOnboarding = () => {
  const completeOnboarding = useCallback(() => {
    analytics.track('onboarding_completed', {
      steps_completed: totalSteps,
      time_spent: Date.now() - startTime
    });
    dispatch(markAsCompleted());
  }, [dispatch]);

  // ... rest of hook
};
```

## Component Usage

### Standalone Components

You can use individual components outside of the main flow:

```typescript
import { ProgressIndicator, NavigationControls } from '@features/onboarding/ui';

// Progress indicator
<ProgressIndicator
  currentStep={3}
  totalSteps={5}
  variant="dots"
/>

// Navigation controls
<NavigationControls
  currentStep={currentStep}
  totalSteps={totalSteps}
  primaryAction="Continue"
  secondaryAction="Back"
  canGoBack={true}
  onNext={() => console.log('next')}
  onPrevious={() => console.log('back')}
  onSkip={() => console.log('skip')}
  onComplete={() => console.log('complete')}
/>
```

### Custom Illustrations

Replace the default illustrations:

```typescript
// features/onboarding/ui/illustration/ui.tsx
const CustomWelcomeIllustration: React.FC = () => (
  <View style={styles.customContainer}>
    {/* Your custom illustration */}
    <YourSVGComponent />
  </View>
);

// Update the renderIllustration function
const renderIllustration = () => {
  switch (type) {
    case 'welcome':
      return <CustomWelcomeIllustration />;
    // ... other cases
  }
};
```

## Testing

### Unit Tests

```typescript
// __tests__/onboarding.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { OnboardingScreen } from '@features/onboarding/ui';

describe('OnboardingScreen', () => {
  it('should render correctly', () => {
    const mockProps = {
      step: mockStep,
      currentStepIndex: 0,
      totalSteps: 5,
      isAnimating: false,
      onNext: jest.fn(),
      onPrevious: jest.fn(),
      onSkip: jest.fn(),
      onComplete: jest.fn()
    };

    const { getByText } = render(<OnboardingScreen {...mockProps} />);
    expect(getByText(mockStep.title)).toBeTruthy();
  });
});
```

### Accessibility Testing

```typescript
// Test with screen reader
import { toHaveAccessibilityLabel } from '@testing-library/jest-native';

it('should have proper accessibility labels', () => {
  const { getByRole } = render(<NavigationControls {...mockProps} />);
  const nextButton = getByRole('button', { name: /next/i });
  expect(nextButton).toHaveAccessibilityLabel('Next step');
});
```

## Performance Optimization

### Preloading

Preload onboarding assets:

```typescript
// shared/services/preloader.ts
export const preloadOnboardingAssets = async () => {
  // Preload fonts
  await Font.loadAsync({
    'Poppins': require('@assets/fonts/Poppins-Regular.ttf'),
    'MakanHatiCyrillic': require('@assets/fonts/MakanHatiCyrillic.otf')
  });

  // Preload any images or animations
  const illustrations = [
    require('@assets/illustrations/welcome.png'),
    // ... other assets
  ];

  await Asset.loadAsync(illustrations);
};
```

### Memory Management

Monitor memory usage with large animations:

```typescript
// features/onboarding/ui/onboarding-container/ui.tsx
React.useEffect(() => {
  return () => {
    // Cleanup animations when component unmounts
    translateX.value = 0;
  };
}, []);
```

## Troubleshooting

### Common Issues

1. **Animation Performance**
   - Ensure `react-native-reanimated` is properly configured
   - Use `runOnJS` sparingly
   - Test on lower-end devices

2. **Font Loading**
   - Verify font files are included in bundle
   - Check font names match exactly
   - Add fallback fonts for iOS/Android

3. **Navigation Issues**
   - Ensure Redux store is properly configured
   - Check route definitions
   - Verify navigation dependencies

### Debug Mode

Enable debug logging:

```typescript
// features/onboarding/ui/onboarding-container/ui.tsx
const DEBUG = __DEV__;

const goToNextStep = useCallback(() => {
  if (DEBUG) {
    console.log(`Onboarding: Moving to step ${currentStepIndex + 1}`);
  }
  // ... rest of function
}, [currentStepIndex]);
```

## Best Practices

### 1. Content Strategy
- Keep text concise and scannable
- Use active voice
- Test with actual users
- Consider localization early

### 2. Performance
- Lazy load non-critical components
- Optimize image sizes
- Use React.memo() for static content
- Profile animation performance

### 3. Accessibility
- Test with VoiceOver/TalkBack
- Ensure keyboard navigation
- Maintain color contrast ratios
- Provide alternative text

### 4. Analytics
- Track step completion rates
- Monitor drop-off points
- A/B test different variations
- Measure time to completion

## Support

For questions or issues:
1. Check the documentation
2. Review existing components
3. Test on multiple devices
4. Consider accessibility implications
5. Follow FSD architecture patterns