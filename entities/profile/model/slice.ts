import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserProfile } from '@/entities/profile/model/types';
import { IAchievement } from '@/entities/achievement/model/types';
import { saveProfile, loadProfile } from '@/utils/storage';
import { AppThunk } from '@/shared/config/_providers/store';

const initialAchievements: IAchievement[] = [
  {
    id: 'first_game',
    icon: 'star-outline',
    isUnlocked: false
  },
  {
    id: 'ten_rounds',
    icon: 'trophy',
    isUnlocked: false,
    progress: {
      current: 0,
      required: 10
    }
  },
  {
    id: 'hundred_questions',
    icon: 'brain',
    isUnlocked: false,
    progress: {
      current: 0,
      required: 100
    }
  },
  {
    id: 'social_butterfly',
    icon: 'butterfly',
    isUnlocked: false,
    progress: {
      current: 0,
      required: 5
    }
  }
];

const initialState: IUserProfile = {
  id: '',
  name: '',
  bio: '',
  interests: [],
  mood: '',
  avatarId: 1,
  achievements: initialAchievements,
  stats: {
    totalRounds: 0,
    totalQuestions: 0,
    levelStats: {}
  },
  lastUnlockedAchievement: null as string | null
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<Partial<IUserProfile>>) {
      const newState = { ...state, ...action.payload };
      saveProfile(newState);
      return newState;
    },
    updateAchievement(state, action: PayloadAction<{ id: string; progress?: number }>) {
      const achievement = state.achievements.find(a => a.id === action.payload.id);
      if (achievement) {
        if (action.payload.progress !== undefined && achievement.progress) {
          achievement.progress.current = action.payload.progress;
          if (achievement.progress.current >= achievement.progress.required) {
            achievement.isUnlocked = true;
            state.lastUnlockedAchievement = achievement.id;
          }
        } else {
          achievement.isUnlocked = true;
          state.lastUnlockedAchievement = achievement.id;
        }
      }
      saveProfile(state);
    },
    clearLastUnlockedAchievement(state) {
      state.lastUnlockedAchievement = null;
    },
    incrementStats(state, action: PayloadAction<{ levelId?: string; questionsInRound?: number }>) {
      state.stats.totalQuestions++;
      state.stats.totalRounds++;
      
      if (action.payload.levelId) {
        if (!state.stats.levelStats[action.payload.levelId]) {
          state.stats.levelStats[action.payload.levelId] = {
            questionsAnswered: 0,
            roundsPlayed: 0
          };
        }
        state.stats.levelStats[action.payload.levelId].questionsAnswered++;
        state.stats.levelStats[action.payload.levelId].roundsPlayed++;

        // Проверяем достижение "Душа компании"
        const uniqueLevels = new Set(Object.keys(state.stats.levelStats)).size;
        const socialButterfly = state.achievements.find(a => a.id === 'social_butterfly');
        if (socialButterfly && socialButterfly.progress) {
          socialButterfly.progress.current = uniqueLevels;
          if (socialButterfly.progress.current >= socialButterfly.progress.required && !socialButterfly.isUnlocked) {
            socialButterfly.isUnlocked = true;
            state.lastUnlockedAchievement = socialButterfly.id;
          }
        }
      }

      // Проверяем базовые достижения
      const achievements = state.achievements;
      
      // Первая игра
      if (!achievements.find(a => a.id === 'first_game')?.isUnlocked) {
        const achievement = achievements.find(a => a.id === 'first_game');
        if (achievement) {
          achievement.isUnlocked = true;
          state.lastUnlockedAchievement = achievement.id;
        }
      }

      // 10 раундов
      const tenRounds = achievements.find(a => a.id === 'ten_rounds');
      if (tenRounds && !tenRounds.isUnlocked && tenRounds.progress) {
        tenRounds.progress.current = state.stats.totalRounds;
        if (tenRounds.progress.current >= tenRounds.progress.required) {
          tenRounds.isUnlocked = true;
          state.lastUnlockedAchievement = tenRounds.id;
        }
      }

      // 100 вопросов
      const hundredQuestions = achievements.find(a => a.id === 'hundred_questions');
      if (hundredQuestions && !hundredQuestions.isUnlocked && hundredQuestions.progress) {
        hundredQuestions.progress.current = state.stats.totalQuestions;
        if (hundredQuestions.progress.current >= hundredQuestions.progress.required) {
          hundredQuestions.isUnlocked = true;
          state.lastUnlockedAchievement = hundredQuestions.id;
        }
      }

      saveProfile(state);
    },
    resetProgress(state) {
      state.stats = {
        totalRounds: 0,
        totalQuestions: 0,
        levelStats: {}
      };
      state.achievements = initialAchievements;
      state.lastUnlockedAchievement = null;
      saveProfile(state);
    },
    loadSavedProfile(state, action: PayloadAction<IUserProfile>) {
      return action.payload;
    }
  }
});

export const { 
  updateProfile, 
  updateAchievement,
  incrementStats, 
  clearLastUnlockedAchievement,
  resetProgress,
  loadSavedProfile
} = profileSlice.actions;

// Thunk для загрузки профиля при старте приложения
export const initializeProfile = (): AppThunk => async (dispatch) => {
  try {
    const savedProfile = await loadProfile();
    if (savedProfile) {
      const completeProfile = {
        ...initialState,
        ...savedProfile,
        achievements: initialAchievements.map(achievement => {
          const savedAchievement = savedProfile.achievements?.find(a => a.id === achievement.id);
          return savedAchievement || achievement;
        })
      };
      dispatch(loadSavedProfile(completeProfile));
    }
  } catch (error) {
    console.error('Error initializing profile:', error);
  }
};

export const profileReducer = profileSlice.reducer; 