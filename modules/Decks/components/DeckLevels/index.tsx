import React from "react";
import { StyleSheet, View } from "react-native";
import { ILevelData } from "@/services/types/types";
import styles from "./styles";
import { TooltipButton } from "..";

interface DeckLevelsProps {
  levels: ILevelData[];
  onButtonPress?: (level: ILevelData) => void;
  size?: "large" | "small";
  selectedLevelId: string | null;
  tooltipContent: string;
  tooltipVisible: boolean;
  onCloseTooltip: () => void;
}

export const DeckLevels: React.FC<DeckLevelsProps> = ({
  levels,
  onButtonPress,
  size,
  selectedLevelId,
  tooltipContent,
  tooltipVisible,
  onCloseTooltip,
}) => {
  return (
    <View style={styles.sectionButtons}>
      {levels.map((level) => (
        <TooltipButton
          key={level.ID}
          label={level.Name}
          bgColor={level.ColorButton}
          tooltipContent={level.Description || "простые вопросы, не копающие в глубину, например: “какая твоя утренняя рутина?”"}
          onPress={() => onButtonPress && onButtonPress(level)}
          size={size}
          isSelected={tooltipVisible && selectedLevelId === level.ID}
        />
      ))}
    </View>
  );
};

export default DeckLevels;
