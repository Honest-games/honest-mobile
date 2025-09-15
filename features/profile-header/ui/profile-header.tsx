import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@shared/config/styles/colors';
import { AnimatedAvatar } from './animated-avatar';
import { selectProfileDisplayName } from '@/entities/profile/model';
import { useAppSelector } from '@/features/hooks/useRedux';
import { ProfileHeaderData } from '../model/types';

interface ProfileHeaderProps {
  profile: ProfileHeaderData;
  onAvatarPress: () => void;
}

export const ProfileHeader = React.memo(({ profile, onAvatarPress }: ProfileHeaderProps) => {
  const { t } = useTranslation();

  // Use memoized selector for display name
  const displayName = useAppSelector(selectProfileDisplayName);

  return (
    <View style={styles.container}>
      <AnimatedAvatar profile={profile} onPress={onAvatarPress} />
      <View style={styles.profileInfo}>
        <Text style={styles.name}>{displayName}</Text>
      </View>
    </View>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepGray,
  },
});