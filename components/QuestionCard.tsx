import { DisplayedCardItem } from '@/app/decks/[id]'
import Colors from '@/constants/Colors'
import { getLevelColor } from '@/features/converters/button-converters'
import { useAppDispatch, useAppSelector } from '@/features/hooks/useRedux'
import {
	useDislikeQuestionMutation,
	useLikeQuestionMutation
} from '@/services/api'
import { IQuestion } from '@/services/types/types'
import {
	addQuestionId,
	removeQuestionId
} from '@/store/reducer/question-like-slice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import CardLikeButton from './card/CardLikeButton'
import CardTopContent from './card/CardTopContent'
import {useUserId} from "@/features/hooks";

interface QuestionCardProps {
	displayData: DisplayedCardItem
	question?: IQuestion
	isFetchingQuestion?: boolean
	questionId?: string
}

const QuestionCard = (props: QuestionCardProps) => {
	const { displayData, question, isFetchingQuestion, questionId } = props
	const dispatch = useAppDispatch()
	const questionsLikesSet: Set<any> = useAppSelector(
		state => state.questionsLikes.questionsLikesSet
	)

	const [like, setLike] = useState<boolean>(false)

	useEffect(() => {
		if (
			!isFetchingQuestion &&
			questionId &&
			questionsLikesSet &&
			typeof questionsLikesSet.has === 'function'
		) {
			setLike(!!questionsLikesSet.has(questionId))
		}
	}, [isFetchingQuestion, questionId, questionsLikesSet])
	const userId = useUserId()
	const [likeQuestion] = useLikeQuestionMutation()
	const [dislikeQuestion] = useDislikeQuestionMutation()

	const handleLike = async () => {
		try {
			if (questionsLikesSet && questionsLikesSet instanceof Set && questionId) {
				if (questionsLikesSet.has(questionId)) {
					await dislikeQuestion({ questionId, userId })
					dispatch(removeQuestionId(questionId))
				} else {
					await likeQuestion({ questionId, userId })
					dispatch(addQuestionId(questionId))
				}
			} else {
				console.error(
					'questionsLikesSet is not a valid Set instance or questionId is undefined'
				)
			}
		} catch (e) {
			console.error('Error handling like:', e)
		}
	}

	const color = getLevelColor(displayData.level.ColorButton)

	return (
		<View style={styles.questionCardWrapper}>
			{displayData.shouldShowLevelOnCard && <CardTopContent level={displayData.level} />}
			<View style={styles.cardTextsWrapper}>
				{question ? (
					<>
						{question.additional_text && (
							<View style={styles.cardAdditionalTextWrapper}>
								<Text style={styles.additionalText}>
									{question.additional_text}
								</Text>
							</View>
						)}
						<View style={styles.cardMainTextWrapper}>
							<Text style={{ ...styles.cardText, color }}>{question.text}</Text>
						</View>
					</>
				) : (
					<Text>Loading...</Text>
				)}
			</View>
			<CardLikeButton color={color} handleLike={handleLike} isLiked={like} />
		</View>
	)
}

export default QuestionCard

export const TakeFirstCard = () => {
	const { t } = useTranslation()
	return (
		<View
			style={{ ...styles.questionCardWrapper, ...styles.takeFirstCardWrapper }}
		>
			<Text style={{ ...styles.cardText, ...styles.takeFirstCardText }}>
				{t('firstCard')}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	questionCardWrapper: {
		flex: 1,
		margin: 0,
		zIndex: 1,
		flexDirection: 'column',
		// justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		borderRadius: 20,
		padding: 16,

		backgroundColor: Colors.beige
	},
	takeFirstCardWrapper: {
		justifyContent: 'center'
	},
	cardTextsWrapper: {
		flexDirection: 'column',
		flexGrow: 1,
		alignItems: "center",
		justifyContent: 'center',
	},
	cardAdditionalTextWrapper: {

	},
	cardMainTextWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 25
	},
	cardText: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	takeFirstCardText: {
		fontSize: 25,
		color: Colors.deepBlue
	},
	additionalText: {
		fontSize: 16,
		textAlign: 'center',
		color: Colors.grey1
	}
})
