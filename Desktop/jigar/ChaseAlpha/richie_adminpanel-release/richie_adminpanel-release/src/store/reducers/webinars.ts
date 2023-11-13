// types
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { dispatch } from '../index';

// initial state
const initialState: any = {
  webinars: []
};

const webinars = createSlice({
  name: 'webinars',
  initialState,
  reducers: {
    setWebinars(state, action) {
      state.webinars = action.payload;
    },
    reset: () => initialState
  }
});

export default webinars.reducer;

export function getWebinars() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/webinar`);
      dispatch(webinars.actions.setWebinars(response.data) || []);
    } catch (error) {
      console.log(error);
    }
  };
}
