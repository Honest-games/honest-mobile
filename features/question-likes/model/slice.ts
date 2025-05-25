import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionLike, QuestionsLikesState } from './types';

const initialState: QuestionsLikesState = {
  questionsLikesSet: new Set<string>(),
};

export const questionsLikesSlice = createSlice({
  name: 'questionsLikes',
  initialState,
  reducers: {
    addQuestionId: (state, action: PayloadAction<string>) => {
      state.questionsLikesSet.add(action.payload);
    },
    removeQuestionId: (state, action: PayloadAction<string>) => {
      state.questionsLikesSet.delete(action.payload);
    },
    setQuestionsLikesSet: (state, action: PayloadAction<QuestionLike[]>) => {
      state.questionsLikesSet = new Set(action.payload.map((like: QuestionLike) => like.questionId));
    },
  },
});

export const { 
  addQuestionId, removeQuestionId, setQuestionsLikesSet 
} = questionsLikesSlice.actions;

export const selectQuestionsLikesSet = (state: { questionsLikes: { questionsLikesSet: Set<string> } }): Set<string> => 
  state.questionsLikes.questionsLikesSet;

export const questionLikesReducer = questionsLikesSlice.reducer; 