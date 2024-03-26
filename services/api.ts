// api.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
	BaseQueryApi,
	FetchArgs,
	createApi,
	fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
import { IDeck, ILevelData, IQuestion } from './types/types'

// http://logotipiwe.ru/haur/api/v1/
const dynamicBaseQuery = async (
	args: string | FetchArgs,
	api: BaseQueryApi,
	extraOptions: {}
) => {
	const version = (await AsyncStorage.getItem('language')) || 'v1'
	console.log('dynamic version', version)
	const baseUrl = `http://logotipiwe.ru/haur/api/${version}/`

	// Вызываем fetchBaseQuery с динамическим baseUrl
	const baseQuery = fetchBaseQuery({ baseUrl })

	// Выполняем запрос с обновленным baseUrl
	return baseQuery(args, api, extraOptions)
}

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://logotipiwe.ru/haur/api/v1/' }),
	endpoints: builder => ({
		getDecks: builder.query<IDeck[], void>({
			query: () => 'decks'
		}),
		getLevels: builder.query<ILevelData[], string>({
			query: deckId => `levels?deckId=${deckId}`
		}),
		getQuestion: builder.query<
			IQuestion,
			{ levelId: string; clientId: string }
		>({
			query: ({ levelId, clientId }) =>
				`question?&levelId=${levelId}&clientId=${clientId}`
		}),
		getAllQuestions: builder.query<any, any>({
			query: deckId => `deck/${deckId}/questions`
		}),

		getVectorImage: builder.query<any, any>({
			query: (imageId) => `get-vector-image/${imageId}`,
      transformResponse: (response: Response) => response.text(),
		})
	})
})

export const {
	useGetDecksQuery,
	useGetLevelsQuery,
	useGetQuestionQuery,
	useGetAllQuestionsQuery,
	useGetVectorImageQuery
} = api
