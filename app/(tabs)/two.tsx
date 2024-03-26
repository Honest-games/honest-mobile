import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, PanResponder, Text, View } from 'react-native'

const TinderSwipeDemo = () => {
	const [data, setData] = useState([
		{ image: 'https://example.com/image1.jpg', id: 1, title: 'Character 1' },
		{ image: 'https://example.com/image2.jpg', id: 2, title: 'Character 2' },
		{ image: 'https://example.com/image3.jpg', id: 3, title: 'Character 3' },
		{ image: 'https://example.com/image4.jpg', id: 4, title: 'Character 4' },
		{ image: 'https://example.com/image5.jpg', id: 5, title: 'Character 5' },
		{ image: 'https://example.com/image6.jpg', id: 6, title: 'Character 6' },
		{ image: 'https://example.com/image7.jpg', id: 7, title: 'Character 7' },
		{ image: 'https://example.com/image8.jpg', id: 8, title: 'Character 8' }
	])
	useEffect(() => {
		if (!data.length) {
			setData([
				{
					image: 'https://example.com/image1.jpg',
					id: 1,
					title: 'Character 1'
				},
				{
					image: 'https://example.com/image2.jpg',
					id: 2,
					title: 'Character 2'
				},
				{
					image: 'https://example.com/image3.jpg',
					id: 3,
					title: 'Character 3'
				},
				{
					image: 'https://example.com/image4.jpg',
					id: 4,
					title: 'Character 4'
				},
				{
					image: 'https://example.com/image5.jpg',
					id: 5,
					title: 'Character 5'
				},
				{
					image: 'https://example.com/image6.jpg',
					id: 6,
					title: 'Character 6'
				},
				{
					image: 'https://example.com/image7.jpg',
					id: 7,
					title: 'Character 7'
				},
				{ image: 'https://example.com/image8.jpg', id: 8, title: 'Character 8' }
			])
		}
	}, [data])
	const [swipeDirection, setSwipeDirection] = useState(-1) // Начинаем с направления влево (-1)

	const swipe = useRef(new Animated.ValueXY()).current
	const rotate = useRef(new Animated.Value(0)).current

	const panResponser = PanResponder.create({
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (_, { dx, dy }) => {
			console.log('dx:' + dx + ' dy:' + dy)
			swipe.setValue({ x: dx, y: dy })
		},

		onPanResponderRelease: (_, { dx, dy }) => {
			console.log('released:' + 'dx:' + dx + ' dy:' + dy)
			let direction = Math.sign(dx)
			let isActionActive = Math.abs(dx) > 200
			if (isActionActive) {
				Animated.timing(swipe, {
					toValue: { x: 500 * dx, y: dy },
					useNativeDriver: true,
					duration: 500
				}).start(removeCard)
			} else {
				Animated.spring(swipe, {
					toValue: { x: 0, y: 0 },
					useNativeDriver: true,
					friction: 5
				}).start()
			}
		}
	})
	const removeCard = useCallback(() => {
		setData(prevState => prevState.slice(1))
		swipe.setValue({ x: 0, y: 0 })
		// Переключаем направление для следующего свайпа
		setSwipeDirection(prevDirection => -prevDirection)
	}, [swipe])

	const handleSelection = useCallback(
		(direction: any) => {
			Animated.timing(swipe, {
				toValue: { x: direction * 500, y: 0 },
				useNativeDriver: true,
				duration: 500
			}).start(removeCard)
		},
		[removeCard]
	)

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Здесь пока нет контента</Text>
			{/* {data
				.map((item, index) => {
					let isFirst = index === 0
					let dragHanlders = isFirst ? panResponser.panHandlers : {}
					return (
						<TinderCard
							item={item}
							rotate={rotate}
							isFirst={isFirst}
							swipe={swipe}
							{...dragHanlders}
						/>
					)
				})
				.reverse()}

			<View
				style={{
					width: '100%',
					position: 'absolute',
					height: 100,
					bottom: 0,
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					alignItems: 'center'
				}}
			>
				<TouchableOpacity
					style={{
						width: 60,
						height: 60,
						backgroundColor: '#fff',
						elevation: 5,
						borderRadius: 30,
						justifyContent: 'center',
						alignItems: 'center'
					}}
					onPress={() => {
						handleSelection(swipeDirection)
					}}
				>
					<View style={{ width: 34, height: 34, backgroundColor: 'red' }} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						width: 60,
						height: 60,
						backgroundColor: '#fff',
						elevation: 5,
						borderRadius: 30,
						justifyContent: 'center',
						alignItems: 'center'
					}}
					onPress={() => {
						handleSelection(swipeDirection)
					}}
				>
					<View style={{ width: 34, height: 34, backgroundColor: 'teal' }} />
				</TouchableOpacity>
			</View> */}
		</View>
	)
}

export default TinderSwipeDemo
