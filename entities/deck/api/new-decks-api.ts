import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IDeck } from "../model/types";

// API для работы с новым бэкендом chestno-game.online
export const newDecksApi = createApi({
  reducerPath: "newDecksApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://chestno-game.online/" }),
  tagTypes: ["Decks"],
  endpoints: (builder) => ({
    getNewDecks: builder.query<IDeck[], any>({
      query: (x: { clientId: string }) => `honest-be/api/v1/decks?clientId=${x.clientId}`,
      providesTags: (_) => ["Decks"],
    }),
  }),
});

export const {
  useGetNewDecksQuery,
} = newDecksApi; 