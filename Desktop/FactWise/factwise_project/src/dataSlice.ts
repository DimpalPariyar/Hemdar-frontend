import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: string;
  email: string;
  picture: string;
  country: string;
  description: string;
}

interface DataState {
  items: Item[];
  originaldata: Item[];
}

const initialState: DataState = {
  items: [],
  originaldata: [],
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      state.originaldata = action.payload;
    },
    filterData: (state, action: PayloadAction<string>) => {
      const filteredData = state.originaldata.filter((user) => {
        return user?.first
          ?.toLowerCase()
          .includes(action.payload.toLowerCase());
      });
      //   console.log(action.payload);
      state.items = filteredData;
    },
    deleteData: (state, action: PayloadAction<number>) => {
      const deletedData = state.items.filter((user) => {
        return user.id !== action.payload;
      });
      state.items = deletedData;
    },
  },
});

export const { setData, filterData, deleteData } = dataSlice.actions;

export default dataSlice.reducer;
