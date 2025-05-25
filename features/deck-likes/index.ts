// Модель
export type { DeckLike } from './model/types';
export { 
  default as deckLikesReducer, 
  addDeckId, 
  removeDeckId, 
  setDecksLikesSet,
  selectDecksLikesSet
} from './model/slice';

// API
export { 
  useGetAllLikesQuery,
  useLikeDeckMutation,
  useDislikeDeckMutation
} from './api/deck-likes-api'; 