import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://logotipiwe.ru/" }),
  tagTypes: ["Decks", "Levels", "Question"],
  endpoints: () => ({}),
});

export type ApiType = typeof api; 