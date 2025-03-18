// store.ts
import { api } from '@/services/api'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { enableMapSet } from 'immer'
import { useDispatch } from 'react-redux'
import deckLikeReducer from './reducer/deck-likes-slice'
import cardsOfDeckReducer from './reducer/deck-slice'
import languageReducer from './reducer/language-slice'
import questionLikeReducer from './reducer/question-like-slice'
import levelsReducer from './reducer/levels-slice'
import userReducer from './reducer/user-slice'
import splashReducer from './reducer/splash-animation-slice'
import appReducer from './reducer/app-slice'
import profileReducer from './reducer/profile-slice'
import { ThunkAction, Action } from '@reduxjs/toolkit'


const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	cardsOfDeck: cardsOfDeckReducer,
	language: languageReducer,
	decksLikes: deckLikeReducer,
	questionsLikes: questionLikeReducer,
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
		}).concat(api.middleware)
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
