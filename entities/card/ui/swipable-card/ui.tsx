import React, { memo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, {
	useAnimatedStyle,
	interpolate,
	SharedValue,
	withTiming,
} from 'react-native-reanimated'

const screenWidth = Dimensions.get('screen').width
export const tinderCardWidth = screenWidth * 0.8

interface ICard {
	allowDrag: boolean
	swipeX?: SharedValue<number>
	swipeY?: SharedValue<number>
	isVisible?: boolean
	children: React.ReactNode
}

export const SwipableCard = memo((props: ICard) => {
	const {
		swipeX,
		swipeY,
		allowDrag,
		isVisible = true,
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
		const baseStyle: any = {
			opacity: withTiming(isVisible ? 1 : 0, { duration: 200 }),
		};

		if (!swipeX || !swipeY || !allowDrag) {
			return baseStyle;
		}

		const rotate = interpolate(
			swipeX.value,
			[-100, 0, 100],
			[8, 0, -8]
		);

		return {
			...baseStyle,
			transform: [
				{ translateX: swipeX.value },
				{ translateY: swipeY.value },
				{ rotate: `${rotate}deg` },
			],
		};
	}, [allowDrag, isVisible]);

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