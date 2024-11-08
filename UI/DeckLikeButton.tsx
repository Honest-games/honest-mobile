import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import {addDeckId, removeDeckId} from "@/store/reducer/deck-likes-slice";
import {useAppDispatch, useAppSelector} from "@/features/hooks/useRedux";
import {useDislikeDeckMutation, useLikeDeckMutation} from "@/services/api";
import {useUserId} from "@/features/hooks";

interface LikeButtonProps {
	deckId: string
}

const DeckLikeButton: React.FC<LikeButtonProps> = ({deckId}) => {
	const decksLikesSet = useAppSelector(state => state.decksLikes.decksLikesSet)
	const isLiked = decksLikesSet.has(deckId)

	const dispatch = useAppDispatch()
	const userId = useUserId()
	const [likeDeck] = useLikeDeckMutation()
	const [dislikeDeck] = useDislikeDeckMutation()
	const handleLike = async () => {
		try {
			if (decksLikesSet.has(deckId)) {
				await dislikeDeck({ deckId: deckId, userId })
				dispatch(removeDeckId(deckId))
			} else {
				await likeDeck({ deckId: deckId, userId })
				dispatch(addDeckId(deckId))
			}
		} catch (e) {
			console.error('Error:', e)
		}
	}

	return (
		<TouchableOpacity style={styles.likes} onPress={handleLike}>
			<FontAwesome
				style={{
					marginLeft: 10,
					marginRight: 10
				}}
				name={isLiked ? 'heart' : 'heart-o'}
				size={16}
				color={Colors.deepBlue}
			/>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	likes: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 20,
		backgroundColor: '#F2F2F2',
		borderRadius: 10
	}
})

export default DeckLikeButton
