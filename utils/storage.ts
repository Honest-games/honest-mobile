import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserProfile } from '@/services/types/types';

export const STORAGE_KEYS = {
  PROFILE: 'profile',
  LANGUAGE: 'language',
};

export const saveProfile = async (profile: IUserProfile) => {
  try {
    const profileString = JSON.stringify(profile);
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, profileString);
    console.log('Profile saved successfully:', profileString); // Для отладки
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const loadProfile = async (): Promise<IUserProfile | null> => {
  try {
    const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    console.log('Loaded profile from storage:', profileJson); // Для отладки
    if (!profileJson) return null;
    
    const profile = JSON.parse(profileJson);
    // Проверяем, что загруженный профиль имеет все необходимые поля
    if (!profile.achievements) {
      profile.achievements = [];
    }
    if (!profile.stats) {
      profile.stats = {
        totalRounds: 0,
        totalQuestions: 0,
        levelStats: {}
      };
    }
    return profile;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}; 