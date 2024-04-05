// hooks/useDeckId.ts
import {
	IQuestonLevelAndColor
} from '@/features/converters/button-converters'
import { useGetAllQuestionsQuery, useGetLevelsQuery } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {useEffect, useRef, useState} from 'react'
import { Dimensions } from 'react-native'
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming
} from 'react-native-reanimated'

const useDeckId = () => {
	const router = useRouter()
	const { id } = useLocalSearchParams()
	const [level, setLevel] = useState<any>('')
	const [userId, setUserId] = useState<any>(null)
	const [buttonState, setButtonState] = useState<IQuestonLevelAndColor>()
	const positionX = useSharedValue(0)

	const translateX = useSharedValue(0)
	const animatedCardStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }]
		}
	})

	const handleSwipeOut = (levelId: string) => {
		setQuestion(selectRandomItem(copyOfQuestions, levelId))

		translateX.value = withTiming(
			-Dimensions.get('window').width,
			{
				duration: 800
			},
		
		)
	}

	useEffect(() => {
		const getUserId = async () => {
			const user_id = await AsyncStorage.getItem('user_id')
			if (userId !== user_id) {
				setUserId(user_id)
			}
		}
		getUserId()
	}, [userId])

	const time = useRef(Date.now()).current
	const { data: levels, isFetching: isFetchingLevels } = useGetLevelsQuery(
		{deckId: id.toString(), time}
	)

	const {
		data: questions,
		isLoading: isLoadingQuestions,
		isError,
		isFetching: isFetchingQuestions,
		refetch
	} = useGetAllQuestionsQuery(id)
	const [copyOfQuestionsForRefetching, setCopyOfQuestionsForRefetching] =
		useState<any>([])

	const [copyOfQuestions, setCopyOfQuestions] = useState<any>([])
	const [questionSelected, setQuestionSelected] = useState()
	const [question, setQuestion] = useState<any>()

	useEffect(() => {
		if (questions) {
			setCopyOfQuestions(questions)
			setCopyOfQuestionsForRefetching(questions)
		}
	}, [questions])
	const selectRandomItem = (questions: any, levelId: any) => {
		const filteredItems = questions.filter(
			(item: any) => item.level_id === levelId
		)
		if (filteredItems.length === 0) {
			const refetchingQuestions = copyOfQuestionsForRefetching.filter(
				(item: any) => item.level_id === levelId
			)
			setCopyOfQuestions(refetchingQuestions)

			return { text: 'Вопросы закончились' }
		}

		const randomIndex = Math.floor(Math.random() * filteredItems.length)
		const selectedItem = filteredItems[randomIndex]
		

		setQuestionSelected(selectedItem)
		setCopyOfQuestions((prevQuestions: any[]) =>
			prevQuestions.filter(item => item !== selectedItem)
		)

		return selectedItem
	}

	const onButtonPress = (levelId: string, buttonName: string) => {
		handleSwipeOut(levelId)
		// refetch()
	}
	const goBack = () => router.back()

	// const { getQuestion } = useQuestionSelector(questions, levels)

	// const onButtonPress = (levelId: string, buttonName: string) => {
	// 	setLevel(levelId)
	// 	refetch()
	// 	setButtonState(getQuestionLevelAndColor(buttonName))
	// }

	// const onButtonPress = (levelId: string, buttonName: string) => {
	// 	setButtonState(getQuestionLevelAndColor(buttonName))
	// 	setQuestion(selectRandomItem(copyOfQuestions, levelId))

	// 	// refetch()
	// }

	return {
		levels,
		isFetchingLevels,
		isLoadingQuestions,
		question,
		isFetchingQuestions,
		// isLoadingQuestion,
		buttonState,
		positionX,
		goBack,
		onButtonPress,
		questions,
		animatedCardStyle
		// onLevelButtonClick,
		// currentQuestion
	}
}

export default useDeckId
