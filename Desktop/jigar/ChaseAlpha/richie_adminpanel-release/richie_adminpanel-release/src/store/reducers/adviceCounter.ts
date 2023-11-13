import { createSlice } from '@reduxjs/toolkit';

const adviceCounter = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    adviceValue: (state, action) => action.payload
  }
});

export const { adviceValue } = adviceCounter.actions;
export default adviceCounter.reducer