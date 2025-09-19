import React from 'react';
import { Text, TextProps, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@shared/config';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Detect device size
const isSmallDevice = screenWidth < 375 || screenHeight < 667;
const isLargeDevice = screenWidth > 414 || screenHeight > 896;

interface ResponsiveTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  family?: 'Poppins' | 'MakanHatiCyrillic';
  weight?: '400' | '500' | '600' | '700';
  align?: 'left' | 'center' | 'right';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  variant = 'body',
  size = 'medium',
  color = Colors.text,
  family = 'Poppins',
  weight = '400',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const getResponsiveSize = () => {
    const sizeMap = {
      title: {
        small: isSmallDevice ? 24 : isLargeDevice ? 32 : 28,
        medium: isSmallDevice ? 26 : isLargeDevice ? 34 : 30,
        large: isSmallDevice ? 28 : isLargeDevice ? 36 : 32
      },
      subtitle: {
        small: isSmallDevice ? 16 : isLargeDevice ? 20 : 18,
        medium: isSmallDevice ? 18 : isLargeDevice ? 22 : 20,
        large: isSmallDevice ? 20 : isLargeDevice ? 24 : 22
      },
      body: {
        small: isSmallDevice ? 14 : isLargeDevice ? 18 : 16,
        medium: isSmallDevice ? 16 : isLargeDevice ? 20 : 18,
        large: isSmallDevice ? 18 : isLargeDevice ? 22 : 20
      },
      caption: {
        small: isSmallDevice ? 12 : isLargeDevice ? 16 : 14,
        medium: isSmallDevice ? 14 : isLargeDevice ? 18 : 16,
        large: isSmallDevice ? 16 : isLargeDevice ? 20 : 18
      }
    };

    return sizeMap[variant][size];
  };

  const getLineHeight = () => {
    const fontSize = getResponsiveSize();
    return fontSize * 1.4; // 1.4 ratio for better readability
  };

  const responsiveStyle = StyleSheet.create({
    text: {
      fontSize: getResponsiveSize(),
      lineHeight: getLineHeight(),
      color,
      fontFamily: family,
      fontWeight: weight,
      textAlign: align
    }
  });

  return (
    <Text
      style={[responsiveStyle.text, style]}
      {...props}
    >
      {children}
    </Text>
  );
};