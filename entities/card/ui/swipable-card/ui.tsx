import React, { memo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, {
	useAnimatedStyle,
	interpolate,
	SharedValue,
} from 'react-native-reanimated'

const screenWidth = Dimensions.get('screen').width
export const tinderCardWidth = screenWidth * 0.8

interface ICard {
	allowDrag: boolean
	swipeX?: SharedValue<number>
	swipeY?: SharedValue<number>
	children: React.ReactNode
}

export const SwipableCard = memo((props: ICard) => {
	const {
		swipeX,
		swipeY,
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

	const animatedStyle = useAnimatedStyle(() => {
		if (!swipeX || !swipeY || !allowDrag) {
			return {};
		}

		const rotate = interpolate(
			swipeX.value,
			[-100, 0, 100],
			[8, 0, -8]
		);

		return {
			transform: [
				{ translateX: swipeX.value },
				{ translateY: swipeY.value },
				{ rotate: `${rotate}deg` },
			],
		};
	}, [allowDrag]);

	return (
		<Animated.View
			style={[
				styles.card,
				animatedStyle
			]}
			{...rest}
		>
			{children}
		</Animated.View>
	)
}) 