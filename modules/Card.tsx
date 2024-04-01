import CardLikeButton from '@/components/card/CardLikeButton'
import Colors from '@/constants/Colors'
import { IQuestonLevelAndColor } from '@/features/converters/button-converters'
import {
	useDislikeQuestionMutation,
	useLikeQuestionMutation
} from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { memo, useEffect, useState } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import CardText from '../components/card/CardText'
import CardTopContent from '../components/card/CardTopContent'
import Loader from './Loader'

const { height } = Dimensions.get('screen')
const screenWidth = Dimensions.get('screen').width
export const tinderCardWidth = screenWidth * 0.8
interface ICard {
	color: string
	level?: IQuestonLevelAndColor
	text: string
	direction?: string
	// positionX?: SharedValue<number>
	// animatedProps?: AnimatedProps<TextProps>
	isFetching?: boolean
	isLoading?: boolean
	activeIndex: SharedValue<number>
	index: number
	numOfCards: number
	isFirstCardInDeck: boolean
	isLastCardInDeck: boolean
	additionalText?: string
	swipe?: any
	rotate?: any
	isFirst: any
	questionId: string
}

const Card = memo((props: ICard) => {
	const {
		color,
		level,
		text,
		direction,
		index,
		isFetching,
		isLoading,
		activeIndex,
		numOfCards,
		isFirstCardInDeck,
		isLastCardInDeck,
		additionalText,
		swipe,
		isFirst,
		questionId,
		...rest
	} = props

	const [isLiked, setIsLiked] = useState<boolean | null>(null)
	const [userId, setUserId] = useState<any>(null)
	const [likeDeck] = useLikeQuestionMutation()
	const [dislikeDeck] = useDislikeQuestionMutation()

	const getUser = async () => {
		try {
			const user = await AsyncStorage.getItem('user_id')
			setUserId(user)
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
		getUser()
	}, [userId])

	const handleLike = async () => {
		const newLikeState = !isLiked

		setIsLiked(newLikeState)

		if (newLikeState) {
			await likeDeck({ questionId, userId })
		} else {
			await dislikeDeck({ questionId, userId })
		}
	}

	const [press, setPress] = useState(false)

	const levelColor = level ? level?.levelBgColor : Colors.deepBlue

	const isStartedSwipeAnimation = isFirst && !isLastCardInDeck
	const styles = StyleSheet.create({
		card: {
			flex: 1,
			position: 'absolute',
			width: '100%',
			height: '100%',
			backgroundColor: color,
			borderRadius: 20
		},
		wrapper: {
			flex: 1,
			margin: 16,
			zIndex: 1,
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		additionalText: {
			position: 'absolute',
			fontSize: 16,
			textAlign: 'center',
			top: 0,
			left: 0,
			color: Colors.grey1
		}
	})

	const rotate = swipe.x.interpolate({
		inputRange: [-100, 0, 100],
		outputRange: ['8deg', '0deg', '-8deg']
	})

	return (
		<Animated.View
			style={[
				styles.card,
				isStartedSwipeAnimation && {
					transform: [...swipe.getTranslateTransform(), { rotate: rotate }]
				}
			]}
			{...rest}
		>
			<View style={styles.wrapper}>
				{!isFetching || !isLoading ? (
					<>
						<CardTopContent level={level} />
						<CardText
							additionalText={additionalText}
							text={text}
							levelColor={levelColor}
						/>
						<CardLikeButton
							level={level}
							handleLike={handleLike}
							isLiked={isLiked}
						/>
						{/* <View>
							<Text>{index}</Text>
						</View> */}
					</>
				) : (
					<Loader />
				)}
			</View>
		</Animated.View>
	)
})

export default Card
