// api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IDeck } from '../types/types'

// http://logotipiwe.ru/haur/api/v2/

export const apiV2 = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://logotipiwe.ru/haur/api/v2/decks?languageCode=en'
	}),
	endpoints: builder => ({
		getDecksV2: builder.query<IDeck[], void>({
			query: () => 'decks'
		})
	})
})

export const { useGetDecksV2Query } = apiV2
