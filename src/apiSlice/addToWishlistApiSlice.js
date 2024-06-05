import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";

export const addToWishlistApi = createApi({
  reducerPath: "addToWishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: "cart/add-to-wishlist",
        method: "POST",
        body: { productId: data },
      }),
    }),

    getWishlist: builder.query({
      query: () => "cart/wishlist/details",
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  //   useRemoveFromWishlistQuery,
} = addToWishlistApi;
