import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDeck } from './types';

interface CardsOfDeckState {
  deckSize: number;
  count: number;
  decks: IDeck[] | null;
}

const initialState: CardsOfDeckState = {
  deckSize: 0,
  count: 0,
  decks: null,
};

const deckSlice = createSlice({
  name: 'deck',
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
      state.decks = action.payload;
    },
  },
});

export const { incrementDeletedCards, setDeckSize, setDecks } = deckSlice.actions;
export default deckSlice.reducer; 