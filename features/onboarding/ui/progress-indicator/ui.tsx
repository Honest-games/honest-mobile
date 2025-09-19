import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Colors } from '@shared/config';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  variant?: 'dots' | 'bar';
  style?: ViewStyle;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  variant = 'dots',
  style
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming((current + 1) / total, {
      duration: 400
    });
  }, [current, total]);

  if (variant === 'bar') {
    const animatedBarStyle = useAnimatedStyle(() => {
      return {
        width: `${progress.value * 100}%`
      };
    });

    return (
      <View
        style={[styles.progressBarContainer, style]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel="Индикатор прогресса онбординга"
        accessibilityValue={{
          min: 0,
          max: total,
          now: current + 1,
          text: `Шаг ${current + 1} из ${total}`
        }}
      >
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, animatedBarStyle]} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.dotsContainer, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel="Индикатор прогресса онбординга"
      accessibilityValue={{
        min: 0,
        max: total,
        now: current + 1,
        text: `Шаг ${current + 1} из ${total}`
      }}
    >
      {Array.from({ length: total }, (_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const isActive = index <= current;
          const scale = withSpring(isActive ? 1.2 : 1, { damping: 15 });
          const opacity = withSpring(isActive ? 1 : 0.3, { damping: 15 });

          return {
            transform: [{ scale }],
            opacity,
            backgroundColor: isActive ? Colors.primary : Colors.lightGrey
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.lightGrey
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: Colors.lightGrey,
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2
  }
});