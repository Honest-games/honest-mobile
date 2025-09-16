import { useCallback, useRef } from 'react';
import {
  useSharedValue,
  withTiming,
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
  triggerSwipeAnimation: (direction?: number, onComplete?: () => void) => void;
  getNextDirection: () => number;
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

  const getNextDirection = useCallback(() => {
    return currentDirection.value;
  }, [currentDirection]);

  const triggerSwipeAnimation = useCallback((
    direction?: number,
    onComplete?: () => void
  ) => {
    'worklet';

    // Don't start new animation if one is already running
    if (isAnimating.value) {
      return;
    }

    // Use provided direction or current alternating direction
    const animationDirection = direction !== undefined ? direction : currentDirection.value;

    // Store callback
    if (onComplete) {
      pendingCallback.current = onComplete;
    }

    // Mark animation as started
    isAnimating.value = true;

    // Start animation
    swipeX.value = withTiming(
      animationDirection * swipeDistance,
      { duration },
      (finished) => {
        'worklet';
        if (finished) {
          onAnimationComplete();
        }
      }
    );

    swipeY.value = withTiming(0, { duration });
  }, [duration, swipeDistance, isAnimating, swipeX, swipeY, onAnimationComplete, currentDirection]);

  return {
    swipeX,
    swipeY,
    isAnimating,
    triggerSwipeAnimation,
    getNextDirection,
    resetAnimation,
  };
};