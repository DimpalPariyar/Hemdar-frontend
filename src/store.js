import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./pages/cart/CartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
