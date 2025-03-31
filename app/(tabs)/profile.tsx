import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Modal, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/features/hooks/useRedux';
import { updateProfile } from '@/store/reducer/profile-slice';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AvatarPickerBottomSheet from '@/components/profile/AvatarPickerBottomSheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { setLanguage } from '@/store/reducer/language-slice';
import Avatar from '@/components/profile/Avatar';
import Statistics from '@/components/profile/Statistics';
import AchievementsList from '@/components/profile/AchievementsList';
import EmojiPicker from '@/components/profile/EmojiPicker';
import { changeLanguage } from '@/constants/i18n/i18n.config';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.profile) || {
    id: '',
    name: '',
    bio: '',
    interests: [],
    mood: '',
    avatarId: 1,
    avatarUri: '',
    achievements: [],
    stats: {
      totalRounds: 0,
      totalQuestions: 0,
      levelStats: {}
    }
  };
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(Colors.beige);
  const [isEmojiInputVisible, setIsEmojiInputVisible] = useState(false);
  
  const avatarPickerRef = useRef<BottomSheetModal>(null);
  const translateX = useSharedValue(profile.language === 'en' ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(translateX.value * 100) }]
  }));

  const handleLanguageChange = useCallback(async (newLanguage: string) => {
    try {
      await changeLanguage(newLanguage);
      dispatch(setLanguage(newLanguage));
      translateX.value = newLanguage === 'en' ? 1 : 0;
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [dispatch]);

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

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Avatar profile={profile} onPress={handleAvatarPress} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name || t('unnamed')}</Text>
          </View>
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

        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <View style={styles.languageToggle}>
            <Animated.View style={[styles.languageSlider, animatedStyle]} />
            <TouchableOpacity
              style={[styles.languageButton, { left: 0 }]}
              onPress={() => handleLanguageChange('ru')}
            >
              <Text style={[
                styles.languageButtonText,
                profile.language === 'ru' && styles.selectedLanguageText
              ]}>
                RU
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, { right: 0 }]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.languageButtonText,
                profile.language === 'en' && styles.selectedLanguageText
              ]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <AvatarPickerBottomSheet
          bottomSheetModalRef={avatarPickerRef}
          onSelectAvatar={handleSelectAvatar}
          profile={profile}
        />

        {isEmojiInputVisible && (
          <Modal
            transparent
            visible={isEmojiInputVisible}
            onRequestClose={() => setIsEmojiInputVisible(false)}
          >
            <EmojiPicker
              selectedColor={selectedBackgroundColor}
              onColorSelect={handleColorSelect}
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setIsEmojiInputVisible(false)}
            />
          </Modal>
        )}
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
    alignItems: 'center',
    marginBottom: 30,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepGray,
  },
  languageSection: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 15,
  },
  languageToggle: {
    width: 200,
    height: 40,
    backgroundColor: Colors.beige,
    borderRadius: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  languageSlider: {
    width: 100,
    height: 40,
    backgroundColor: Colors.deepBlue,
    borderRadius: 20,
    position: 'absolute',
  },
  languageButton: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  selectedLanguageText: {
    color: Colors.white,
  },
});

export default React.memo(ProfileScreen); 