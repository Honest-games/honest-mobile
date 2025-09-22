import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@features/hooks/useRedux';
import { router } from 'expo-router';
import {
  selectShouldShowPaywall,
  selectIsDeckPurchased,
  selectSwipeCount,
  selectRemainingSwipes,
  selectIsSwipeLimitReached,
} from '../model/selectors';
import { MonetizationService } from './monetization-service';

interface MonetizationCheckResult {
  shouldShowPaywall: boolean;
  isDeckPurchased: boolean;
  currentSwipeCount: number;
  remainingSwipes: number;
  isLimitReached: boolean;
}

interface UseMonetizationCheckReturn {
  checkLimitAndNavigate: () => boolean;
  getMonetizationStatus: () => MonetizationCheckResult;
  canPerformAction: () => boolean;
  checkLimitOnInit: () => boolean;
  isOnline: boolean;
  needsSync: boolean;
}

/**
 * Хук для проверки лимитов монетизации конкретной колоды
 * Обеспечивает консистентную логику проверки лимитов
 * @param deckId - ID колоды для проверки
 */
export const useMonetizationCheck = (deckId: string): UseMonetizationCheckReturn => {
  const [needsSync, setNeedsSync] = useState(false);
  const monetizationService = MonetizationService.getInstance();

  // Получаем состояние для конкретной колоды
  const shouldShowPaywall = useAppSelector((state) => selectShouldShowPaywall(state, deckId));
  const isDeckPurchased = useAppSelector((state) => selectIsDeckPurchased(state, deckId));
  const currentSwipeCount = useAppSelector((state) => selectSwipeCount(state, deckId));
  const remainingSwipes = useAppSelector((state) => selectRemainingSwipes(state, deckId));
  const isLimitReached = useAppSelector((state) => selectIsSwipeLimitReached(state, deckId));

  useEffect(() => {
    // Проверяем нужна ли синхронизация при инициализации
    monetizationService.needsSync().then(setNeedsSync);
  }, [monetizationService]);

  const getMonetizationStatus = useCallback((): MonetizationCheckResult => {
    return {
      shouldShowPaywall,
      isDeckPurchased,
      currentSwipeCount,
      remainingSwipes,
      isLimitReached,
    };
  }, [shouldShowPaywall, isDeckPurchased, currentSwipeCount, remainingSwipes, isLimitReached]);

  /**
   * Проверяет лимит и автоматически переходит на paywall если необходимо
   * @returns true если действие можно выполнить, false если нужно показать paywall
   */
  const checkLimitAndNavigate = useCallback((): boolean => {
    if (isLimitReached) {
      router.push({
        pathname: '/(modals)/paywall',
        params: { deckId },
      });
      return false;
    }

    return true;
  }, [isLimitReached, deckId]);

  /**
   * Простая проверка возможности выполнения действия без навигации
   * @returns true если действие можно выполнить
   */
  const canPerformAction = useCallback((): boolean => {
    return !isLimitReached;
  }, [isLimitReached]);

  /**
   * Проверка лимита при инициализации компонента
   * Должна вызываться при входе в колоду для немедленной проверки
   * @returns true если можно продолжить, false если нужно показать paywall
   */
  const checkLimitOnInit = useCallback((): boolean => {
    // Если лимит уже достигнут, показываем paywall немедленно
    if (isLimitReached) {
      router.push({
        pathname: '/(modals)/paywall',
        params: { deckId },
      });
      return false;
    }

    return true;
  }, [isLimitReached, deckId]);

  return {
    checkLimitAndNavigate,
    getMonetizationStatus,
    canPerformAction,
    checkLimitOnInit,
    isOnline: monetizationService.isConnected(),
    needsSync,
  };
};