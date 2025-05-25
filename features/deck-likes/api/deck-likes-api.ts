import { FetchArgs } from '@reduxjs/toolkit/query'
import { api } from '@shared/api'

export const deckLikesApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
})

export const {
  useGetAllLikesQuery,
  useLikeDeckMutation,
  useDislikeDeckMutation,
} = deckLikesApi 