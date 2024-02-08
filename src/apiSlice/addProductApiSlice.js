import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const addProductApi = createApi({
  reducerPath: "addProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3004",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: "products",
        method: "POST",
        body: data,
      }),
    }),
    getAllProducts: builder.query({
      query: () => "products",
    }),
  }),
});

export const { useAddProductMutation, useGetAllProductsQuery } = addProductApi;
