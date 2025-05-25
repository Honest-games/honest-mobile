import { FetchArgs } from '@reduxjs/toolkit/query'
import { api } from '@shared/api'

export const questionLikesApi = api.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
})

export const {
  useLikeQuestionMutation,
  useDislikeQuestionMutation,
} = questionLikesApi 