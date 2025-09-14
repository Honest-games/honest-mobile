// Модель
export type { QuestionLike } from './model/types';
export * from './model';

// API
export { 
  useLikeQuestionMutation,
  useDislikeQuestionMutation,
} from './api/question-likes-api'; 