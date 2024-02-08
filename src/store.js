import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apiSlice/authApiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./reduxStoreSlice/authSlice";
import countReducer from "./reduxStoreSlice/countSlice";
import { addProductApi } from "./apiSlice/addProductApiSlice";
import { addToCartApi } from "./apiSlice/addToCartApiSlice";

// import axiosMiddleware from "./middleware/axiosMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    count: countReducer,
    [authApi.reducerPath]: authApi.reducer,
    [addProductApi.reducerPath]: addProductApi.reducer,
    [addToCartApi.reducerPath]: addToCartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(addProductApi.middleware)
      .concat(addToCartApi.middleware),
});

setupListeners(store.dispatch);
