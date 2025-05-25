import { IAchievement } from '@/entities/achievement/model/types';

interface LevelStat {
  questionsAnswered: number;
  roundsPlayed: number;
}

interface UserStats {
  totalRounds: number;
  totalQuestions: number;
  levelStats: Record<string, LevelStat>;
}

export interface IUserProfile {
  id: string;
  name: string;
  avatarUri?: string;
  emoji?: string;
  backgroundColor?: string;
  bio: string;
  interests: string[];
  mood: string;
  avatarId: number;
  achievements: IAchievement[];
  stats: UserStats;
  lastUnlockedAchievement: string | null;
} 