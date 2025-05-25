import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IAchievement } from '@entities/achievement/model/types';
import { Colors } from '@/shared/config';

interface AchievementProps {
  item: IAchievement;
  t: (key: string) => string;
}

export const Achievement = React.memo(({ item, t }: AchievementProps) => (
  <View style={styles.achievementItem}>
    <MaterialCommunityIcons 
      name={item.icon as any} 
      size={24} 
      color={item.isUnlocked ? Colors.deepBlue : Colors.grey} 
    />
    <View style={styles.achievementInfo}>
      <Text style={styles.achievementTitle}>
        {t(`achievements_list.${item.id}.title`)}
      </Text>
      <Text style={styles.achievementDesc}>
        {t(`achievements_list.${item.id}.description`)}
      </Text>
      {item.progress && (
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(item.progress.current / item.progress.required) * 100}%` }
            ]} 
          />
        </View>
      )}
    </View>
  </View>
));

const styles = StyleSheet.create({
  achievementItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  achievementInfo: {
    marginLeft: 10,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 5,
  },
  achievementDesc: {
    fontSize: 14,
    color: Colors.grey,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.grey1,
    borderRadius: 2,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.deepBlue,
    borderRadius: 2,
  },
}); 