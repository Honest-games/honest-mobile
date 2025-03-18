import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Modal, FlatList, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks/useRedux';
import { updateProfile, resetProgress } from '@/store/reducer/profile-slice';
import { BlurView } from 'expo-blur';
import { IAchievement, IUserProfile } from '@/services/types/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import EditProfileBottomSheet from '@/components/profile/EditProfileBottomSheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { setLanguage } from '@/store/reducer/language-slice';

const avatars = [
  { id: 1, icon: 'account-circle' },
  { id: 2, icon: 'account-cowboy-hat' },
  { id: 3, icon: 'account-tie' },
  { id: 4, icon: 'alien' },
  { id: 5, icon: 'cat' },
  { id: 6, icon: 'dog' },
  { id: 7, icon: 'duck' },
  { id: 8, icon: 'penguin' },
  { id: 9, icon: 'rabbit' },
  { id: 10, icon: 'owl' },
  { id: 11, icon: 'robot' },
  { id: 12, icon: 'ninja' },
  { id: 13, icon: 'account-music' },
  { id: 14, icon: 'account-heart' },
  { id: 15, icon: 'account-star' },
  { id: 16, icon: 'emoticon-cool' },
  { id: 17, icon: 'emoticon-excited' },
  { id: 18, icon: 'emoticon-happy' },
  { id: 19, icon: 'ghost' },
  { id: 20, icon: 'unicorn' },
  { id: 21, icon: 'space-invaders' },
  { id: 22, icon: 'rocket' },
  { id: 23, icon: 'crown' },
  { id: 24, icon: 'wizard-hat' }
];

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(state => state.profile) || {
    id: '',
    name: '',
    bio: '',
    interests: [],
    mood: '',
    avatarId: 1,
    achievements: [],
    stats: {
      totalRounds: 0,
      totalQuestions: 0,
      levelStats: {}
    }
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const language = useAppSelector(state => state.language.language);
  
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const translateX = useSharedValue(language === 'en' ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(translateX.value * 100) }]
    };
  });

  const changeLanguage = async (newLanguage: string) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
      await i18n.changeLanguage(newLanguage);
      dispatch(setLanguage(newLanguage));
      translateX.value = newLanguage === 'en' ? 1 : 0;
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleChangeProfile = (field: keyof IUserProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    dispatch(updateProfile(editedProfile));
    bottomSheetModalRef.current?.dismiss();
  };

  const handleResetProgress = () => {
    dispatch(resetProgress());
  };

  const renderAchievement = ({ item }: { item: IAchievement }) => (
    <View style={styles.achievementItem}>
      <MaterialCommunityIcons 
        name={item.icon as any} 
        size={24} 
        color={item.isUnlocked ? Colors.deepBlue : Colors.grey} 
      />
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDesc}>{item.description}</Text>
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
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Профиль */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => setAvatarModalVisible(true)}
          >
            <MaterialCommunityIcons 
              name={avatars.find(a => a.id === profile.avatarId)?.icon || 'account-circle'} 
              size={80} 
              color={Colors.deepBlue} 
            />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name || t('unnamed')}</Text>
            {/* <Text style={styles.bio}>{profile.bio || t('noBio')}</Text>
            <Text style={styles.mood}>{profile.mood || t('noMood')}</Text> */}
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={handlePresentModal}
            >
              <Text style={styles.editButtonText}>{t('edit')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Достижения */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>{t('achievements')}</Text>
          <FlatList
            data={profile.achievements}
            renderItem={renderAchievement}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Статистика */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>{t('statistics')}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.totalRounds}</Text>
              <Text style={styles.statLabel}>{t('totalRounds')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.stats.totalQuestions}</Text>
              <Text style={styles.statLabel}>{t('totalQuestions')}</Text>
            </View>
          </View>
        </View>

        {/* Настройки */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          
          {/* Выбор языка */}
          <View style={styles.languageSelector}>
            <Text style={styles.languageTitle}>{t('language')}</Text>
            <View style={styles.languageToggle}>
              <Animated.View style={[styles.languageSlider, animatedStyle]} />
              <TouchableOpacity
                style={[styles.languageButton, { left: 0 }]}
                onPress={() => changeLanguage('ru')}
              >
                <Text style={[
                  styles.languageButtonText,
                  language === 'ru' && styles.selectedLanguageText
                ]}>RU</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.languageButton, { right: 0 }]}
                onPress={() => changeLanguage('en')}
              >
                <Text style={[
                  styles.languageButtonText,
                  language === 'en' && styles.selectedLanguageText
                ]}>EN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Модальное окно выбора аватара */}
        <Modal
          visible={isAvatarModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAvatarModalVisible(false)}
        >
          <BlurView
            intensity={50}
            tint="dark"
            style={styles.modalOverlay}
          >
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={() => setAvatarModalVisible(false)}
            >
              <TouchableOpacity 
                activeOpacity={1} 
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>{t('chooseAvatar')}</Text>
                  <FlatList
                    data={avatars}
                    numColumns={4}
                    columnWrapperStyle={styles.avatarRow}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.avatarOption,
                          profile.avatarId === item.id && styles.selectedAvatarOption
                        ]}
                        onPress={() => {
                          dispatch(updateProfile({ avatarId: item.id }));
                          setAvatarModalVisible(false);
                        }}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={50}
                          color={profile.avatarId === item.id ? Colors.deepBlue : Colors.grey}
                        />
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id.toString()}
                  />
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </BlurView>
        </Modal>

        {/* Модальное окно редактирования профиля */}
        <EditProfileBottomSheet
          bottomSheetModalRef={bottomSheetModalRef}
          editedProfile={editedProfile}
          onChangeProfile={handleChangeProfile}
          onSave={handleSaveProfile}
        />

        {/* Добавим кнопку сброса в конец */}
        <View style={styles.resetSection}>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetProgress}
          >
            <Text style={styles.resetButtonText}>
              {t('resetProgress')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.resetDescription}>
            {t('resetProgressDesc')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  statsSection: {
    marginBottom: 30,
  },
  settingsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 15,
  },
  comingSoonBox: {
    backgroundColor: Colors.beige,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepBlue,
    marginBottom: 10,
    textAlign: 'center',
  },
  comingSoonDesc: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: 'center',
  },
  languageSelector: {
    padding: 20,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 15,
  },
  languageToggle: {
    width: 200,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'relative',
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
  },
  selectedLanguageText: {
    color: Colors.white,
  },
  editForm: {
    width: '100%',
    padding: 20,
  },
  input: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.grey1,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.deepBlue,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 10,
    flex: 1,
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
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 10,
  },
  mood: {
    fontSize: 14,
    color: Colors.grey,
  },
  editButton: {
    backgroundColor: Colors.deepBlue,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  achievementsSection: {
    marginBottom: 30,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    maxHeight: '70%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 15,
    textAlign: 'center',
  },
  avatarRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  avatarOption: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '23%',
  },
  selectedAvatarOption: {
    backgroundColor: Colors.beige,
    borderRadius: 8,
  },
  resetSection: {
    padding: 20,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: Colors.red,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  resetButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetDescription: {
    fontSize: 12,
    color: Colors.grey,
    textAlign: 'center',
  },
});

export default ProfileScreen; 