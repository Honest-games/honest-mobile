import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserProfile, IAchievement } from '@/services/types/types';
import { saveProfile, loadProfile } from '@/utils/storage';
import { AppThunk } from '../store';

const initialAchievements: IAchievement[] = [
  {
    id: 'first_game',
    title: 'Первый шаг',
    description: 'Сыграйте свою первую игру',
    icon: 'star-outline',
    isUnlocked: false
  },
  {
    id: 'ten_rounds',
    title: 'Опытный игрок',
    description: 'Сыграйте 10 раундов',
    icon: 'trophy',
    isUnlocked: false,
    progress: {
      current: 0,
      required: 10
    }
  },
  {
    id: 'hundred_questions',
    title: 'Любознательный',
    description: 'Ответьте на 100 вопросов',
    icon: 'brain',
    isUnlocked: false,
    progress: {
      current: 0,
      required: 100
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

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<Partial<IUserProfile>>) {
      const newState = { ...state, ...action.payload };
      // Сохраняем в AsyncStorage
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
          }
        } else {
          achievement.isUnlocked = true;
        }
      }
      // Сохраняем в AsyncStorage
      saveProfile(state);
    },
    incrementStats(state, action: PayloadAction<{ levelId?: string }>) {
      state.stats.totalQuestions++;
      state.stats.totalRounds++;
      
      // Обновляем статистику по уровням
      if (action.payload.levelId) {
        if (!state.stats.levelStats[action.payload.levelId]) {
          state.stats.levelStats[action.payload.levelId] = {
            questionsAnswered: 0,
            roundsPlayed: 0
          };
        }
        state.stats.levelStats[action.payload.levelId].questionsAnswered++;
        state.stats.levelStats[action.payload.levelId].roundsPlayed++;
      }

      // Проверяем достижения
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

      // Сохраняем в AsyncStorage
      saveProfile(state);
    },
    clearLastUnlockedAchievement(state) {
      state.lastUnlockedAchievement = null;
    },
    resetProgress(state) {
      state.stats = {
        totalRounds: 0,
        totalQuestions: 0,
        levelStats: {}
      };
      state.achievements = initialAchievements;
      state.lastUnlockedAchievement = null;
      
      // Сохраняем в AsyncStorage
      saveProfile(state);
    },
    loadSavedProfile(state, action: PayloadAction<IUserProfile>) {
      return action.payload;
    }
  }
});

// Thunk для загрузки профиля при старте приложения
export const initializeProfile = (): AppThunk => async (dispatch) => {
  try {
    const savedProfile = await loadProfile();
    console.log('Initializing profile with saved data:', savedProfile); // Для отладки
    if (savedProfile) {
      // Убедимся, что все необходимые поля присутствуют
      const completeProfile = {
        ...initialState, // Используем initialState как базу
        ...savedProfile, // Перезаписываем сохраненными данными
        // Убедимся, что achievements содержат все необходимые достижения
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

export const { 
  updateProfile, 
  updateAchievement, 
  incrementStats, 
  clearLastUnlockedAchievement,
  resetProgress,
  loadSavedProfile 
} = profileSlice.actions;

export default profileSlice.reducer; 