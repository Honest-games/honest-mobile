import { Colors } from '@/shared/config';
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const backgroundColors = [
  Colors.beige,
  Colors.dimBlue,
  '#E8F5E9',
  '#FCE4EC',
  '#F3E5F5',
  '#FFF9C4'
] as const;

interface EmojiPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker = React.memo(({ 
  selectedColor, 
  onColorSelect, 
  onEmojiSelect, 
  onClose 
}: EmojiPickerProps) => (
  <TouchableWithoutFeedback onPress={onClose}>
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
        <View style={styles.emojiInputContainer}>
          <TextInput
            style={[styles.emojiInput, { backgroundColor: selectedColor }]}
            onChangeText={onEmojiSelect}
            placeholder="😊"
            autoFocus
          />
          <View style={styles.colorPickerContainer}>
            {backgroundColors.map((color, index) => (
              <TouchableOpacity
                key={`${color}-${index}`}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption
                ]}
                onPress={() => onColorSelect(color)}
              />
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
));

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