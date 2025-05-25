export interface IUserProfile {
  id: string;
  name: string;
  bio?: string;
  interests?: string[];
  mood?: string;
  avatarId?: number;
  avatarUri?: string;
  emoji?: string;
  backgroundColor?: string;
  achievements: IAchievement[];
  stats: {
    totalRounds: number;
    totalQuestions: number;
    levelStats: Record<string, any>;
  };
  language?: 'en' | 'ru';
  lastUnlockedAchievement?: string;
}

export interface IAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress?: {
    current: number;
    required: number;
  };
}

export interface IUserStats {
  totalRounds: number;
  totalQuestions: number;
  levelStats: {
    [levelId: string]: {
      questionsAnswered: number;
      roundsPlayed: number;
    };
  };
} 