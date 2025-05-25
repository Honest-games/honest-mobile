// api.ts
import { FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IDeck, ILevelData, IQuestion } from "./types/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://logotipiwe.ru/" }),
  tagTypes: ["Decks", "Levels", "Question"],
  //   refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({
    // эндпоинт getDecks был перенесен в entities/deck/api/new-decks-api.ts
    getDecks: builder.query<IDeck[], any>({
      query: (x: { language: string; clientId: string }) => `/v3/decks?languageCode=${x.language}&clientId=${x.clientId}`,
      providesTags: (_) => ["Decks"],
    //   keepUnusedDataFor: 300,
    }),
    getLevels: builder.query<ILevelData[], { deckId: string; time: number; clientId: string }>({
      query: (x: { deckId: string; clientId: string; time: number }) => `haur/api/v1/deck/${x.deckId}/levels?clientId=${x.clientId}`,
    }),
    getQuestion: builder.query<IQuestion, { levelId: string; clientId: string; timestamp: number }>({
      query: ({ levelId, clientId, timestamp }) => `haur/api/v1/question?&levelId=${levelId}&clientId=${clientId}&time=${timestamp}`,
    }),
    getAllQuestions: builder.query<any, any>({
      query: (x: { deckId: string; time: number }) => `haur/api/v1/deck/${x.deckId}/questions`,
    }),

    getVectorImage: builder.query<any, any>({
      query: (x: { imageId: string; time: number }) => `haur/api/v1/get-vector-image/${x.imageId}`,
      transformResponse: (response: Response) => response.text(),
    }),
    getAllLikes: builder.query<any, any>({
      query: (userId) => `haur/api/v1/user/${userId}/likes`,
    }),
    likeDeck: builder.mutation<FetchArgs | any, any>({
      query: ({ deckId, userId }) => {
        return {
          url: `haur/api/v1/deck/${deckId}/like?userId=${userId}`,
          method: "POST",
          body: { deckId, userId },
        };
      },
    }),
    dislikeDeck: builder.mutation<FetchArgs | any, any>({
      query: ({ deckId, userId }) => {
        return {
          url: `haur/api/v1/deck/${deckId}/dislike?userId=${userId}`,
          method: "POST",
          body: { deckId, userId },
        };
      },
    }),
    likeQuestion: builder.mutation<FetchArgs | any, any>({
      query: ({ questionId, userId }) => {
        return {
          url: `haur/api/v1/question/${questionId}/like?userId=${userId}`,
          method: "POST",
          body: { questionId, userId },
        };
      },
    }),
    dislikeQuestion: builder.mutation<FetchArgs | any, any>({
      query: ({ questionId, userId }) => {
        return {
          url: `haur/api/v1/question/${questionId}/dislike?userId=${userId}`,
          method: "POST",
          body: { questionId, userId },
        };
      },
    }),
    sendPromo: builder.mutation<FetchArgs | any, any>({
      query: ({ promo, userId }) => {
        return {
          url: `haur/api/v1/enter-promo/${promo}?clientId=${userId}`,
          method: "POST",
        };
      },
    }),
    shuffleLevel: builder.mutation<any, { levelId: string; userId: string }>({
      query: ({ levelId, userId }) => ({
        url: `honest/api/v1/levels/${levelId}/shuffle?clientId=${userId}`,
        method: "POST",
      }),
    }),
    shuffleDeck: builder.mutation<any, { deckId: string; userId: string }>({
      query: ({ deckId, userId }) => ({
        url: `honest/api/v1/decks/${deckId}/shuffle?clientId=${userId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetDecksQuery,
  useGetLevelsQuery,
  useGetQuestionQuery,
  useGetAllQuestionsQuery,
  useGetVectorImageQuery,
  useLikeDeckMutation,
  useDislikeDeckMutation,
  useLikeQuestionMutation,
  useDislikeQuestionMutation,
  useGetAllLikesQuery,
  useSendPromoMutation,
  useShuffleLevelMutation,
  useShuffleDeckMutation,
} = api;
