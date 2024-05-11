import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./ReduxStoreSlice/cardSlice";

export const store = configureStore({
  reducer: {
    card: cardReducer,
  },
});
