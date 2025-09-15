import { Button } from "@/shared/ui/button";
import { ILevelData } from "@/entities/level";
import { StyleSheet, View } from "react-native";
import React from "react";
import { LevelInfo } from "@/entities/level/ui";

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
      gap: 10,
      paddingBottom: 16,
      paddingHorizontal: 16,
      borderRadius: 20,
      backgroundColor: "rgba(243, 236, 224, 0.3)",
    },
  });

  return (
    <View style={styles.sectionButtons}>
      <View >
        <LevelInfo levelInfo={"chooseLevel"} />
      </View>
      {levels.map((level) => (
        <Button
          isButtonPressed={isButtonPressed}
          key={level.id}
          title={level.name}
          onPress={onButtonPress && (() => onButtonPress(level))}
          color={"#919F67"}
          bgColor={level.color}
          size={size}
        />
      ))}
    </View>
  );
}; 