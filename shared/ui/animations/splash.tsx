import LottieView from 'lottie-react-native'
import React, { useRef, useEffect } from 'react'
import { Dimensions, View } from 'react-native'
import * as Haptics from 'expo-haptics'

interface ISplashScreen {
	onAnimationFinish?: (isCancelled: boolean) => void
}

const { height } = Dimensions.get('screen')

export const AnimateSplashScreen = ({ onAnimationFinish }: ISplashScreen) => {
	const animation = useRef<LottieView>(null)
	const hapticTimersRef = useRef<NodeJS.Timeout[]>([])
	
	useEffect(() => {
		const hapticPattern = []
		
		for (let i = 0; i <= 1000; i += 20) {
			let type = 'light'
			
			if (i < 300) type = 'light'
			else if (i < 600) type = i % 100 === 0 ? 'medium' : 'light'
			else if (i < 800) type = i % 120 === 0 ? 'medium' : 'light'
			else type = i % 80 === 0 ? 'medium' : 'light'
			
			hapticPattern.push({ delay: i, type })
		}
		
		hapticPattern.push({ delay: 1000, type: 'success' })
		
		hapticPattern.forEach(({ delay, type }) => {
			const timer = setTimeout(() => {
				switch (type) {
					case 'light':
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
						break
					case 'medium':
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
						break
					case 'heavy':
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
						break
					case 'success':
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
						break
				}
			}, delay)
			
			hapticTimersRef.current.push(timer)
		})
		
		return () => {
			hapticTimersRef.current.forEach(timer => clearTimeout(timer))
			hapticTimersRef.current = []
		}
	}, [])
	
	return (
		<View style={{ height: height, backgroundColor: '#f3f3f3' }}>
			<LottieView
				loop={false}
				onAnimationFinish={onAnimationFinish}
				style={{ height: height, width: '100%' }}
				ref={animation}
				autoPlay
				source={require('@/assets/animations/anime.json')}
			/>
		</View>
	)
}

