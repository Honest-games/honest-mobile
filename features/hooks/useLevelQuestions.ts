import { useGetLevelsQuery, useGetQuestionQuery } from '@/services/api'
import { useEffect, useState } from 'react'

export const useLevelQuestions = (levelId: string, clientId: string) => {
	const [level, setLevel] = useState('')
	const [textToShow, setTextToShow] = useState(
		'Добро пожаловать, готовы выбрать вопрос?'
	)

	const {
		data: buttons,
		isLoading,
		isError
	} = useGetLevelsQuery(levelId.toString())
	const { data: question, refetch } = useGetQuestionQuery({
		levelId: level,
		clientId: clientId
	})

	useEffect(() => {
		if (question) {
			setTextToShow(question.text)
		}
	}, [question])

	return { buttons, textToShow, setLevel, refetch, isLoading, isError }
}
