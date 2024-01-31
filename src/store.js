import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./pages/cart/CartSlice";
import { authApi } from "./apiSlice/authApiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./reduxStoreSlice/authSlice";
// import axiosMiddleware from "./middleware/axiosMiddleware";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);
