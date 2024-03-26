// store.ts
import { api } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch } from 'react-redux'
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore
} from 'redux-persist'
import cardsOfDeckReducer from './reducer/deck-slice'

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	cardsOfDeck: cardsOfDeckReducer
})

const persistConfig = {
	key: 'root',
	storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		}).concat(api.middleware)
})
setupListeners(store.dispatch)

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
