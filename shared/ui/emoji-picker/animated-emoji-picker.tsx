import React, { useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Colors } from '@/shared/config';

const backgroundColors = [
  Colors.beige,
  Colors.dimBlue,
  '#E8F5E9',
  '#FCE4EC',
  '#F3E5F5',
  '#FFF9C4'
] as const;

interface AnimatedEmojiPickerProps {
  visible: boolean;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export const AnimatedEmojiPicker = React.memo(({
  visible,
  selectedColor,
  onColorSelect,
  onEmojiSelect,
  onClose
}: AnimatedEmojiPickerProps) => {
  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      // Entrance animation
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      // Exit animation
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(300, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 150 });
    }
  }, [visible]);

  const handleClose = () => {
    // Animate out before closing
    opacity.value = withTiming(0, { duration: 150 });
    translateY.value = withTiming(300, { duration: 200 });
    scale.value = withTiming(0.8, { duration: 150 }, () => {
      runOnJS(onClose)();
    });
  };

  const handleColorSelect = (color: string) => {
    // Animate color selection
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });
    runOnJS(onColorSelect)(color);
  };

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const scaleInterpolated = interpolate(
      scale.value,
      [0.8, 1],
      [0.8, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY: translateY.value },
        { scale: scaleInterpolated }
      ],
    };
  });

  const colorOptionsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View style={[styles.emojiInputContainer, containerAnimatedStyle]}>
              <TextInput
                style={[styles.emojiInput, { backgroundColor: selectedColor }]}
                onChangeText={onEmojiSelect}
                placeholder="😊"
                autoFocus
              />
              <Animated.View style={[styles.colorPickerContainer, colorOptionsAnimatedStyle]}>
                {backgroundColors.map((color, index) => (
                  <TouchableOpacity
                    key={`${color}-${index}`}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption
                    ]}
                    onPress={() => handleColorSelect(color)}
                  />
                ))}
              </Animated.View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

AnimatedEmojiPicker.displayName = 'AnimatedEmojiPicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  emojiInputContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  emojiInput: {
    fontSize: 48,
    textAlign: 'center',
    width: '100%',
    padding: 20,
    borderRadius: 12,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: Colors.deepBlue,
  },
});