import { getLevelColor } from '@/features/converters/button-converters'
import { AntDesign } from '@expo/vector-icons'
import React, {useEffect, useState} from 'react'
import { TouchableOpacity, View } from 'react-native'
import {useAppDispatch, useAppSelector} from "@/features/hooks/useRedux";
import {useDislikeQuestionMutation, useLikeQuestionMutation} from "@/services/api";
import {addQuestionId, removeQuestionId} from "@/store/reducer/question-like-slice";

interface ICustomView {
	color: string
	questionId: string,
	userId: string,
}

const CardLikeButton = ({ color, questionId, userId }: ICustomView) => {
	const dispatch = useAppDispatch()
	const questionsLikesSet: Set<any> = useAppSelector(
		state => state.questionsLikes.questionsLikesSet
	)

	const isLiked = questionsLikesSet.has(questionId)

	const [likeQuestion] = useLikeQuestionMutation()
	const [dislikeQuestion] = useDislikeQuestionMutation()

	const handleLike = async () => {
		try {
			if (questionsLikesSet.has(questionId)) {
				await dislikeQuestion({ questionId, userId })
				dispatch(removeQuestionId(questionId))
			} else {
				await likeQuestion({ questionId, userId })
				dispatch(addQuestionId(questionId))
			}
		} catch (e) {
			console.error('Error handling like:', e)
		}
	}
	return (
		<View style={{ width: '100%' }}>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
				<TouchableOpacity onPress={handleLike}>
					<AntDesign
						name={isLiked ? 'heart' : 'hearto'}
						size={24}
						color={getLevelColor(color)}
					/>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default CardLikeButton
