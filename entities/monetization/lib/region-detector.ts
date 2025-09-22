import * as Localization from 'expo-localization';
import { PaymentProvider, RegionConfig } from '../model/types';

/**
 * Определяет регион пользователя и соответствующий платежный провайдер
 */
export const detectUserRegion = (): RegionConfig => {
  const countryCode = Localization.getLocales()[0]?.regionCode;
  const languageCode = Localization.getLocales()[0]?.languageCode;

  // Проверяем, является ли пользователь из России
  const isRussia = countryCode === 'RU' || languageCode === 'ru';

  return {
    isRussia,
    paymentProvider: isRussia ? PaymentProvider.TBANK : PaymentProvider.APPLE_IAP,
    currency: isRussia ? 'RUB' : 'USD',
  };
};

/**
 * Получает конфигурацию продукта в зависимости от региона
 */
export const getProductConfig = (regionConfig: RegionConfig) => {
  if (regionConfig.isRussia) {
    return {
      productId: 'honest_deck_unlock_ru',
      price: 199, // 199 рублей
      currency: 'RUB',
      provider: PaymentProvider.TBANK,
    };
  }

  return {
    productId: 'honest_deck_unlock',
    price: 2.99, // $2.99
    currency: 'USD',
    provider: PaymentProvider.APPLE_IAP,
  };
};