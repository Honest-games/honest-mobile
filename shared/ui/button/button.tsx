import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getLevelColor } from '@/features/converters/button-converters';
import { Colors } from '@/shared/config';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  size?: 'large' | 'small';
  color: string;
  isButtonPressed?: boolean;
  bgColor: string;
  outline?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { title, onPress, size, isButtonPressed, bgColor, outline } = props;

  const levelBgColor = getLevelColor(bgColor);

  let height = size === 'large' ? 54 : 33;
  const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      height: height,
      width: size === 'large' ? '100%' : 'auto',
      backgroundColor: outline ? 'transparent' : levelBgColor ? levelBgColor : Colors.deepBlue,
      borderWidth: outline ? 1 : 0,
      borderColor: outline ? levelBgColor || Colors.deepBlue : 'transparent',
      paddingHorizontal: 16,
    },
    text: {
      color: outline ? (levelBgColor || Colors.deepBlue) : 'white',
      fontSize: size === 'large' ? 20 : 16,
    },
  });

  return (
    <TouchableOpacity
      disabled={isButtonPressed}
      onPress={onPress}
      style={[styles.button]}
    >
      <Text style={styles.text}>{title.toLowerCase()}</Text>
    </TouchableOpacity>
  );
}; 