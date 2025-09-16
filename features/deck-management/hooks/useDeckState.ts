import { useReducer, useCallback, useMemo } from 'react';
import { IDisplayedCard, createDisplayedCard, createCardWithText } from '@/entities/card/ui';
import { ILevelData } from '@/entities/level';
import { IDeck } from '@/services/types/types';

export interface DeckState {
  selectedDeck: IDeck | null;
  selectedLevel: ILevelData | null;
  displayDataStack: IDisplayedCard[];
  isShuffling: boolean;
  userSwiped: boolean;
}

export type DeckAction =
  | { type: 'SET_SELECTED_DECK'; payload: IDeck }
  | { type: 'SET_SELECTED_LEVEL'; payload: ILevelData }
  | { type: 'SET_DISPLAY_STACK'; payload: IDisplayedCard[] }
  | { type: 'ADD_TO_STACK'; payload: IDisplayedCard }
  | { type: 'REMOVE_FROM_STACK'; payload: number }
  | { type: 'SET_SHUFFLING'; payload: boolean }
  | { type: 'SET_USER_SWIPED'; payload: boolean }
  | { type: 'MOVE_TO_NEXT_CARD'; payload: ILevelData }
  | { type: 'RESET_STACK' }
  | { type: 'UPDATE_SECOND_CARD_QUESTION_LOADING' }
  | { type: 'HIDE_CARDS_FOR_LEVEL_CHANGE' }
  | { type: 'SET_CARD_VISIBILITY'; payload: { index: number; isVisible: boolean } };

const initialState: DeckState = {
  selectedDeck: null,
  selectedLevel: null,
  displayDataStack: [],
  isShuffling: false,
  userSwiped: false,
};

function deckReducer(state: DeckState, action: DeckAction): DeckState {
  switch (action.type) {
    case 'SET_SELECTED_DECK':
      return { ...state, selectedDeck: action.payload };

    case 'SET_SELECTED_LEVEL':
      return { ...state, selectedLevel: action.payload };

    case 'SET_DISPLAY_STACK':
      return { ...state, displayDataStack: action.payload };

    case 'ADD_TO_STACK':
      return {
        ...state,
        displayDataStack: [...state.displayDataStack, action.payload]
      };

    case 'REMOVE_FROM_STACK':
      return {
        ...state,
        displayDataStack: state.displayDataStack.filter((_, index) => index !== action.payload)
      };

    case 'SET_SHUFFLING':
      return { ...state, isShuffling: action.payload };

    case 'SET_USER_SWIPED':
      return { ...state, userSwiped: action.payload };

    case 'MOVE_TO_NEXT_CARD': {
      if (state.displayDataStack.length === 0) return state;

      const isSeveralLevels = true; // This should come from props/context
      const existingSecondCard = state.displayDataStack[1];
      const newCard = createDisplayedCard(action.payload, true, isSeveralLevels);

      // Переиспользуем существующую вторую карточку если она есть
      return {
        ...state,
        displayDataStack: existingSecondCard ? [existingSecondCard, newCard] : [newCard]
      };
    }

    case 'RESET_STACK':
      return { ...state, displayDataStack: [] };

    case 'UPDATE_SECOND_CARD_QUESTION_LOADING': {
      console.log('UPDATE_SECOND_CARD_QUESTION_LOADING', state.displayDataStack);
      if (state.displayDataStack.length < 2) return state;

      const updatedStack = [...state.displayDataStack];
      updatedStack[1] = { ...updatedStack[1], shouldLoadQuestion: true };

      return { ...state, displayDataStack: updatedStack };
    }

    case 'HIDE_CARDS_FOR_LEVEL_CHANGE': {
      const updatedStack = state.displayDataStack.map(card => ({
        ...card,
        isVisible: false
      }));
      return { ...state, displayDataStack: updatedStack };
    }

    case 'SET_CARD_VISIBILITY': {
      const { index, isVisible } = action.payload;
      if (index >= state.displayDataStack.length || index < 0) return state;

      const updatedStack = [...state.displayDataStack];
      updatedStack[index] = { ...updatedStack[index], isVisible };

      return { ...state, displayDataStack: updatedStack };
    }

    default:
      return state;
  }
}

