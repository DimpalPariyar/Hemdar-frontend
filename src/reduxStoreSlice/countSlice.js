import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: false,
};

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    countRefetch: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { countRefetch } = countSlice.actions;

export default countSlice.reducer;
