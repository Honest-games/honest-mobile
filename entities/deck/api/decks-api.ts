import { api } from '@shared/api'
import { IDeck } from '../model/types'

export const decksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Этот эндпоинт переехал в new-decks-api.ts
    // getDecks: builder.query<IDeck[], any>({
    //   query: (x: { language: string; clientId: string }) => 
    //     `haur/api/v3/decks?languageCode=${x.language}&clientId=${x.clientId}`,
    //   providesTags: (_) => ["Decks"],
    // }),
    getAllQuestions: builder.query<any, any>({
      query: (x: { deckId: string; time: number }) => 
        `haur/api/v1/deck/${x.deckId}/questions`,
    }),
    shuffleDeck: builder.mutation<any, {deckId: string, userId: string}>({
      query: ({deckId, userId}) => ({
        url: `honest/api/v1/decks/${deckId}/shuffle?clientId=${userId}`,
        method: 'POST'
      }),
    }),
  }),
})

export const {
  // useGetDecksQuery,
  useGetAllQuestionsQuery,
  useShuffleDeckMutation,
} = decksApi 