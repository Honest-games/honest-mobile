import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { OnboardingContainer } from '@/features/onboarding/ui/onboarding-container';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';

export default function OnboardingScreen() {
  const router = useRouter();
  const { start, hasCompletedOnboarding, hasSkippedOnboarding } = useOnboarding();
  const [hasStarted, setHasStarted] = React.useState(false);

  // If user has already completed onboarding, redirect to main app
  React.useEffect(() => {
    if (hasCompletedOnboarding || hasSkippedOnboarding) {
      router.replace('/(tabs)');
      return;
    }

    // Start the onboarding process only once
    if (!hasStarted) {
      start();
      setHasStarted(true);
    }
  }, [hasCompletedOnboarding, hasSkippedOnboarding, start, router, hasStarted]);

  // Don't render anything if we should redirect
  if (hasCompletedOnboarding || hasSkippedOnboarding) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
          presentation: 'fullScreenModal',
        }}
      />
      <OnboardingContainer />
    </>
  );
}