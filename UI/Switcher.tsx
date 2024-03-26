import Colors from '@/constants/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
	const [isEnglish, setIsEnglish] = useState(true)
	const translateX = useSharedValue(0)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }]
		}
	})

	const toggleSwitch = async () => {
		translateX.value = withTiming(isEnglish ? 48 : 0, { duration: 300 })
		const newLanguageValue = isEnglish ? 'v2' : 'v1'
		console.log(newLanguageValue)
		try {
			await AsyncStorage.setItem('language', newLanguageValue)
		} catch (e) {
			console.error('Ошибка при сохранении языка в AsyncStorage:', e)
		}
		setIsEnglish(!isEnglish)
		onLanguageChange(isEnglish ? 'ru' : 'en')
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
							{ color: isEnglish ? 'white' : Colors.grey1, marginLeft: 13 }
						]}
					>
						{localeRu}
					</Text>
					<Text
						style={[
							styles.label,
							{
								color: isEnglish ? Colors.grey1 : 'white',
								marginRight: 13,
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
