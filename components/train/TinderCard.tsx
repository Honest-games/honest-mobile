import React, { useCallback } from 'react'
import { Animated, Dimensions, Text } from 'react-native'
import TinderLike from './TinderLike'
const { height, width } = Dimensions.get('window')
const TinderCard = ({ item, isFirst, swipe, ...rest }: any) => {
	const rotate = swipe.x.interpolate({
		inputRange: [-100, 0, 100],
		outputRange: ['8deg', '0deg', '-8deg']
	})
	const likeOpacity = swipe.x.interpolate({
		inputRange: [10, 100],
		outputRange: [0, 1],
		extrapolate: 'clamp'
	})

	const rejectOpacity = swipe.x.interpolate({
		inputRange: [-100, -10],
		outputRange: [1, 0],
		extrapolate: 'clamp'
	})

	const renderChoice = useCallback(() => {
		return (
			<>
				<Animated.View
					style={[
						{ position: 'absolute', top: 100, left: 20 },
						{ opacity: likeOpacity }
					]}
				>
					<TinderLike type={'Like'} />
				</Animated.View>
				<Animated.View
					style={[
						{ position: 'absolute', top: 100, right: 20 },
						{ opacity: rejectOpacity }
					]}
				>
					<TinderLike type={'Nope'} />
				</Animated.View>
			</>
		)
	}, [])
	return (
		<Animated.View
			style={[
				{
					width: width - 20,
					height: height - 200,
					position: 'absolute',
					backgroundColor: 'black',
					top: 50,
					justifyContent: 'center',
					alignItems: 'center',
					alignSelf: 'center'
				},
				isFirst && {
					transform: [...swipe.getTranslateTransform(), { rotate: rotate }]
				}
			]}
			{...rest}
		>
			{isFirst && renderChoice()}

			<Text
				style={{
					position: 'absolute',
					bottom: 20,
					left: 30,
					fontSize: 40,
					color: '#FFF'
				}}
			>
				{item.title}
			</Text>
		</Animated.View>
	)
}

export default TinderCard
