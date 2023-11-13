// types
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from 'config';
import axios from 'utils/axios';


// initial state
const initialState: any = {
  programSessions: [],
  sessionId: ''
};

// ==============================|| SLICE - MENU ||============================== //

const programSession = createSlice({
  name: 'programSession',
  initialState,
  reducers: {
    setProgramSessions(state, action) {
      state.programSessions = action.payload;
    },
    reset: () => initialState
  }
});

export default programSession.reducer;

export const { reset } = programSession.actions;

export function getProgramSessions() {
  return async (dispatch:any) => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/session`);

      // const sortedAsc = response.data?.data.sort((objA: any, objB: any) => objA.date.getTime() - objB.date.getTime());
      const sortedAsc = response.data?.sort((a: any, b: any) => a.date.localeCompare(b.date));
      

      dispatch(programSession.actions.setProgramSessions(sortedAsc));
    } catch (error) {
      console.log(error);
    }
  };
}
