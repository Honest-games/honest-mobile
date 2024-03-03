import CardLikeButton from '@/components/card/CardLikeButton'
import Colors from '@/constants/Colors'
import { IQuestonLevelAndColor } from '@/features/converters/button-converters'
import React, { useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'
import CardText from '../components/card/CardText'
import CardTopContent from '../components/card/CardTopContent'
import Loader from './Loader'

const { height } = Dimensions.get('screen')

interface ICard {
	color: string
	level?: IQuestonLevelAndColor
	text: string
	direction?: string
	// positionX?: SharedValue<number>
	// animatedProps?: AnimatedProps<TextProps>
	isFetching: boolean
	isLoading: boolean
}

const Card = (props: ICard) => {
	const { color, level, text, direction, isFetching, isLoading } = props

	const [press, setPress] = useState(false)

	const levelColor = level ? level?.levelBgColor : Colors.deepBlue

	const isFirstCardInDeck = (text: string) => {
		if (text === 'take first card') {
			return true
		}
		return false
	}

	const styles = StyleSheet.create({
		card: {
			flex: 1,
			marginTop: 8,
			backgroundColor: color,
			borderRadius: 20
		},
		wrapper: {
			flex: 1,
			margin: 16,
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		topContent: {
			justifyContent: 'center',
			width: '100%',
			height: 20
		},
		cardText: {
			fontSize: isFirstCardInDeck(text) ? 32 : 20,
			fontWeight: 'bold',
			color: level ? level?.levelBgColor : Colors.deepBlue,
			textAlign: 'center'
		}
	})

	return (
		<Animated.View style={[styles.card]}>
			<View style={styles.wrapper}>
				{!isFetching || !isLoading ? (
					<>
						<CardTopContent level={level} />
						<CardText text={text} levelColor={levelColor} />
						<CardLikeButton level={level} press={press} setPress={setPress} />
					</>
				) : (
					<Loader />
				)}
			</View>
		</Animated.View>
	)
}

export default Card
