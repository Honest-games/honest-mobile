// hooks/useDeckId.ts
import getQuestionLevelAndColor, {
	IQuestonLevelAndColor
} from '@/features/converters/button-converters'
import { useGetLevelsQuery, useGetQuestionQuery } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useSharedValue } from 'react-native-reanimated'

const useDeckId = () => {
	const router = useRouter()
	const { id } = useLocalSearchParams()
	const [level, setLevel] = useState<string>('')
	const [userId, setUserId] = useState<any>(null)
	const [buttonState, setButtonState] = useState<IQuestonLevelAndColor>()
	const positionX = useSharedValue(0)

	const { data: levels, isFetching: isFetchingLevels } = useGetLevelsQuery(
		id.toString()
	)
	const {
		data: question,
		refetch,
		isFetching: isFetchingQuestion,
		isLoading: isLoadingQuestion
	} = useGetQuestionQuery({ levelId: level, clientId: userId })

	useEffect(() => {
		const getUserId = async () => {
			const user_id = await AsyncStorage.getItem('user_id')
			setUserId(user_id)
		}
		getUserId()
	}, [])

	const goBack = () => router.back()

	const onButtonPress = (levelId: string, buttonName: string) => {
		setLevel(levelId)
		refetch()
		setButtonState(getQuestionLevelAndColor(buttonName))
	}

	return {
		levels,
		isFetchingLevels,
		question,
		isFetchingQuestion,
		isLoadingQuestion,
		buttonState,
		positionX,
		goBack,
		onButtonPress
	}
}

export default useDeckId
