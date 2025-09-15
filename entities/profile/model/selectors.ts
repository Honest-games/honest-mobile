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

// Memoized profile selector with fallback - ensures proper transformation
export const selectProfile = createSelector(
  [selectProfileState],
  (profile): IUserProfile => {
    // Always return a new object to ensure proper memoization
    // This prevents the "returning input without modification" warning
    if (!profile) {
      return { ...defaultProfile };
    }

    // Ensure all required fields are present with fallbacks
    return {
      ...defaultProfile,
      ...profile,
      // Guarantee required fields are never undefined/null
      id: profile.id || '',
      name: profile.name || '',
      bio: profile.bio || '',
      interests: profile.interests || [],
      mood: profile.mood || '',
      avatarId: profile.avatarId || 1,
      achievements: profile.achievements || [],
      stats: profile.stats || defaultProfile.stats,
      lastUnlockedAchievement: profile.lastUnlockedAchievement
    };
  }
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

// Memoized profile statistics selector with transformation
export const selectProfileStats = createSelector(
  [selectProfile],
  (profile) => ({
    ...profile.stats,
    // Ensure computed totals are properly calculated
    totalGames: profile.stats.totalRounds || 0,
    totalAnswers: profile.stats.totalQuestions || 0,
    uniqueLevelsPlayed: Object.keys(profile.stats.levelStats || {}).length
  })
);

// Memoized achievements selector with transformation
export const selectProfileAchievements = createSelector(
  [selectProfile],
  (profile) => [...(profile.achievements || [])]
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

// Memoized last unlocked achievement selector with transformation
export const selectLastUnlockedAchievement = createSelector(
  [selectProfile],
  (profile) => ({
    achievementId: profile.lastUnlockedAchievement,
    hasUnlocked: profile.lastUnlockedAchievement !== null
  })
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