import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@shared/config/_providers/store';
import { IUserProfile } from './types';
import { IAchievement } from '@/entities/achievement/model/types';

// Default profile fallback
const defaultProfile: IUserProfile = {
  id: '',
  name: '',
  bio: '',
  interests: [],
  mood: '',
  avatarId: 1,
  avatarUri: '',
  achievements: [],
  stats: {
    totalRounds: 0,
    totalQuestions: 0,
    levelStats: {}
  },
  lastUnlockedAchievement: null
};

// Base selector for profile state
const selectProfileState = (state: RootState) => state.profile;

// Memoized profile selector with fallback
export const selectProfile = createSelector(
  [selectProfileState],
  (profile): IUserProfile => profile || defaultProfile
);

// Memoized profile basic info selector
export const selectProfileBasicInfo = createSelector(
  [selectProfile],
  (profile) => ({
    id: profile.id,
    name: profile.name,
    avatarId: profile.avatarId,
    avatarUri: profile.avatarUri,
    emoji: profile.emoji,
    backgroundColor: profile.backgroundColor
  })
);

// Memoized profile statistics selector
export const selectProfileStats = createSelector(
  [selectProfile],
  (profile) => profile.stats
);

// Memoized achievements selector
export const selectProfileAchievements = createSelector(
  [selectProfile],
  (profile) => profile.achievements
);

// Memoized unlocked achievements selector
export const selectUnlockedAchievements = createSelector(
  [selectProfileAchievements],
  (achievements): IAchievement[] => achievements.filter(achievement => achievement.isUnlocked)
);

// Memoized locked achievements selector
export const selectLockedAchievements = createSelector(
  [selectProfileAchievements],
  (achievements): IAchievement[] => achievements.filter(achievement => !achievement.isUnlocked)
);

// Memoized achievements count selector
export const selectAchievementsCount = createSelector(
  [selectUnlockedAchievements, selectProfileAchievements],
  (unlockedAchievements, allAchievements) => ({
    unlocked: unlockedAchievements.length,
    total: allAchievements.length
  })
);

// Memoized last unlocked achievement selector
export const selectLastUnlockedAchievement = createSelector(
  [selectProfile],
  (profile) => profile.lastUnlockedAchievement
);

// Memoized profile completion status
export const selectProfileCompleteness = createSelector(
  [selectProfile],
  (profile) => {
    const fields = [
      profile.name,
      profile.bio,
      profile.mood,
      profile.avatarUri || profile.emoji
    ];
    const completedFields = fields.filter(field => field && field.trim().length > 0).length;
    const totalFields = fields.length;

    return {
      completedFields,
      totalFields,
      percentage: Math.round((completedFields / totalFields) * 100)
    };
  }
);

// Memoized display name selector
export const selectProfileDisplayName = createSelector(
  [selectProfile],
  (profile): string => profile.name || 'unnamed'
);