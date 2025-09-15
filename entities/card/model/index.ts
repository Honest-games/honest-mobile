export interface IDisplayedCard {
  id: string;
  level: import('../../level').ILevelData | null;
  shouldLoadQuestion: boolean;
  shouldShowLevelOnCard: boolean;
  isSwipeable: boolean;
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

export const createDisplayedCard = (
  level: import('../../level').ILevelData | null,
  shouldLoadQuestion: boolean = false,
  shouldShowLevelOnCard: boolean = true,
  isSwipeable: boolean = true,
  customText?: string
): IDisplayedCard => ({
  id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  level,
  shouldLoadQuestion,
  shouldShowLevelOnCard,
  isSwipeable,
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