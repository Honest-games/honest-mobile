import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import LikeButton from '../UI/LikeButton'
import DeckAdditionalButton from '../components/deck/DeckAdditionalButton'
import DeckInfo from '../components/deck/DeckInfo'
import LabelList from '../components/deck/DeckLabelList'

export interface DeckProps {
	title?: string
	likes?: number
	progress?: number
	img?: any
	id?: any
	// isLoading: boolean
	// isFetching: boolean
	onPresent: (id: string) => void
	onDismiss: () => void
	onPress?: () => void
	labelsString: string
	imageId: string
}

function Deck({
	title,
	likes,
	progress,
	img,
	id,
	onPresent,
	labelsString,
	imageId
	// isFetching,
	// isLoading
}: DeckProps) {
	const [pressHeart, setPressHeart] = useState(false)

	const labels = labelsString?.split(';')
	
	return (
		<View style={styles.deck} key={id}>
			<View style={{ flexDirection: 'column', margin: 12, flex: 1 }}>
				<View
					style={{
						position: 'absolute',
						justifyContent: 'space-between',
						flexDirection: 'row',
						width: '100%'
					}}
				>
					<LabelList labels={labels} />

					<LikeButton pressHeart={pressHeart} setPressHeart={setPressHeart} />
				</View>
				<DeckInfo imageId={imageId} title={title} id={id} />

				<DeckAdditionalButton onPresent={onPresent} id={id} />
			</View>
		</View>
	)
}

export default Deck

const styles = StyleSheet.create({
	deck: {
		flex: 1,
		position: 'relative',
		marginTop: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		height: 221,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexDirection: 'row'
	}
})
