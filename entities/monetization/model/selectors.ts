import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@shared/config/store/store';

const selectMonetizationState = (state: RootState) => state.monetization;

export const selectSwipeCount = createSelector(
  [selectMonetizationState, (state: RootState, deckId: string) => deckId],
  (monetization, deckId) => monetization.swipeCounts[deckId] || 0
);

export const selectIsDeckPurchased = createSelector(
  [selectMonetizationState, (state: RootState, deckId: string) => deckId],
  (monetization, deckId) => monetization.deckPurchases[deckId]?.isPurchased || false
);

export const selectIsSwipeLimitReached = createSelector(
  [selectMonetizationState, (state: RootState, deckId: string) => deckId],
  (monetization, deckId) => {
    const swipeCount = monetization.swipeCounts[deckId] || 0;
    const isPurchased = monetization.deckPurchases[deckId]?.isPurchased || false;

    return !isPurchased && swipeCount >= monetization.freeSwipeLimit;
  }
);

export const selectShouldShowPaywall = createSelector(
  [selectMonetizationState, (state: RootState, deckId: string) => deckId],
  (monetization, deckId) => {
    const swipeCount = monetization.swipeCounts[deckId] || 0;
    const isPurchased = monetization.deckPurchases[deckId]?.isPurchased || false;

    return !isPurchased && swipeCount >= monetization.freeSwipeLimit;
  }
);

export const selectFreeSwipeLimit = createSelector(
  [selectMonetizationState],
  (monetization) => monetization.freeSwipeLimit
);

export const selectRemainingSwipes = createSelector(
  [selectMonetizationState, (state: RootState, deckId: string) => deckId],
  (monetization, deckId) => {
    const swipeCount = monetization.swipeCounts[deckId] || 0;
    const isPurchased = monetization.deckPurchases[deckId]?.isPurchased || false;

    if (isPurchased) {
      return -1; // Безлимитный доступ
    }

    return Math.max(0, monetization.freeSwipeLimit - swipeCount);
  }
);

export const selectPaywallState = createSelector(
  [selectMonetizationState],
  (monetization) => ({
    isVisible: monetization.isPaywallVisible,
    currentDeckId: monetization.currentDeckId,
  })
);

export const selectDeckPurchases = createSelector(
  [selectMonetizationState],
  (monetization) => monetization.deckPurchases
);