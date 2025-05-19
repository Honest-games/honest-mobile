import { Button } from "@/UI";
import { ILevelData } from "@/services/types/types";
import { StyleSheet, View } from "react-native";
import React from "react";
import { LevelInfo } from "@/UI/LevelInfo";

interface LevelButtonsProps {
  levels: ILevelData[];
  onButtonPress?: (level: ILevelData) => void;
  size?: "large" | "small";
  isButtonPressed?: boolean;
}

export const LevelButtons: React.FC<LevelButtonsProps> = ({ levels, onButtonPress, size, isButtonPressed }) => {
  const styles = StyleSheet.create({
    sectionButtons: {
      alignItems: "center",
      flexDirection: "column",
      width: "100%",
      gap: 12,
      borderRadius: 20,
      backgroundColor: "rgba(243, 236, 224, 0.3)",
    },
  });

  return (
    <View style={styles.sectionButtons}>
      <View style={{ marginTop: 12 }}>
        <LevelInfo levelInfo={"chooseLevel"} />
      </View>
      {levels.map((level) => (
        <Button
          isButtonPressed={isButtonPressed}
          key={level.ID}
          title={level.Name}
          onPress={onButtonPress && (() => onButtonPress(level))}
          color={"#919F67"}
          bgColor={level.ColorButton}
          size={size}
        />
      ))}
    </View>
  );
};
