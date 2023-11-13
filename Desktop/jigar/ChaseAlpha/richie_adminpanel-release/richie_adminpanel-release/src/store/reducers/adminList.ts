// types
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from 'config';
import axios from 'utils/axios';
import { dispatch } from '../index';

const defaultPermissions = [
  {
    value: 0,
    label: 'User'
  },
  {
    value: 1,
    label: 'Advisory Admin'
  },
  {
    value: 2,
    label: 'Learn Module Admin'
  },
  {
    value: 3,
    label: 'Trade flash Admin'
  },
  {
    value: 4,
    label: 'Super Admin'
  }
];
const initialState: any = {
  adminList: [],
  permissions: defaultPermissions
};

const adminList = createSlice({
  name: 'adminList',
  initialState,
  reducers: {
    setAdminList(state, action) {
      state.adminList = action.payload;
    },
    setPermissions(state, action) {
      state.permissions = action.payload;
    },
    reset: () => initialState
  }
});

export default adminList.reducer;

export const { setAdminList, reset } = adminList.actions;

export function getAdminList() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/list`);
      dispatch(adminList.actions.setAdminList(response.data?.data));
    } catch (error) {
      console.log({ error: error });
    }
  };
}

export function getPermissions() {
  return async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/userRights`);
      const keys = Object.keys(response.data);
      const data = keys.map((key) => ({ value: key, label: response.data[key] }));
      dispatch(adminList.actions.setPermissions(data));
    } catch (error) {
      console.log({ error: error });
    }
  };
}
