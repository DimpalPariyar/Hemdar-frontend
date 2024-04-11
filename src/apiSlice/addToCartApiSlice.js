import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";

export const addToCartApi = createApi({
  reducerPath: "addToCartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (data) => ({
        url: "products/add-to-cart",
        method: "POST",
        body: data,
      }),
    }),

    getCartDetails: builder.query({
      query: () => "cart",
    }),

    getCountOfItemsInCart: builder.query({
      query: () => "cart/count",
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartDetailsQuery,
  useGetCountOfItemsInCartQuery,
} = addToCartApi;
