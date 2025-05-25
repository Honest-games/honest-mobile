// app-slice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  isContentReady: boolean;
}

const initialState: AppState = {
  isContentReady: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setContentReady(state, action) {
      state.isContentReady = action.payload;
    },
  },
});

export const { setContentReady } = appSlice.actions;
export default appSlice.reducer; 