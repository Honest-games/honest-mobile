import React from "react";
import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from "@/shared/config";


const { width } = Dimensions.get('window');

interface LevelInfoProps {
  levelInfo: string;
  style?: ViewStyle;
}

export const LevelInfo: React.FC<LevelInfoProps> = ({ levelInfo, style }) => {
  const { t } = useTranslation();
  
  return (
    <View style={[styles.levelsInfo, style]}>
      <Text style={styles.levelsInfoText}>{t(levelInfo)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  levelsInfo: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  levelsInfoText: {
    color: Colors.lightGrey,
    fontSize: 12,
    fontWeight: '400'
  }
}); 