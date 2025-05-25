import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getLevelColor, getTextColor } from "@/features/converters/button-converters";
import { Button } from "@/shared/ui/button";

interface TooltipButtonProps {
  label: string;
  tooltipContent: string;
  bgColor: string;
  size?: "large" | "small";
  onPress: () => void;
  isSelected: boolean;
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({ 
  label, 
  tooltipContent, 
  bgColor, 
  size, 
  onPress, 
  isSelected 
}) => {
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
  },
  tooltip: {
    position: "absolute",
    bottom: "130%",
    padding: 10,
    borderRadius: 8,
    maxWidth: 200,
    elevation: 5,
    zIndex: 1000,
  },
  tooltipText: {
    fontSize: 14,
    textAlign: "center",
  },
}); 