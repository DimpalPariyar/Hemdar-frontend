// types
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { dispatch } from '../index';

// initial state
const initialState: any = {
  programList: [],
  programName: '',
  programId: '',
  currentProgramDetails: {}
};

const specialProgram = createSlice({
  name: 'specialProgram',
  initialState,
  reducers: {
    setProgramId(state, action) {
      state.programId = action.payload.programId;
    },
    setProgramName(state, action) {
      state.programName = action.payload.programName;
    },
    setProgramList(state, action) {
      state.programList = action.payload;
    },
    setCurrentProgramDetails(state, action) {
      state.currentProgramDetails = action.payload;
    },
    reset: () => initialState
  }
});

export default specialProgram.reducer;

export const { setProgramId, setProgramName, reset } = specialProgram.actions;

export function getProgramList() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/programlist`);
      dispatch(specialProgram.actions.setProgramList(response.data?.data) || []);
      // console.log(response.data?.data)
    } catch (error) {
      console.log(error);
    }
  };
}

export function getCurrentProgram(programId: string) {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/program/${programId}`);
      // console.log(response.data?.data);
      dispatch(specialProgram.actions.setCurrentProgramDetails(response.data?.data));
    } catch (error) {
      console.log(error);
    }
  };
}
