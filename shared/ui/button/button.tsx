import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getLevelColor } from '@/features/converters/button-converters';
import { Colors } from '@/shared/config';
import Color from 'color';

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

  // Проверяем, содержит ли bgColor запятые (формат r,g,b для getLevelColor)
  const isLevelFormat = bgColor && bgColor.includes(',');

  // Используем getLevelColor только для формата "r,g,b", иначе используем bgColor напрямую
  let backgroundColor;
  try {
    backgroundColor = isLevelFormat ? getLevelColor(bgColor) : bgColor;
    if (!backgroundColor) {
      backgroundColor = Colors.deepBlue;
    }
  } catch (error) {
    console.error('Error processing bgColor:', error);
    backgroundColor = Colors.deepBlue;
  }

	const textColor = Color(backgroundColor).darken(0.45).toString();
  
  let height = size === 'large' ? 54 : 33;
  const styles = StyleSheet.create({
    button: {
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			borderRadius: 20,
			backgroundColor: outline ? 'transparent' : backgroundColor,
			borderWidth: outline ? 1 : 0,
			borderColor: outline ? backgroundColor : 'transparent',
			height: height,
			width: size === 'large' ? '100%' : 196
		},
		text: {
			color: textColor,
			fontSize: size === 'large' ? 20 : 16
		}
  });

  return (
    <TouchableOpacity
      disabled={isButtonPressed}
      onPress={onPress}
      style={[styles.button]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}; 