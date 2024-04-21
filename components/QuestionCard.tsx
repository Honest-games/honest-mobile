import CardTopContent from './card/CardTopContent'
import CardText from './card/CardText'
import Colors from '@/constants/Colors'
import CardLikeButton from './card/CardLikeButton'
import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {
	getLevelColor,
	IQuestonLevelAndColor
} from '@/features/converters/button-converters'
import { ILevelData, IQuestion } from '@/services/types/types'
import { useTranslation } from 'react-i18next'
import { useGetQuestionQuery } from '@/services/api'
import {DisplayedQuestionData} from "@/app/decks";

interface QuestionCardProps {
	userId: string
	displayData: DisplayedQuestionData
}

const QuestionCard = (props: QuestionCardProps) => {
	const { displayData, userId } = props
	const { t } = useTranslation()
	const [time] = useState(Date.now())
	const [question, setQuestion] = useState<IQuestion>()

	const { data: fetchedQuestion } = useGetQuestionQuery({
		levelId: displayData.level.ID,
		clientId: userId,
		timestamp: time
	})
	useEffect(() => {
		if (fetchedQuestion) {
			setQuestion(fetchedQuestion)
		}
	}, [fetchedQuestion])

	const color = getLevelColor(displayData.level.ColorButton)
	return (
		<View style={styles.questionCardWrapper}>
			{
				<>
					<CardTopContent level={displayData.level} />
					<View style={{ alignItems: 'center', flexDirection: 'column', gap: 22 }}>
						{question
							? <>
								{question.additional_text && (<Text style={styles.additionalText}>{question.additional_text}</Text>)}
								<Text style={{ ...styles.cardText, color: color }}>{question?.text}</Text>
							</>
							: <Text>Loading...</Text>
						}
					</View>
					<CardLikeButton
						color={color}
						handleLike={() => {}} //TODO !!!!!!
						isLiked={false}
					/>
				</>
			}
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
		justifyContent: 'space-between',
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
