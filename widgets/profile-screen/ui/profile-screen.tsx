import React, { useState, useRef, useCallback, useMemo } from 'react';
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
import { saveProfile } from '@shared/lib';
import { usePerformanceMonitor } from '@shared/hooks';

// Import the ProfileHeader feature
import { ProfileHeader } from '@/features/profile-header';

const ProfileScreen = React.memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  usePerformanceMonitor('ProfileScreen');

  // Use memoized selector for optimized performance
  const profile = useAppSelector(selectProfile);

  // Component-level state for emoji modal to prevent parent re-renders
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(Colors.beige);
  const [isEmojiInputVisible, setIsEmojiInputVisible] = useState(false);

  // Simplified profile memoization
  const memoizedProfile = useMemo(() => profile, [profile.id, profile.name, profile.emoji, profile.avatarUri, profile.backgroundColor]);

  const avatarPickerRef = useRef<BottomSheetModal | null>(null);

  const handleAvatarPress = useCallback(() => {
    avatarPickerRef.current?.present();
  }, []);

  const handleSelectAvatar = useCallback(async (type: string, value?: string) => {
    if (type === 'photo' && value) {
      const updatedProfile = {
        ...profile,
        avatarUri: value,
        emoji: undefined,
        backgroundColor: undefined
      };
      dispatch(updateProfile(updatedProfile));
      // Persist to AsyncStorage immediately for better UX
      await saveProfile(updatedProfile);
    } else if (type === 'emoji') {
      setIsEmojiInputVisible(true);
    }
  }, [dispatch, profile]);

  const handleEmojiSelect = useCallback(async (emoji: string) => {
    const updatedProfile = {
      ...profile,
      avatarUri: undefined,
      emoji: emoji,
      backgroundColor: selectedBackgroundColor
    };
    dispatch(updateProfile(updatedProfile));
    // Persist to AsyncStorage immediately
    await saveProfile(updatedProfile);
    setIsEmojiInputVisible(false);
  }, [dispatch, selectedBackgroundColor, profile]);

  const handleColorSelect = useCallback((color: string) => {
    setSelectedBackgroundColor(color);
  }, []);

  // Persist profile name changes
  const handleNameChange = useCallback(async (name: string) => {
    const updatedProfile = { ...profile, name };
    dispatch(updateProfile(updatedProfile));
    await saveProfile(updatedProfile);
  }, [dispatch, profile]);

  const toggleShowAllAchievements = useCallback(() => {
    setShowAllAchievements(prev => !prev);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <ProfileHeader
            profile={memoizedProfile}
            onAvatarPress={handleAvatarPress}
            onNameChange={handleNameChange}
          />
        </View>

        <AchievementsList
          achievements={memoizedProfile.achievements}
          showAllAchievements={showAllAchievements}
          onToggleShow={toggleShowAllAchievements}
          t={t}
        />

        <Statistics
          totalRounds={memoizedProfile.stats.totalRounds}
          totalQuestions={memoizedProfile.stats.totalQuestions}
          t={t}
        />

        <AvatarPickerBottomSheet
          bottomSheetModalRef={avatarPickerRef}
          onSelectAvatar={handleSelectAvatar}
          profile={memoizedProfile}
        />

        <AnimatedEmojiPicker
          visible={isEmojiInputVisible}
          selectedColor={selectedBackgroundColor}
          onColorSelect={handleColorSelect}
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setIsEmojiInputVisible(false)}
          useVirtualizedList={true}
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