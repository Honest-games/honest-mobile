// store.ts
import { api } from '@/services/api'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { enableMapSet } from 'immer'
import { useDispatch } from 'react-redux'
import deckLikeReducer from '../../../store/reducer/deck-likes-slice'
import cardsOfDeckReducer from '../../../store/reducer/deck-slice'
import languageReducer from '@/features/language/model/slice'
import { questionLikesReducer } from '@/features/question-likes/model'
import { levelsReducer } from '@/entities/level/model' 
import userReducer from '../../../store/reducer/user-slice'
import { splashReducer } from '@/features/animation/model/slice'
import { profileReducer } from '@/entities/profile/model'
import { ThunkAction, Action } from '@reduxjs/toolkit'
import appReducer from '../../../store/reducer/app-slice'
import { newDecksApi } from '@/entities/deck'

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	[newDecksApi.reducerPath]: newDecksApi.reducer,
	cardsOfDeck: cardsOfDeckReducer,
	language: languageReducer,
	decksLikes: deckLikeReducer,
	questionsLikes: questionLikesReducer,
	levels: levelsReducer,
	user: userReducer,
	splash: splashReducer,
	app: appReducer,
	profile: profileReducer
})

enableMapSet()

const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: false
		}).concat(api.middleware, newDecksApi.middleware)
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>

export default store
