import { useReducer, useCallback, useMemo } from 'react';
import { IAchievement } from '@/services/types/types';

export interface DialogState {
  isShuffleDialogVisible: boolean;
  isResumeDialogVisible: boolean;
  showAchievementModal: boolean;
  showFireworks: boolean;
  unlockedAchievement: IAchievement | null;
}

export type DialogAction =
  | { type: 'SHOW_SHUFFLE_DIALOG' }
  | { type: 'HIDE_SHUFFLE_DIALOG' }
  | { type: 'SHOW_RESUME_DIALOG' }
  | { type: 'HIDE_RESUME_DIALOG' }
  | { type: 'SHOW_ACHIEVEMENT_MODAL'; payload: IAchievement }
  | { type: 'HIDE_ACHIEVEMENT_MODAL' }
  | { type: 'SHOW_FIREWORKS' }
  | { type: 'HIDE_FIREWORKS' }
  | { type: 'RESET_ALL_DIALOGS' };

const initialState: DialogState = {
  isShuffleDialogVisible: false,
  isResumeDialogVisible: false,
  showAchievementModal: false,
  showFireworks: false,
  unlockedAchievement: null,
};

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'SHOW_SHUFFLE_DIALOG':
      return { ...state, isShuffleDialogVisible: true };

    case 'HIDE_SHUFFLE_DIALOG':
      return { ...state, isShuffleDialogVisible: false };

    case 'SHOW_RESUME_DIALOG':
      return { ...state, isResumeDialogVisible: true };

    case 'HIDE_RESUME_DIALOG':
      return { ...state, isResumeDialogVisible: false };

    case 'SHOW_ACHIEVEMENT_MODAL':
      return {
        ...state,
        showAchievementModal: true,
        showFireworks: true,
        unlockedAchievement: action.payload,
      };

    case 'HIDE_ACHIEVEMENT_MODAL':
      return {
        ...state,
        showAchievementModal: false,
        showFireworks: false,
        unlockedAchievement: null,
      };

    case 'SHOW_FIREWORKS':
      return { ...state, showFireworks: true };

    case 'HIDE_FIREWORKS':
      return { ...state, showFireworks: false };

    case 'RESET_ALL_DIALOGS':
      return initialState;

    default:
      return state;
  }
}

export const useDialogState = () => {
  const [state, dispatch] = useReducer(dialogReducer, initialState);

  const showShuffleDialog = useCallback(() => {
    dispatch({ type: 'SHOW_SHUFFLE_DIALOG' });
  }, []);

  const hideShuffleDialog = useCallback(() => {
    dispatch({ type: 'HIDE_SHUFFLE_DIALOG' });
  }, []);

  const showResumeDialog = useCallback(() => {
    dispatch({ type: 'SHOW_RESUME_DIALOG' });
  }, []);

  const hideResumeDialog = useCallback(() => {
    dispatch({ type: 'HIDE_RESUME_DIALOG' });
  }, []);

  const showAchievementModal = useCallback((achievement: IAchievement) => {
    dispatch({ type: 'SHOW_ACHIEVEMENT_MODAL', payload: achievement });
  }, []);

  const hideAchievementModal = useCallback(() => {
    dispatch({ type: 'HIDE_ACHIEVEMENT_MODAL' });
  }, []);

  const showFireworks = useCallback(() => {
    dispatch({ type: 'SHOW_FIREWORKS' });
  }, []);

  const hideFireworks = useCallback(() => {
    dispatch({ type: 'HIDE_FIREWORKS' });
  }, []);

  const resetAllDialogs = useCallback(() => {
    dispatch({ type: 'RESET_ALL_DIALOGS' });
  }, []);

  return useMemo(() => ({
    // State
    ...state,

    // Actions
    showShuffleDialogAction: showShuffleDialog,
    hideShuffleDialog,
    showResumeDialogAction: showResumeDialog,
    hideResumeDialog,
    showAchievementModalAction: showAchievementModal,
    hideAchievementModal,
    showFireworksAction: showFireworks,
    hideFireworks,
    resetAllDialogs,
  }), [
    state,
    showShuffleDialog,
    hideShuffleDialog,
    showResumeDialog,
    hideResumeDialog,
    showAchievementModal,
    hideAchievementModal,
    showFireworks,
    hideFireworks,
    resetAllDialogs,
  ]);
};