import { Label } from '@/shared/ui';
import { getLevelColor } from '@/features/converters/button-converters';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ILevelData } from '@/entities/level/model/types';

interface CardTopContentProps {
  level: ILevelData;
}

export const CardTopContent: React.FC<CardTopContentProps> = ({ level }) => {
  return (
    <View style={styles.topContent}>
      {!level ? null : (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Label
            levelBgColor={getLevelColor(level.ColorButton)}
            levelTitle={level.Name}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topContent: {
    justifyContent: 'center',
    width: '100%',
    height: 20
  }
}); 