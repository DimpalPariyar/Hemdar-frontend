import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: [],
};
const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    inputCard: (state, action) => {
      return {
        ...state,
        cards: [...state.cards, action.payload],
        // state.push(action.payload);
      };
    },
  },
});

export const { inputCard } = cardSlice.actions;
export default cardSlice.reducer;
