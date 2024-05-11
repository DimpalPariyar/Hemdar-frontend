import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
