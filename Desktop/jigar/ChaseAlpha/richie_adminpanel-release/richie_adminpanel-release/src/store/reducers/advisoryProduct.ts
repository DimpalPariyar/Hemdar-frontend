// types
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { dispatch } from '../index';

// initial state
const initialState: any = {
  advisoryProducts: []
};

const advisoryProduct = createSlice({
  name: 'advisoryProduct',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.advisoryProducts = action.payload;
    },
    reset: () => initialState
  }
});

export default advisoryProduct.reducer;

export function getAdvisoryProducts() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/advisory/product`);
      dispatch(advisoryProduct.actions.setProducts(response.data) || []);
    } catch (error) {
      console.log(error);
    }
  };
}
