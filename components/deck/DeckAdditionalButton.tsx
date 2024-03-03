import MoreAboutDeck from '@/assets/svg/MoreAboutDeck'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
interface DeckAdditionalButtonProps {
	onPresent: (id: string) => void
	id: string
}

const DeckAdditionalButton: React.FC<DeckAdditionalButtonProps> = ({
	onPresent,
	id
}) => {
	return (
		<TouchableOpacity style={styles.questionIcon} onPress={() => onPresent(id)}>
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
