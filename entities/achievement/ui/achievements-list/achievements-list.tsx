import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IAchievement } from '@entities/achievement/model/types';
import { Achievement } from '../achievement';
import { Colors } from '@/shared/config';

interface AchievementsListProps {
  achievements: IAchievement[];
  showAllAchievements: boolean;
  onToggleShow: () => void;
  t: (key: string) => string;
}

export const AchievementsList = React.memo(({ 
  achievements, 
  showAllAchievements, 
  onToggleShow, 
  t 
}: AchievementsListProps) => {
  const visibleAchievements = showAllAchievements ? achievements : achievements.slice(0, 3);

  const renderAchievement = useCallback(({ item }: { item: IAchievement }) => (
    <Achievement item={item} t={t} />
  ), [t]);

  const keyExtractor = useCallback((item: IAchievement) => item.id, []);

  return (
    <View style={styles.achievementsSection}>
      <Text style={styles.sectionTitle}>{t('achievements')}</Text>
      <FlatList
        data={visibleAchievements}
        renderItem={renderAchievement}
        keyExtractor={keyExtractor}
        scrollEnabled={false}
      />
      {achievements.length > 3 && (
        <TouchableOpacity 
          style={styles.showMoreButton}
          onPress={onToggleShow}
        >
          <Text style={styles.showMoreText}>
            {showAllAchievements ? t('showLess') : t('showMore')}
          </Text>
          <MaterialCommunityIcons 
            name={showAllAchievements ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color={Colors.deepBlue}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  achievementsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 15,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10,
  },
  showMoreText: {
    color: Colors.deepBlue,
    fontSize: 16,
    marginRight: 5,
  },
}); 