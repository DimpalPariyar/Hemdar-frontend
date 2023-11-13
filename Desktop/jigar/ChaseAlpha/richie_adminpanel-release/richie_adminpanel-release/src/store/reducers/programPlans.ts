// types
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { dispatch } from '../index';

// initial state
export const initialState: any = {
  programPlanId: '',
  programPlans: null,
  updateOperations: {}
};

// ==============================|| SLICE - program plans ||============================== //

const programPlan = createSlice({
  name: 'programPlan',
  initialState,
  reducers: {
    setProgramPlan(state, action) {
      state.programPlans = action.payload;
    },
    setUpdateOperations(state, action) {
      state.updateOperations = action.payload;
    },
    reset: () => initialState
  }
});

export default programPlan.reducer;

export const { reset } = programPlan.actions;

export function getProgramPlans() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/plan`);
      dispatch(programPlan.actions.setProgramPlan(response.data));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getUpdateOperations() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/learning/updateOperations`);
      dispatch(programPlan.actions.setUpdateOperations(response.data?.data || {}));
    } catch (error) {
      console.log(error);
    }
  };
}
