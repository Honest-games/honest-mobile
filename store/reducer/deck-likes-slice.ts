import { createSlice } from '@reduxjs/toolkit';


interface LikesState {
  decksLikesSet: Set<string>;
}

const initialState: LikesState = {
  decksLikesSet: new Set<string>(),
};

const likesSlice = createSlice({
  name: 'decksLikes',
  initialState,
  reducers: {
    addDeckId: (state, action) => {
      state.decksLikesSet.add(action.payload);
    },
    removeDeckId: (state, action) => {
      state.decksLikesSet.delete(action.payload);
    },
    setDecksLikesSet: (state, action) => {
      state.decksLikesSet = new Set(action.payload);
    },
   
  },
});

export const { 
  addDeckId, removeDeckId, setDecksLikesSet, 
} = likesSlice.actions;

export const selectDecksLikesSet = (state: { likes: { decksLikesSet: Set<string> } }) => state.likes.decksLikesSet;


export default likesSlice.reducer;
