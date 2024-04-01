import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'en', // Начальное состояние
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

// Экспортируем экшены
export const { setLanguage } = languageSlice.actions;

// Экспортируем редьюсер
export default languageSlice.reducer;
