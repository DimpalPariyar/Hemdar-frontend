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
    updateProduct: builder.mutation({
      query: (data) => {
        return {
          url: `products/${data._id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    getAllProducts: builder.query({
      query: () => "products",
    }),
    getSingleProduct: builder.query({
      query: (productId) => `products/${productId}`,
    }),
    deleteProduct: builder.mutation({
      query: (productId) => {
        return {
          url: `products/${productId}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = addProductApi;
