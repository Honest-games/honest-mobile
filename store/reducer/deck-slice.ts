import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDeck } from '@/services/types/types';

interface CardsOfDeckState {
  deckSize: number;
  count: number;
  decks: IDeck[] | null; // Добавляем состояние для хранения decks
}

const initialState: CardsOfDeckState = {
  deckSize: 0,
  count: 0,
  decks: null,
};

const cardsOfDeckSlice = createSlice({
  name: 'CardsOfDeckSlice',
  initialState,
  reducers: {
    incrementDeletedCards: (state) => {
      if (state.count < state.deckSize) {
        state.count += 1;
      }
    },
    setDeckSize: (state, action: PayloadAction<number>) => {
      state.deckSize = action.payload;
      if (state.count >= state.deckSize) {
        state.count = 0;
      }
    },
    setDecks: (state, action: PayloadAction<IDeck[]>) => {
      // Новый reducer для обновления decks в состоянии
      state.decks = action.payload;
    },
  },
});

export const { incrementDeletedCards, setDeckSize, setDecks } = cardsOfDeckSlice.actions;
export default cardsOfDeckSlice.reducer;
