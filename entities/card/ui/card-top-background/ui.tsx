import { OutlineLabel } from "@/shared/ui";
import { getLevelColor } from "@/features/converters/button-converters";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ILevelData } from "@/entities/level/model/types";

interface CardTopBackgroundProps {
  level: ILevelData;
}

export const CardTopBackground: React.FC<CardTopBackgroundProps> = ({ level }) => {
  return (
    <View style={styles.topBackground}>
      {!level ? null : <OutlineLabel levelBgColor={getLevelColor(level.color)} levelTitle={level.name} xw />}
    </View>
  );
};

const styles = StyleSheet.create({
  topBackground: {
    position: "absolute",
    top: 10,
    left: 10,

    backgroundColor: "white",
    borderRadius: 20,

    justifyContent: "center",
  },
});
