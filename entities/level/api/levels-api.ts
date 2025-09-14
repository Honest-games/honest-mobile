import { api } from '@shared/api'
import { ILevelData } from '../model/types'

export const levelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<ILevelData[], { deckId: string; clientId: string }>({
      query: (x: { deckId: string; clientId: string }) => 
        `https://chestno-game.online/honest-be/api/v1/levels?clientId=${x.clientId}&deckId=${x.deckId}`,
    }),
    shuffleLevel: builder.mutation<any, {levelId: string, userId: string}>({
      query: ({levelId, userId}) => ({
        url: `https://chestno-game.online/honest-be/api/v1/levels/${levelId}/shuffle?clientId=${userId}`,
        method: 'POST'
      }),
    }),
  }),
})

export const {
  useGetLevelsQuery,
  useShuffleLevelMutation,
} = levelsApi 