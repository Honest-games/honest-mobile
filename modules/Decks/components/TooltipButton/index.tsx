import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getLevelColor, getTextColor } from "@/features/converters/button-converters";
import styles from "./styles";
import Button from "../Button";

interface TooltipButtonProps {
  label: string;
  tooltipContent: string;
  bgColor: string;
  size?: "large" | "small";
  onPress: () => void;
  isSelected: boolean;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({ label, tooltipContent, bgColor, size, onPress, isSelected }) => {
    const levelBgColor = getLevelColor(bgColor);
    const shouldShowTooltip = isSelected && tooltipContent.trim() !== '';

  return (
    <View style={styles.container}>
      {shouldShowTooltip && (
        <View style={[styles.tooltip, { backgroundColor: levelBgColor }]}>
          <Text style={[styles.tooltipText, { color: getTextColor(bgColor) }]}>{tooltipContent}</Text>
        </View>
      )}
      <Button
        onPress={onPress}
        size={size}
        outline={!isSelected}
        title={label}
        color={bgColor}
        bgColor={bgColor}
      />
    </View>
  );
};

export default TooltipButton;
