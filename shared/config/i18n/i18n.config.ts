import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en, ru } from './translations'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform, NativeModules } from 'react-native'

const resources = {
  en: {
    translation: en
  },
  ru: {
    translation: ru
  }
}

const getDeviceLanguage = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier

  return deviceLanguage.split('_')[0]
}

// Инициализируем i18n сразу
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  debug: false,
  resources,
  lng: 'ru', // Начальный язык
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false
  }
})

const initializeI18n = async () => {
  try {
    // Пытаемся получить сохраненный язык
    const savedLanguage = await AsyncStorage.getItem('language')
    
    // Если язык не сохранен, используем язык системы
    const initialLanguage = savedLanguage || getDeviceLanguage()
    
    // Проверяем, поддерживается ли язык
    const language = resources[initialLanguage] ? initialLanguage : 'ru'

    // Устанавливаем язык
    await i18n.changeLanguage(language)
    
    return language
  } catch (error) {
    console.error('Error initializing i18n:', error)
    return 'ru'
  }
}

// Функция для изменения языка
const changeLanguage = async (language: string) => {
  try {
    // Сохраняем выбранный язык
    await AsyncStorage.setItem('language', language)
    // Меняем язык в i18n
    await i18n.changeLanguage(language)
  } catch (error) {
    console.error('Error changing language:', error)
  }
}

export { initializeI18n, changeLanguage }
export default i18n 