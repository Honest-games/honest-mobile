import FontAwesome from '@expo/vector-icons/FontAwesome'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import uuid from 'react-native-uuid'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import '../constants/i18n/i18n.config'
import store, { persistor } from '../store/store'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
	initialRouteName: '(tabs)'
}

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font
	})
	const [appReady, setAppReady] = useState(false)
	const [splashAnimationFinished, setSplashAnimationFinished] = useState(false)
	const router = useRouter()
	// Expo Router uses Error Boundaries to catch errors in the navigation tree.

	useEffect(() => {
		if (error) throw error
	}, [error])

	const generateAndSaveUUID = async () => {
		try {
			const id = uuid.v4()

			await AsyncStorage.setItem('user_id', id.toString())

			console.log('UUID успешно сохранен:', id)
		} catch (error) {
			console.error('Ошибка при сохранении UUID в AsyncStorage:', error)
		}
	}

	const getData = async () => {
		try {
			const user = await AsyncStorage.getItem('user_id')
			if (user !== null) {
				console.log('UUID успешно получен:', user)
				return user
			}

			
		} catch (e) {
			console.error('Ошибка чтения из AsyncStorage:', e)
		}
	}

	useEffect(() => {
		if (loaded || error) {
			// SplashScreen.hideAsync()

			const user = getData()
			if (!user) {
				generateAndSaveUUID()
			}

			setAppReady(true)
		}
	}, [loaded, error])

	if (!loaded) {
		return null
	}

	const showAnimatedSplash = !appReady || !splashAnimationFinished

	// if (showAnimatedSplash) {
	// 	return (
	// 		<AnimateSplashScreen
	// 			onAnimationFinish={isCancelled => {
	// 				if (!isCancelled) {
	// 					setSplashAnimationFinished(true)
	// 				}
	// 			}}
	// 		/>
	// 	)
	// }

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						{/* <ThemeProvider
						value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
					> */}
						<Stack>
							<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
							<Stack.Screen
								name='decks/[id]'
								options={{
									headerShown: false
								}}
							/>
						</Stack>
						{/* </ThemeProvider> */}
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</PersistGate>
		</Provider>
	)
}
