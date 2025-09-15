import React, { useCallback, useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal, Text } from 'react-native';
import { Colors } from '@/shared/config';
import { usePerformanceMonitor } from '@shared/hooks';
import { VirtualizedEmojiList } from './virtualized-emoji-list';

// Static background colors - no need for animation complexity
const BACKGROUND_COLORS = [
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
  useVirtualizedList?: boolean;
}

// Simplified color option - no animations for maximum performance
const ColorOption = React.memo<{
  color: string;
  isSelected: boolean;
  onPress: (color: string) => void;
}>(({ color, isSelected, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(color);
  }, [color, onPress]);

  return (
    <TouchableOpacity
      style={[
        styles.colorOption,
        { backgroundColor: color },
        isSelected && styles.selectedColorOption
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    />
  );
});

ColorOption.displayName = 'ColorOption';

export const AnimatedEmojiPicker = React.memo(({
  visible,
  selectedColor,
  onColorSelect,
  onEmojiSelect,
  onClose,
  useVirtualizedList = false
}: AnimatedEmojiPickerProps) => {
  usePerformanceMonitor('AnimatedEmojiPicker');

  // Minimal state for maximum performance
  const [localEmoji, setLocalEmoji] = useState('');
  const [showEmojiList, setShowEmojiList] = useState(false);

  // Simplified handlers - no complex animations
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Direct color selection - no animations
  const handleColorSelect = useCallback((color: string) => {
    onColorSelect(color);
  }, [onColorSelect]);

  // Direct emoji input - no debouncing
  const handleEmojiInput = useCallback((text: string) => {
    setLocalEmoji(text);
    if (text.length > 0) {
      onEmojiSelect(text);
    }
  }, [onEmojiSelect]);

  // Simple toggle handler
  const handleToggleEmojiList = useCallback(() => {
    setShowEmojiList(prev => !prev);
  }, []);

  // Simple emoji selection from list
  const handleEmojiFromList = useCallback((emoji: string) => {
    setLocalEmoji(emoji);
    onEmojiSelect(emoji);
    setShowEmojiList(false);
  }, [onEmojiSelect]);

  // Memoized color options - simplified
  const colorOptions = useMemo(() =>
    BACKGROUND_COLORS.map((color) => (
      <ColorOption
        key={color}
        color={color}
        isSelected={selectedColor === color}
        onPress={handleColorSelect}
      />
    ))
  , [selectedColor, handleColorSelect]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.emojiInputContainer}>
              <View style={styles.inputSection}>
                <TextInput
                  style={[styles.emojiInput, { backgroundColor: selectedColor }]}
                  onChangeText={handleEmojiInput}
                  value={localEmoji}
                  placeholder="😊"
                  autoFocus
                  maxLength={2}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (localEmoji.length > 0) {
                      onEmojiSelect(localEmoji);
                    }
                  }}
                />
                {useVirtualizedList && (
                  <TouchableOpacity
                    style={styles.emojiListToggle}
                    onPress={handleToggleEmojiList}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiListToggleText}>
                      {showEmojiList ? '⌨️' : '😀'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {useVirtualizedList && showEmojiList && (
                <View style={styles.emojiListContainer}>
                  <VirtualizedEmojiList onEmojiSelect={handleEmojiFromList} />
                </View>
              )}

              <View style={styles.colorPickerContainer}>
                {colorOptions}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
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
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    maxHeight: '80%',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  emojiInput: {
    fontSize: 48,
    textAlign: 'center',
    flex: 1,
    padding: 20,
    borderRadius: 12,
  },
  emojiListToggle: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
  },
  emojiListToggleText: {
    fontSize: 20,
  },
  emojiListContainer: {
    width: '100%',
    maxHeight: 200,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
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