import { api } from '@shared/api'
import { IDeck } from '../model/types'

export const decksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDecks: builder.query<IDeck[], any>({
      query: (x: { clientId: string }) => `https://chestno-game.online/honest-be/api/v1/decks?clientId=${x.clientId}`,
      providesTags: (_) => ["Decks"],
    }),

    // getDecks: builder.query<IDeck[], any>({
    //   query: (x: { language: string; clientId: string }) => `https://logotipiwe.ru/haur/api/v3/decks?languageCode=${x.language}&clientId=${x.clientId}`,
    //   providesTags: (_) => ["Decks"],
    // //   keepUnusedDataFor: 300,
    // }),
    getAllQuestions: builder.query<any, any>({
      query: (x: { deckId: string; time: number }) => 
        `https://logotipiwe.ru/haur/api/v1/deck/${x.deckId}/questions`,
    }),
    shuffleDeck: builder.mutation<any, {deckId: string, userId: string}>({
      query: ({deckId, userId}) => ({
        url: `https://logotipiwe.ru/honest/api/v1/decks/${deckId}/shuffle?clientId=${userId}`,
        method: 'POST'
      }),
    }),
  }),
})

export const {
  useGetDecksQuery,
  useGetAllQuestionsQuery,
  useShuffleDeckMutation,
} = decksApi 