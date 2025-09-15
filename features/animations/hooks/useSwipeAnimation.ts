import { useCallback, useRef } from 'react';
import {
  useSharedValue,
  withTiming,
  runOnJS,
  SharedValue
} from 'react-native-reanimated';

export interface SwipeAnimationConfig {
  duration?: number;
  swipeDistance?: number;
}

export interface UseSwipeAnimationReturn {
  swipeX: SharedValue<number>;
  swipeY: SharedValue<number>;
  isAnimating: SharedValue<boolean>;
  triggerSwipeAnimation: (direction: number, onComplete?: () => void) => void;
  resetAnimation: () => void;
}

export const useSwipeAnimation = (
  config: SwipeAnimationConfig = {}
): UseSwipeAnimationReturn => {
  const { duration = 500, swipeDistance = 500 } = config;

  const swipeX = useSharedValue(0);
  const swipeY = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const currentDirection = useSharedValue(-1);
  const pendingCallback = useRef<(() => void) | null>(null);

  const executeCallback = useCallback(() => {
    if (pendingCallback.current) {
      const callback = pendingCallback.current;
      pendingCallback.current = null;
      callback();
    }
  }, []);

  const resetAnimation = useCallback(() => {
    'worklet';
    swipeX.value = 0;
    swipeY.value = 0;
    isAnimating.value = false;
  }, [swipeX, swipeY, isAnimating]);

  const onAnimationComplete = useCallback(() => {
    'worklet';
    // Reset animation values
    swipeX.value = 0;
    swipeY.value = 0;

    // Toggle direction for next animation
    currentDirection.value = -currentDirection.value;

    // Mark animation as complete
    isAnimating.value = false;

    // Execute callback on JS thread
    if (pendingCallback.current) {
      runOnJS(executeCallback)();
    }
  }, [swipeX, swipeY, isAnimating, executeCallback]);

  const triggerSwipeAnimation = useCallback((
    direction: number = currentDirection.value,
    onComplete?: () => void
  ) => {
    'worklet';

    // Don't start new animation if one is already running
    if (isAnimating.value) {
      return;
    }

    // Store callback
    if (onComplete) {
      pendingCallback.current = onComplete;
    }

    // Mark animation as started
    isAnimating.value = true;

    // Start animation
    swipeX.value = withTiming(
      direction * swipeDistance,
      { duration },
      (finished) => {
        'worklet';
        if (finished) {
          onAnimationComplete();
        }
      }
    );

    swipeY.value = withTiming(0, { duration });
  }, [duration, swipeDistance, isAnimating, swipeX, swipeY, onAnimationComplete]);

  return {
    swipeX,
    swipeY,
    isAnimating,
    triggerSwipeAnimation,
    resetAnimation,
  };
};