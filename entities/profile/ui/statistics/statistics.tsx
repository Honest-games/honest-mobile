import { Colors } from '@/shared/config';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatisticsProps {
  totalRounds: number;
  totalQuestions: number;
  t: (key: string) => string;
}

export const Statistics = React.memo(({ totalRounds, totalQuestions, t }: StatisticsProps) => (
  <View style={styles.statsSection}>
    <Text style={styles.sectionTitle}>{t('statistics')}</Text>
    <View style={styles.statsGrid}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalRounds}</Text>
        <Text style={styles.statLabel}>{t('totalRounds')}</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalQuestions}</Text>
        <Text style={styles.statLabel}>{t('totalQuestions')}</Text>
      </View>
    </View>
  </View>
));

const styles = StyleSheet.create({
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.grey,
  },
}); 