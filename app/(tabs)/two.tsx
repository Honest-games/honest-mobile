import Screen2 from '@/assets/svg/Screen2'
import Colors from '@/constants/Colors'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'

const LikesScreen = () => {
	const [animation] = useState(new Animated.Value(1))

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(animation, {
					toValue: 1.2,
					duration: 500,
					easing: Easing.linear,
					useNativeDriver: true
				}),
				Animated.timing(animation, {
					toValue: 1,
					duration: 500,
					easing: Easing.linear,
					useNativeDriver: true
				})
			])
		).start()
	}, [animation])

	const heartStyle = {
		transform: [{ scale: animation }]
	}

	const { t } = useTranslation()

	return (
		<View style={styles.container}>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					backgroundColor: 'white',
					width: 273,
					height: 254,
					borderRadius: 20,
					position: 'relative'
				}}
			>
				{/* <Image source={require('@/assets/svg/')} style={heartStyle} /> */}
				<View style={{ position: 'absolute', top: 32 }}>
					<Screen2 />
				</View>

				<Text
					style={{
						width: '80%',
						fontWeight: 'bold',
						fontSize: 20,
						position: 'absolute',
						top: 125,
						textAlign: 'center'
					}}
				>
					{t('favoritesSoon')}
				</Text>
				<Text
					style={{
						width: '80%',
						fontWeight: 'bold',
						fontSize: 12,
						color: Colors.grey1,
						textAlign: 'center',
						position: 'absolute',
						top: 190
					}}
				>
					{t('favoritesSoonDesc')}
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default LikesScreen
