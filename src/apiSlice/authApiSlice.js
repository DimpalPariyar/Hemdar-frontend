import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3004",
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
  }),
});

export const { useSignupMutation, useLoginMutation, useUserDataQuery } =
  authApi;
