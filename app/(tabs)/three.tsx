import React, { useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'

const HeartAnimation = () => {
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

	return (
		<View style={styles.container}>
			<Text>Здесь пока нет контента</Text>
			{/* <Animated.View style={heartStyle}>
				<Ionicons name='heart' size={150} color='red' />
			</Animated.View> */}
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

export default HeartAnimation
