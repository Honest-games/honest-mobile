import { useColorScheme } from '@/components/default/useColorScheme'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import store from './store'

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
	const colorScheme = useColorScheme()
	const router = useRouter()
	// Expo Router uses Error Boundaries to catch errors in the navigation tree.

	useEffect(() => {
		if (error) throw error
	}, [error])

	const generateAndSaveUUID = async () => {
		try {
			const uuid = '1212'

			await AsyncStorage.setItem('user_id', uuid)

			console.log('UUID успешно сохранен:', uuid)
		} catch (error) {
			console.error('Ошибка при сохранении UUID в AsyncStorage:', error)
		}
	}

	useEffect(() => {
		if (loaded || error) {
			// SplashScreen.hideAsync()

			setAppReady(true)
			generateAndSaveUUID()
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
		</Provider>
	)
}
