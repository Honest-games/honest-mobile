import React, { useState, useRef, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@shared/config/styles/colors';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/features/hooks/useRedux';
import { updateProfile } from '@/entities/profile/model';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AvatarPickerBottomSheet } from '@/features/profile-edit/ui/avatar-picker-bottom-sheet';
import { selectProfile } from '@/entities/profile/model';
import { Statistics } from '@/entities/profile/ui/statistics';
import { AchievementsList } from '@/entities/achievement/ui/achievements-list';
import { AnimatedEmojiPicker } from '@shared/ui/emoji-picker';
import { useAppSelector } from '@/features/hooks/useRedux';
import { usePerformanceMonitor } from '@shared/hooks';

// Import the ProfileHeader feature
import { ProfileHeader } from '@/features/profile-header';

const ProfileScreen = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Performance monitoring for this component
  usePerformanceMonitor('ProfileScreen');

  // Use memoized selector for optimized performance
  const profile = useAppSelector(selectProfile);

  // Component-level state for emoji modal to prevent parent re-renders
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(Colors.beige);
  const [isEmojiInputVisible, setIsEmojiInputVisible] = useState(false);

  const avatarPickerRef = useRef<BottomSheetModal | null>(null);

  const handleAvatarPress = useCallback(() => {
    avatarPickerRef.current?.present();
  }, []);

  const handleSelectAvatar = useCallback((type: string, value?: string) => {
    if (type === 'photo' && value) {
      dispatch(updateProfile({
        avatarUri: value,
        emoji: undefined,
        backgroundColor: undefined
      }));
    } else if (type === 'emoji') {
      setIsEmojiInputVisible(true);
    }
  }, [dispatch]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    dispatch(updateProfile({
      avatarUri: undefined,
      avatarId: undefined,
      emoji: emoji,
      backgroundColor: selectedBackgroundColor
    }));
    setIsEmojiInputVisible(false);
  }, [dispatch, selectedBackgroundColor]);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedBackgroundColor(color);
  }, []);

  const toggleShowAllAchievements = useCallback(() => {
    setShowAllAchievements(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <ProfileHeader
            profile={profile}
            onAvatarPress={handleAvatarPress}
          />
        </View>

        <AchievementsList
          achievements={profile.achievements}
          showAllAchievements={showAllAchievements}
          onToggleShow={toggleShowAllAchievements}
          t={t}
        />

        <Statistics
          totalRounds={profile.stats.totalRounds}
          totalQuestions={profile.stats.totalQuestions}
          t={t}
        />

        <AvatarPickerBottomSheet
          bottomSheetModalRef={avatarPickerRef}
          onSelectAvatar={handleSelectAvatar}
          profile={profile}
        />

        <AnimatedEmojiPicker
          visible={isEmojiInputVisible}
          selectedColor={selectedBackgroundColor}
          onColorSelect={handleColorSelect}
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setIsEmojiInputVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: Platform.OS === "ios" ? -35 : 0,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
});

export { ProfileScreen };