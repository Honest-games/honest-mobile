export { Statistics } from './ui/statistics';
export type { IUserProfile } from './model/types';
export { 
  profileReducer, 
  profileSlice,
  updateProfile,
  updateAchievement,
  incrementStats,
  clearLastUnlockedAchievement,
  resetProgress,
  initializeProfile
} from './model/slice'; 