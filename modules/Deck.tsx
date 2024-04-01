import { useDislikeDeckMutation, useLikeDeckMutation } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
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
	const [isLiked, setIsLiked] = useState<boolean | null>(null)
	const [userId, setUserId] = useState<any>(null)
	const [likeDeck] = useLikeDeckMutation()
	const [dislikeDeck] = useDislikeDeckMutation()

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

	// Функция для обработки нажатия на кнопку
	const handleLike = async () => {
		const newLikeState = !isLiked

		setIsLiked(newLikeState)

		if (newLikeState) {
			await likeDeck({ id, userId })
		} else {
			await dislikeDeck({ id, userId })
		}
	}

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

					<LikeButton handleLike={handleLike} isLiked={isLiked} />
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
