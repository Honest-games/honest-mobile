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
} from '@/features/question-likes/model'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import {useUserId} from "@/features/hooks";
import { Loader } from '@/shared/ui/loader';
import * as Haptics from 'expo-haptics';
import { CardTopContent } from '@/entities/card/ui';
import { CardLikeButton } from '@/features/card-likes/ui/card-like-button';

interface QuestionCardProps {
	displayData: DisplayedCardItem
	question?: IQuestion
	isFetchingQuestion?: boolean
	questionId?: string
}

export const QuestionCard: React.FC<QuestionCardProps> = (props) => {
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
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
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

	if (displayData.customText) {
		return (
			<View
				style={{ ...styles.questionCardWrapper, ...styles.takeFirstCardWrapper }}
			>
				<Text style={{ ...styles.cardText, ...styles.takeFirstCardText }}>
					{displayData.customText}
				</Text>
			</View>
		);
	}

	const color = displayData.level ? getLevelColor(displayData.level.ColorButton) : undefined;

	return (
		<View style={styles.questionCardWrapper}>
			{displayData.shouldShowLevelOnCard && displayData.level && (
				<CardTopContent level={displayData.level} />
			)}
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
					<Loader/>
				)}
			</View>
			{displayData.level && (
				<CardLikeButton color={color} handleLike={handleLike} isLiked={like} />
			)}
		</View>
	)
}

export const TakeFirstCard: React.FC = () => {
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