export interface IDeck {
  id: string;
  languageCode: string;
  name: string;
  description: string;
  labels: string[];
  imageId: string;
  backgroundImageId: string | null;
  modalImageId: string | null;
  aiType: string;
  color: string;
  // Поля, которые отсутствуют в новом API, но могут использоваться в приложении
  emoji?: string;
  cardsCount?: number;
  hidden?: boolean;
  promo?: string;
} 