export interface IAchievementProgress {
  current: number;
  required: number;
}

export interface IAchievement {
  id: string;
  icon: string;
  isUnlocked: boolean;
  progress?: IAchievementProgress;
} 