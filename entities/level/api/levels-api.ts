import { api } from '@shared/api'
import { ILevelData } from '../model/types'

export const levelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<ILevelData[], { deckId: string; time: number; clientId: string }>({
      query: (x: { deckId: string; clientId: string; time: number }) => 
        `haur/api/v1/deck/${x.deckId}/levels?clientId=${x.clientId}`,
    }),
    shuffleLevel: builder.mutation<any, {levelId: string, userId: string}>({
      query: ({levelId, userId}) => ({
        url: `honest/api/v1/levels/${levelId}/shuffle?clientId=${userId}`,
        method: 'POST'
      }),
    }),
  }),
})

export const {
  useGetLevelsQuery,
  useShuffleLevelMutation,
} = levelsApi 