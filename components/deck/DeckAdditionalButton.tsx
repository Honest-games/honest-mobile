import MoreAboutDeck from '@/assets/svg/MoreAboutDeck'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
interface DeckAdditionalButtonProps {
	onClick: () => void
}

const DeckAdditionalButton: React.FC<DeckAdditionalButtonProps> = ({
	onClick
}) => {
	return (
		<TouchableOpacity style={styles.questionIcon} onPress={onClick}>
			<MoreAboutDeck />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	questionIcon: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		zIndex: 1000
	}
})

export default DeckAdditionalButton
