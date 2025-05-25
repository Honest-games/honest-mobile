import { api } from '@shared/api'
import { IQuestion } from '../model/types'

export const questionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQuestion: builder.query<IQuestion, { levelId: string; clientId: string; timestamp: number }>({
      query: ({ levelId, clientId, timestamp }) => 
        `haur/api/v1/question?&levelId=${levelId}&clientId=${clientId}&time=${timestamp}`,
    }),
    getVectorImage: builder.query<any, any>({
      query: (x: { imageId: string; time: number }) => 
        `haur/api/v1/get-vector-image/${x.imageId}`,
      transformResponse: (response: Response) => response.text(),
    }),
  }),
})

export const {
  useGetQuestionQuery,
  useGetVectorImageQuery,
} = questionsApi 