export const useDeckState = () => {
  const [state, dispatch] = useReducer(deckReducer, initialState);

  const setSelectedDeck = useCallback((deck: IDeck) => {
    dispatch({ type: 'SET_SELECTED_DECK', payload: deck });
  }, []);

  const setSelectedLevel = useCallback((level: ILevelData) => {
    dispatch({ type: 'SET_SELECTED_LEVEL', payload: level });
  }, []);

  const setDisplayStack = useCallback((stack: IDisplayedCard[]) => {
    dispatch({ type: 'SET_DISPLAY_STACK', payload: stack });
  }, []);

  const addToStack = useCallback((card: IDisplayedCard) => {
    dispatch({ type: 'ADD_TO_STACK', payload: card });
  }, []);

  const removeFromStack = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_FROM_STACK', payload: index });
  }, []);

  const setIsShuffling = useCallback((isShuffling: boolean) => {
    dispatch({ type: 'SET_SHUFFLING', payload: isShuffling });
  }, []);

  const setUserSwiped = useCallback((swiped: boolean) => {
    dispatch({ type: 'SET_USER_SWIPED', payload: swiped });
  }, []);

  const moveToNextCard = useCallback((level: ILevelData) => {
    dispatch({ type: 'MOVE_TO_NEXT_CARD', payload: level });
  }, []);

  const resetStack = useCallback(() => {
    dispatch({ type: 'RESET_STACK' });
  }, []);

  const updateSecondCardQuestionLoading = useCallback(() => {
    dispatch({ type: 'UPDATE_SECOND_CARD_QUESTION_LOADING' });
  }, []);

  const hideCardsForLevelChange = useCallback(() => {
    dispatch({ type: 'HIDE_CARDS_FOR_LEVEL_CHANGE' });
  }, []);

  const setCardVisibility = useCallback((index: number, isVisible: boolean) => {
    dispatch({ type: 'SET_CARD_VISIBILITY', payload: { index, isVisible } });
  }, []);

  const createInitialCards = useCallback((level: ILevelData, isSeveralLevels: boolean) => {
    const cards = [
      createDisplayedCard(level, true, isSeveralLevels),
      createDisplayedCard(level, true, isSeveralLevels),
    ];
    setDisplayStack(cards);
    setSelectedLevel(level);
  }, [setDisplayStack, setSelectedLevel]);

  const createShuffleCards = useCallback((
    level: ILevelData,
    shuffleMessage: string,
    isSeveralLevels: boolean
  ) => {
    const newStack = [
      state.displayDataStack[0], // Keep current card
      createCardWithText(shuffleMessage, true),
      createDisplayedCard(level, true, isSeveralLevels),
    ];
    setDisplayStack(newStack);
  }, [state.displayDataStack, setDisplayStack]);

  return useMemo(() => ({
    // State
    ...state,

    // Actions
    setSelectedDeck,
    setSelectedLevel,
    setDisplayStack,
    addToStack,
    removeFromStack,
    setIsShuffling,
    setUserSwiped,
    moveToNextCard,
    resetStack,
    updateSecondCardQuestionLoading,
    hideCardsForLevelChange,
    setCardVisibility,

    // Compound actions
    createInitialCards,
    createShuffleCards,
  }), [
    state,
    setSelectedDeck,
    setSelectedLevel,
    setDisplayStack,
    addToStack,
    removeFromStack,
    setIsShuffling,
    setUserSwiped,
    moveToNextCard,
    resetStack,
    updateSecondCardQuestionLoading,
    hideCardsForLevelChange,
    setCardVisibility,
    createInitialCards,
    createShuffleCards,
  ]);
};