import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MonetizationState, DeckPurchase } from './types';

const FREE_SWIPE_LIMIT = 15;

const initialState: MonetizationState = {
  swipeCounts: {},
  deckPurchases: {},
  freeSwipeLimit: FREE_SWIPE_LIMIT,
  isPaywallVisible: false,
  currentDeckId: undefined,
};

export const monetizationSlice = createSlice({
  name: 'monetization',
  initialState,
  reducers: {
    incrementSwipeCount: (state, action: PayloadAction<{ deckId: string }>) => {
      const { deckId } = action.payload;

      // Не увеличиваем счетчик, если колода уже куплена
      if (state.deckPurchases[deckId]?.isPurchased) {
        return;
      }

      const currentCount = state.swipeCounts[deckId] || 0;
      state.swipeCounts[deckId] = currentCount + 1;
    },

    resetSwipeCount: (state, action: PayloadAction<{ deckId: string }>) => {
      const { deckId } = action.payload;
      state.swipeCounts[deckId] = 0;
    },

    purchaseDeck: (state, action: PayloadAction<DeckPurchase>) => {
      const { deckId, transactionId } = action.payload;

      state.deckPurchases[deckId] = {
        deckId,
        isPurchased: true,
        purchaseDate: new Date().toISOString(),
        transactionId,
      };

      // Сбрасываем счетчик свайпов для купленной колоды
      state.swipeCounts[deckId] = 0;
    },

    restorePurchase: (state, action: PayloadAction<{ deckId: string }>) => {
      const { deckId } = action.payload;

      if (!state.deckPurchases[deckId]) {
        state.deckPurchases[deckId] = {
          deckId,
          isPurchased: true,
          purchaseDate: new Date().toISOString(),
        };
      } else {
        state.deckPurchases[deckId].isPurchased = true;
      }

      // Сбрасываем счетчик свайпов для восстановленной колоды
      state.swipeCounts[deckId] = 0;
    },

    showPaywall: (state, action: PayloadAction<{ deckId: string }>) => {
      state.isPaywallVisible = true;
      state.currentDeckId = action.payload.deckId;
    },

    hidePaywall: (state) => {
      state.isPaywallVisible = false;
      state.currentDeckId = undefined;
    },

    setFreeSwipeLimit: (state, action: PayloadAction<{ limit: number }>) => {
      state.freeSwipeLimit = action.payload.limit;
    },
  },
});

export const {
  incrementSwipeCount,
  resetSwipeCount,
  purchaseDeck,
  restorePurchase,
  showPaywall,
  hidePaywall,
  setFreeSwipeLimit,
} = monetizationSlice.actions;

export default monetizationSlice.reducer;