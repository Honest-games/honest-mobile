import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, { BounceIn } from 'react-native-reanimated'
interface CardTextProps {
	text: string
	levelColor: string | undefined
}

const CardText: React.FC<CardTextProps> = ({ text, levelColor }) => {
	const isFirstCardInDeck = (text: string) => text === 'take first card'

	const styles = StyleSheet.create({
		cardText: {
			fontSize: isFirstCardInDeck(text) ? 32 : 20,
			fontWeight: 'bold',
			color: levelColor,
			textAlign: 'center'
		}
	})

	return (
		<Animated.Text entering={BounceIn} style={styles.cardText}>
			{text}
		</Animated.Text>
	)
}

export default CardText
