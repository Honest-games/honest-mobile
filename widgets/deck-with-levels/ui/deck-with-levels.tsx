import React from "react";
import { View } from "react-native";
import { ILevelData } from "@/services/types/types";
import styles from "./styles";
import { TooltipButton } from "@/widgets/deck-list/ui/tooltip-button";

interface DeckWithLevelsProps {
  levels: ILevelData[];
  onButtonPress?: (level: ILevelData) => void;
  size?: "large" | "small";
  selectedLevelId: string | null;
  tooltipContent: string;
  tooltipVisible: boolean;
  onCloseTooltip: () => void;
}

export const DeckWithLevels: React.FC<DeckWithLevelsProps> = ({
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
          tooltipContent={level.description || ''}
          onPress={() => onButtonPress && onButtonPress(level)}
          size={size}
          isSelected={tooltipVisible && selectedLevelId === level.ID}
        />
      ))}
    </View>
  );
};

export default DeckWithLevels;
