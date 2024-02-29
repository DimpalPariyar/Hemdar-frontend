import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3004",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        body: userData,
        credentials: "include",
      }),
    }),
    userData: builder.query({
      query() {
        return {
          url: "Users",
          credentials: "include",
        };
      },
    }),
    singleUser: builder.query({
      query: () => `Users/details`,
      // credentials: "include",
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "Users",
        method: "PUT",
        body: userData,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useUserDataQuery,
  useSingleUserQuery,
  useUpdateUserMutation,
} = authApi;
