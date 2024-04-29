import { createSlice } from '@reduxjs/toolkit';

interface QuestionsLikesState {
  questionsLikesSet: Set<string>;
}

const initialQuestionsState: QuestionsLikesState = {
  questionsLikesSet: new Set<string>(),
};

const questionsLikesSlice = createSlice({
  name: 'questionsLikes',
  initialState: initialQuestionsState,
  reducers: {
    addQuestionId: (state, action) => {
      state.questionsLikesSet.add(action.payload);
    },
    removeQuestionId: (state, action) => {
      state.questionsLikesSet.delete(action.payload);
    },
    setQuestionsLikesSet: (state, action) => {
      state.questionsLikesSet = new Set(action.payload);
    },
  },
});

export const { 
  addQuestionId, removeQuestionId, setQuestionsLikesSet 
} = questionsLikesSlice.actions;

export const selectQuestionsLikesSet = (state: { questionsLikes: { questionsLikesSet: Set<string> } }): Set<string> => state.questionsLikes.questionsLikesSet;

export default questionsLikesSlice.reducer;
