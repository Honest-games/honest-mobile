import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "", // Будем использовать полные URL в эндпоинтах
  }),
  tagTypes: ["Decks", "Levels", "Question", "Users"],
  endpoints: () => ({}),
});

export type ApiType = typeof api; 