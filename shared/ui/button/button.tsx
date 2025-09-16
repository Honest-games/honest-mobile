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

  const levelBgColor = getLevelColor(bgColor);
  const backgroundColor = levelBgColor || Colors.deepBlue
	const textColor = Color(backgroundColor).darken(0.3).toString()
  
  let height = size === 'large' ? 54 : 33;
  const styles = StyleSheet.create({
    button: {
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			borderRadius: 8,
			backgroundColor: outline ? 'transparent' : levelBgColor || Colors.deepBlue,
			borderWidth: outline ? 1 : 0,
			borderColor: outline ? levelBgColor || Colors.deepBlue : 'transparent',
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