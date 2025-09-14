// Модель
export type { IDeck } from './model/types';
export { default as deckReducer, setDecks, setDeckSize, incrementDeletedCards } from './model/slice';

// API хуки для колод и вопросов
export {
  useGetDecksQuery,
  useGetAllQuestionsQuery,
  useShuffleDeckMutation,
} from './api' 