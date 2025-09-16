import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@shared/config/styles/colors";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/features/hooks/useRedux";
import { updateProfile, resetProgress } from "@/entities/profile/model";
import { resetDeckProgress } from "@/entities/deck/model/slice";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { AvatarPickerBottomSheet } from "@/features/profile-edit/ui/avatar-picker-bottom-sheet";
import { selectProfile } from "@/entities/profile/model";
import { Statistics } from "@/entities/profile/ui/statistics";
import { AchievementsList } from "@/entities/achievement/ui/achievements-list";
import { AnimatedEmojiPicker } from "@shared/ui/emoji-picker";
import { useAppSelector } from "@/features/hooks/useRedux";
import { saveProfile } from "@shared/lib";
import { usePerformanceMonitor } from "@shared/hooks";
import { Button } from "@shared/ui/button";

// Import the ProfileHeader feature
import { ProfileHeader } from "@/features/profile-header";

const ProfileScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // usePerformanceMonitor('ProfileScreen');

  // Use Redux selector for profile updates - force re-render on stats changes
  const profile = useAppSelector(selectProfile);
  const stats = useAppSelector((state) => state.profile.stats);

  // Force re-render when stats change
  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, [stats.totalQuestions, stats.totalRounds]);

  // Component-level state for emoji modal to prevent parent re-renders
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(Colors.beige);
  const [isEmojiInputVisible, setIsEmojiInputVisible] = useState(false);

  // Use profile directly without memoization for real-time updates
  const profileData = profile;

  const avatarPickerRef = useRef<BottomSheetModal | null>(null);

  const handleAvatarPress = useCallback(() => {
    avatarPickerRef.current?.present();
  }, []);

  const handleSelectAvatar = useCallback(
    async (type: string, value?: string) => {
      if (type === "photo" && value) {
        const updatedProfile = {
          ...profile,
          avatarUri: value,
          emoji: undefined,
          backgroundColor: undefined,
        };
        dispatch(updateProfile(updatedProfile));
        // Persist to AsyncStorage immediately for better UX
        await saveProfile(updatedProfile);
      } else if (type === "emoji") {
        setIsEmojiInputVisible(true);
      }
    },
    [dispatch, profile],
  );

  const handleEmojiSelect = useCallback(
    async (emoji: string) => {
      const updatedProfile = {
        ...profile,
        avatarUri: undefined,
        emoji: emoji,
        backgroundColor: selectedBackgroundColor,
      };
      dispatch(updateProfile(updatedProfile));
      // Persist to AsyncStorage immediately
      await saveProfile(updatedProfile);
      setIsEmojiInputVisible(false);
    },
    [dispatch, selectedBackgroundColor, profile],
  );

  const handleColorSelect = useCallback((color: string) => {
    setSelectedBackgroundColor(color);
  }, []);

  // Persist profile name changes
  const handleNameChange = useCallback(
    async (name: string) => {
      const updatedProfile = { ...profile, name };
      dispatch(updateProfile(updatedProfile));
      await saveProfile(updatedProfile);
    },
    [dispatch, profile],
  );

  const toggleShowAllAchievements = useCallback(() => {
    setShowAllAchievements((prev) => !prev);
  }, []);

  const handleResetAchievements = useCallback(() => {
    dispatch(resetProgress());
    dispatch(resetDeckProgress());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <ProfileHeader profile={profileData} onAvatarPress={handleAvatarPress} onNameChange={handleNameChange} />
        </View>

        <AchievementsList
          achievements={profileData.achievements}
          showAllAchievements={showAllAchievements}
          onToggleShow={toggleShowAllAchievements}
          t={t}
        />

        <Statistics totalRounds={stats.totalRounds} totalQuestions={stats.totalQuestions} t={t} />

        {__DEV__ && (
          <View style={styles.testSection}>
            <Button
              title="🔄 Сбросить достижения (тест)"
              onPress={handleResetAchievements}
              size="large"
              color={Colors.white}
              bgColor="255,75,75"
              outline={false}
            />
          </View>
        )}

        <AvatarPickerBottomSheet bottomSheetModalRef={avatarPickerRef} onSelectAvatar={handleSelectAvatar} profile={profileData} />

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
};

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
    alignItems: "center",
    marginBottom: 30,
  },
  testSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});

export { ProfileScreen };
