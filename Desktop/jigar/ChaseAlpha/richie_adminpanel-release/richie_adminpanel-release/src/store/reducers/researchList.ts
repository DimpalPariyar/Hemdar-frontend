// types
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { dispatch } from '../index';

const initialState: any = {
  researchList: []
};

const researchList = createSlice({
  name: 'researchList',
  initialState,
  reducers: {
    setResearchList(state, action) {
      state.researchList = action.payload;
    },
    reset: () => initialState
  }
});

export default researchList.reducer;

export function getResearchList() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/researchlist`);
      dispatch(researchList.actions.setResearchList(response.data?.data) || []);
    } catch (error) {
      console.log({ error: error });
    }
  };
}
