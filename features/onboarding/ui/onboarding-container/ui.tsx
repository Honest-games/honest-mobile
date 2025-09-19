import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming
} from 'react-native-reanimated';
import { useOnboarding } from '../../hooks/useOnboarding';
import { OnboardingScreen } from '../onboarding-screen';
import { ProgressIndicator } from '../progress-indicator';
import { NavigationControls } from '../navigation-controls';
import { Colors } from '@shared/config';
import { ONBOARDING_STEPS } from '../../model/types';

const { width: screenWidth } = Dimensions.get('window');

export const OnboardingContainer: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    currentStepData,
    isFirstStep,
    isLastStep,
    next,
    previous,
    skip,
    complete
  } = useOnboarding();


  const translateX = useSharedValue(0);
  const context = useSharedValue({ startX: 0 });

  // Animate to current step when currentStep changes
  useEffect(() => {
    translateX.value = withTiming(-currentStep * screenWidth, { duration: 300 });
  }, [currentStep]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      context.value = { startX: translateX.value };
    })
    .onUpdate((event) => {
      const translation = event.translationX;
      const currentOffset = -currentStep * screenWidth;

      // Ограничиваем движение на крайних экранах
      if (isFirstStep && translation > 0) {
        // На первом экране запрещаем свайп вправо
        translateX.value = currentOffset + translation * 0.1; // Небольшое сопротивление
      } else if (isLastStep && translation < 0) {
        // На последнем экране запрещаем свайп влево
        translateX.value = currentOffset + translation * 0.1; // Небольшое сопротивление
      } else {
        // Обычное движение на других экранах
        translateX.value = context.value.startX + translation;
      }
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const translation = event.translationX;
      const threshold = screenWidth * 0.25;

      // Determine if swipe is significant enough
      const shouldGoNext = (translation < -threshold || velocity < -800) && !isLastStep;
      const shouldGoPrevious = (translation > threshold || velocity > 800) && !isFirstStep;

      if (shouldGoNext) {
        runOnJS(next)();
      } else if (shouldGoPrevious) {
        runOnJS(previous)();
      } else {
        translateX.value = withTiming(-currentStep * screenWidth, { duration: 300 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });

  return (
    <View style={styles.container}>
      <ProgressIndicator
        current={currentStep}
        total={totalSteps}
        style={styles.progressIndicator}
      />

      <GestureHandlerRootView style={styles.gestureContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.screensContainer, animatedStyle]}>
            {ONBOARDING_STEPS.map((step, index) => (
              <View key={step.id} style={styles.screenWrapper}>
                <OnboardingScreen step={step} />
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>

      <NavigationControls
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onNext={next}
        onPrevious={previous}
        onSkip={skip}
        onComplete={complete}
        style={styles.navigationControls}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressIndicator: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  gestureContainer: {
    flex: 1,
  },
  screensContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  screenWrapper: {
    width: screenWidth,
    height: '100%',
  },
  navigationControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
});