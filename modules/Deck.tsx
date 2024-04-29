import { useAppDispatch, useAppSelector } from '@/features/hooks/useRedux'
import { useDislikeDeckMutation, useLikeDeckMutation } from '@/services/api'
import { addDeckId, removeDeckId } from '@/store/reducer/deck-likes-slice'
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
}: DeckProps) {
	const dispatch = useAppDispatch()
	const decksLikesSet = useAppSelector(state => state.decksLikes.decksLikesSet)
	const [userId, setUserId] = useState<any>(null)
	const [likeDeck] = useLikeDeckMutation()
	const [dislikeDeck] = useDislikeDeckMutation()

	const isLiked = () => {
		return decksLikesSet.has(id)
	}

	useEffect(() => {
		const getUser = async () => {
			try {
				const user = await AsyncStorage.getItem('user_id')
				setUserId(user)
			} catch (e) {
				console.log(e)
			}
		}
		getUser()
	}, [userId])

	const handleLike = async () => {
		try {
			if (decksLikesSet.has(id)) {
				await dislikeDeck({ deckId: id, userId })
				dispatch(removeDeckId(id))
			} else {
				await likeDeck({ deckId: id, userId })
				dispatch(addDeckId(id))
			}
		} catch (e) {
			console.error('Error:', e)
		}
	}

	const labels = labelsString?.split(';')

	return (
		<View style={styles.deck} key={id}>
			<View style={{ flexDirection: 'column', margin: 12, flex: 1 }}>
				<View
					style={{
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
