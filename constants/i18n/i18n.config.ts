import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, ru } from './translations';

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

(async () => {
  try {
    const language = await AsyncStorage.getItem('language');
    i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      debug: false,
      resources,
      lng: language || 'ru', // Если язык не найден, используем 'ru' как язык по умолчанию
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error('Ошибка при получении языка из AsyncStorage:', error);
    i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      debug: false,
      resources,
      lng: 'ru',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
  }
})();

export default i18n;
