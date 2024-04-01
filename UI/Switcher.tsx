import Colors from '@/constants/Colors'
import { useAppDispatch, useAppSelector } from '@/features/hooks/useRedux'
import { setLanguage } from '@/store/reducer/language-slice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated'

interface SwitcherProps {
	onLanguageChange: (language: string) => void
	switcherStyle: any
}

const Switcher: React.FC<SwitcherProps> = ({
	onLanguageChange,
	switcherStyle
}) => {
	const dispatch = useAppDispatch()
	const language = useAppSelector(state => state.language.language)

	// Получаем язык из AsyncStorage и устанавливаем его в состояние isEnglish
	const [isEnglish, setIsEnglish] = useState<boolean>(language === 'en')
	const translateX = useSharedValue(language === 'en' ? 48 : 0)

	useEffect(() => {
		const fetchLanguage = async () => {
			const storedLanguage = await AsyncStorage.getItem('language')
			if (storedLanguage) {
				setIsEnglish(storedLanguage === 'en')
				translateX.value = withTiming(storedLanguage === 'en' ? 48 : 0, {
					duration: 300
				})
			}
		}
		fetchLanguage()
	}, [])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }]
		}
	})

	const toggleSwitch = async () => {
		const newLanguageValue = !isEnglish ? 'en' : 'ru'
		try {
			await AsyncStorage.setItem('language', newLanguageValue)
			dispatch(setLanguage(newLanguageValue))
			setIsEnglish(!isEnglish)
			onLanguageChange(newLanguageValue)
			translateX.value = withTiming(isEnglish ? 0 : 48, { duration: 300 })
		} catch (e) {
			console.error('Ошибка при сохранении языка в AsyncStorage:', e)
		}
	}

	const localeRu = 'RU'
	const localeEn = 'EN'

	return (
		<Animated.View style={[styles.container, switcherStyle]}>
			<TouchableOpacity onPress={toggleSwitch} style={styles.switcher}>
				<Animated.View style={[styles.knob, animatedStyle]} />
				<View style={styles.labels}>
					<Text
						style={[
							styles.label,
							{
								color: language !== 'en' ? 'white' : Colors.grey1,
								marginLeft: Platform.OS === 'ios' ? 13 : 15
							}
						]}
					>
						{localeRu}
					</Text>
					<Text
						style={[
							styles.label,
							{
								color: language !== 'en' ? Colors.grey1 : 'white',
								marginRight: Platform.OS === 'ios' ? 13 : 15,
								zIndex: 100000
							}
						]}
					>
						{localeEn}
					</Text>
				</View>
			</TouchableOpacity>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: 96,
		height: 48,
		zIndex: 100,
		borderRadius: 24,
		backgroundColor: 'white',
		justifyContent: 'center'
	},
	switcher: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: '100%'
	},
	knob: {
		width: 48,
		height: 48,
		borderRadius: 25,
		backgroundColor: '#b3d4c6',
		position: 'absolute'
	},
	labels: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%'
	},
	label: {
		zIndex: 100,
		textAlign: 'center',
		fontWeight: '400',
		fontSize: 14,
		color: '#666'
	}
})

export default Switcher
