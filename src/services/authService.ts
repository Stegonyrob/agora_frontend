import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_ENDPOINT_GENERAL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,

    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { userToken: string | null } };
      const token = state.auth.userToken;
      console.log(state.auth.userToken);
      console.log(baseUrl);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (build) => ({
    getUserDetails: build.query({
      query: () => ({
        url: `${baseUrl}/any/users/profiles/getById/{id}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetUserDetailsQuery } = authApi;
