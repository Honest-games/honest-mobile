// Модель
export type { IDeck } from './model/types';
export { default as deckReducer, setDecks, setDeckSize, incrementDeletedCards } from './model/slice';

// API (старая версия)
export { 
  useGetAllQuestionsQuery, 
  useShuffleDeckMutation,
} from './api/decks-api'; 

// API (новая версия с chestno-game.online)
export {
  useGetNewDecksQuery,
  newDecksApi,
} from './api/new-decks-api'; 