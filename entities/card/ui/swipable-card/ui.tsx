import React, { memo } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'

const { height } = Dimensions.get('screen')
const screenWidth = Dimensions.get('screen').width
export const tinderCardWidth = screenWidth * 0.8

interface ICard {
	allowDrag: boolean
	swipe?: any
	children: React.ReactNode
}

export const SwipableCard = memo((props: ICard) => {
	const {
		swipe,
		allowDrag,
		children,
		...rest
	} = props

	const styles = StyleSheet.create({
		card: {
			flex: 1,
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	})

	const rotate = swipe.x.interpolate({
		inputRange: [-100, 0, 100],
		outputRange: ['8deg', '0deg', '-8deg']
	})

	return (
		<Animated.View
			style={[
				styles.card,
				allowDrag && {
					transform: [...swipe.getTranslateTransform(), { rotate: rotate }]
				}
			]}
			{...rest}
		>
			{children}
		</Animated.View>
	)
}) 