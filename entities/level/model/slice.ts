import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LevelState {
  selectedLevelId: string | null;
  tooltipContent: string;
  showTooltip: boolean;
}

const initialState: LevelState = {
  selectedLevelId: null,
  tooltipContent: '',
  showTooltip: false,
};

export const levelSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    showTooltip: (state, action: PayloadAction<{ levelId: string; content: string }>) => {
      state.selectedLevelId = action.payload.levelId;
      state.tooltipContent = action.payload.content;
      state.showTooltip = true;
    },
    hideTooltip: (state) => {
      state.showTooltip = false;
      state.selectedLevelId = null;
      state.tooltipContent = '';
    },
  },
});

export const { showTooltip, hideTooltip } = levelSlice.actions;
export const levelsReducer = levelSlice.reducer; 