export interface IDisplayedCard {
  id: string;
  level: import('../../level').ILevelData | null;
  shouldLoadQuestion: boolean;
  shouldShowLevelOnCard: boolean;
  isSwipeable: boolean;
  isVisible: boolean;
  customText?: string;
}

export interface ICardStack {
  cards: IDisplayedCard[];
  currentIndex: number;
}

export interface ICardTransition {
  direction: 'left' | 'right';
  isAnimating: boolean;
}

// Генерирует стабильный ID на основе уровня и контента
const generateStableId = (level: import('../../level').ILevelData | null, customText?: string): string => {
  const timestamp = Date.now();
  const baseStr = level ? `level-${level.id}-${timestamp}` : `text-${customText || 'empty'}-${timestamp}`;

  // Простой хеш для стабильности при одинаковых параметрах
  let hash = 0;
  for (let i = 0; i < baseStr.length; i++) {
    const char = baseStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `card-${Math.abs(hash)}-${Math.random().toString(36).substr(2, 4)}`;
};

export const createDisplayedCard = (
  level: import('../../level').ILevelData | null,
  shouldLoadQuestion: boolean = false,
  shouldShowLevelOnCard: boolean = true,
  isSwipeable: boolean = true,
  customText?: string
): IDisplayedCard => ({
  id: generateStableId(level, customText),
  level,
  shouldLoadQuestion,
  shouldShowLevelOnCard,
  isSwipeable,
  isVisible: true,
  customText,
});

export const createCardWithText = (
  text: string,
  isSwipeable: boolean = true
): IDisplayedCard => createDisplayedCard(
  null,
  false,
  false,
  isSwipeable,
  text
);