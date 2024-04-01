import { LevelInfo } from '@/UI/LevelInfo'
import { DeckTopContent } from '@/components/deck'
import Colors from '@/constants/Colors'
import {
	IQuestonLevelAndColor,
	getLevelColor
} from '@/features/converters/button-converters'
import { useDeck, useDeckId } from '@/features/hooks'
import useFetchDeckSvg from '@/features/hooks/useFetchDeckSvg'
import { useAppDispatch } from '@/features/hooks/useRedux'
import Card from '@/modules/Card'
import { LevelButtons } from '@/modules/LevelButtons'
import Loader from '@/modules/Loader'
import { useGetAllQuestionsQuery, useGetLevelsQuery } from '@/services/api'
import { IDeck, ILevelData, IQuestion } from '@/services/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
	Animated,
	Dimensions,
	PanResponder,
	StyleSheet,
	Text,
	View
} from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const CardMemo = memo(Card)

const CHUNK_SIZE = 2
const DeckId: React.FC = () => {
	const { id } = useLocalSearchParams()
	const dispatch = useAppDispatch()

	const { decks, isLoadingDecks } = useDeck()

	const [selectedDeck, setSelectedDeck] = useState<IDeck>()

	useEffect(() => {
		const findDeck = decks?.find((item: IDeck) => item.id === id.toString())
		if (findDeck) {
			setSelectedDeck(findDeck)
		}
	}, [id, decks])

	const {
		svgData,
		isLoadingImage,
		error: errorSvg
	} = useFetchDeckSvg(selectedDeck?.image_id)

	const {
		data: questions,
		isLoading: isLoadingQuestions,
		isError,
		isFetching: isFetchingQuestions
	} = useGetAllQuestionsQuery(id)
	const {
		data: levels,
		isFetching: isFetchingLevels,
		isLoading: isLoadingLevels
	} = useGetLevelsQuery(id.toString())
	const { goBack } = useDeckId()
	const [buttonState, setButtonState] = useState<IQuestonLevelAndColor>()

	const [level, setLevel] = useState<string>('')
	const activeIndex = useSharedValue(0)

	const [questionsByLevel, setQuestionsByLevel] = useState<
		Record<string, IQuestion[]>
	>({})

	const [chunkIndexByLevel, setChunkIndexByLevel] = useState<
		Record<string, number>
	>({})

	const [chunkIndexByLevelCopy, setChunkIndexByLevelCopy] = useState<
		Record<string, number>
	>({})

	const [incrementChunkIndexByLevel, setIncrementChunkIndexByLevel] = useState<
		Record<string, number>
	>({})

	const [lastQuestionIndexByLevel, setLastQuestionIndexByLevel] = useState<
		Record<string, number>
	>({})

	const [displayedQuestions, setDisplayedQuestions] = useState<any[]>([])

	const [deletedQuestions, setDeletedQuestions] = useState<any[]>([])

	const [countOfCompletedCards, setCountOfCompletedCards] = useState<number>(0)
	const [isFirstCardInDeck, setIsFirstCardInDeck] = useState(true)
	const [isLastCardInDeck, setIsLastCardInDeck] = useState(false)

	const [currentIndexByLevel, setCurrentIndexByLevel] = useState<
		Record<string, number>
	>({})

	const lastSwipe = useRef(Date.now())

	const levelInfoText = 'chooseLevel'
	useEffect(() => {
		async function fetchData() {
			try {
				const storedQuestions = await AsyncStorage.getItem(
					`displayedQuestions_${id}`
				)
				const storedDeletedQuestions = await AsyncStorage.getItem(
					`deletedQuestions_${id}`
				)
				const storedButtonState = await AsyncStorage.getItem(
					`buttonState_${id}`
				)
				const storedCompletedCount = await AsyncStorage.getItem(
					`completedCount_${id}`
				)

				let deletedQs = storedDeletedQuestions
					? JSON.parse(storedDeletedQuestions)
					: []

				if (storedQuestions) {
					const loadedQuestions = JSON.parse(storedQuestions)
					// Фильтруем загруженные вопросы, чтобы исключить удаленные ранее вопросы
					const filteredQuestions = loadedQuestions.filter(
						(q: IQuestion) => !deletedQs.some((dq: IQuestion) => dq.id === q.id)
					)

					setDisplayedQuestions(
						filteredQuestions.length > 0
							? [{ text: 'chooseLevelContinue' }, ...filteredQuestions]
							: [{ text: 'Карты в колоде кончились =(' }]
					)
				} else {
					setDisplayedQuestions([{ text: 'firstCard' }])
				}

				// Устанавливаем deletedQuestions из AsyncStorage
				if (storedDeletedQuestions) {
					setDeletedQuestions(JSON.parse(storedDeletedQuestions))
				}

				if (storedCompletedCount) {
					setCountOfCompletedCards(parseInt(storedCompletedCount))
				} else {
					setCountOfCompletedCards(0)
				}
			} catch (e) {
				console.error('Ошибка чтения из AsyncStorage:', e)
			}
		}

		fetchData()
	}, [id])

	useEffect(() => {
		async function saveData() {
			try {
				if (displayedQuestions.length > 0) {
					await AsyncStorage.setItem(
						`displayedQuestions_${id}`,
						JSON.stringify(displayedQuestions)
					)
				}
				if (deletedQuestions.length > 0) {
					await AsyncStorage.setItem(
						`deletedQuestions_${id}`,
						JSON.stringify(deletedQuestions)
					)
				}

				if (countOfCompletedCards > 0) {
					await AsyncStorage.setItem(
						`completedCount_${id}`,
						countOfCompletedCards.toString()
					)
				}
			} catch (e) {
				console.error('Ошибка сохранения в AsyncStorage:', e)
			}
		}
		saveData()
	}, [
		displayedQuestions,
		deletedQuestions,
		buttonState,
		countOfCompletedCards,
		id
	])

	useEffect(() => {
		if (questions && levels) {
			const groupedQuestions = levels.reduce(
				(acc: Record<string, IQuestion[]>, level: ILevelData) => {
					// Фильтрация вопросов для удаления тех, которые есть в deletedQuestions
					const filteredQuestions = questions.filter((q: IQuestion) => {
						return !deletedQuestions.find((dq: IQuestion) => dq.id === q.id)
					})

					acc[level.ID] = filteredQuestions.filter(
						(q: IQuestion) => q.level_id === level.ID
					)
					return acc
				},
				{}
			)

			setQuestionsByLevel(groupedQuestions)
			const initialChunkIndexByLevelFirst: Record<string, number> = {}

			levels.forEach(level => {
				setChunkIndexByLevel(prev => ({
					...prev,
					[level.ID]: groupedQuestions[level.ID]?.length || 0
				}))
				setChunkIndexByLevelCopy(prev => ({
					...prev,
					[level.ID]: groupedQuestions[level.ID]?.length || 0
				}))
				setIncrementChunkIndexByLevel(prev => ({ ...prev, [level.ID]: 0 }))
			})
		}
	}, [questions, levels, deletedQuestions])

	const [swipeDirection, setSwipeDirection] = useState(-1) //s Начинаем с направления влево (-1)
	const [isButtonPressed, setIsButtonPressed] = useState(false)

	const swipe = useRef(new Animated.ValueXY()).current
	const rotate = useRef(new Animated.Value(0)).current

	const panResponser = PanResponder.create({
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: (_, { dx, dy }) => {
			swipe.setValue({ x: dx, y: dy })
		},

		onPanResponderRelease: (_, gestureState) => {
			const { dx, dy, vx, vy } = gestureState
			let isActionActive = Math.abs(dx) > 150
			if (isActionActive) {
				// Определяем, в какую сторону должен улетать элемент
				const direction = dx < 0 ? -1 : 1
				const velocityX = Math.max(Math.abs(vx), 1) * direction // Убедимся, что скорость не равна 0

				Animated.timing(swipe, {
					toValue: { x: velocityX * 500, y: dy }, // используем скорость и направление
					useNativeDriver: true,
					duration: Math.abs(velocityX) * 100 // регулируем длительность анимации на основе скорости
				}).start(removeCard)
			} else {
				// Если свайп не достиг активационной точки, плавно возвращаем карточку на место
				Animated.spring(swipe, {
					toValue: { x: 0, y: 0 },
					useNativeDriver: true,
					friction: 5 // Можно отрегулировать фрикцию для более плавного возврата
				}).start()
			}
		}
	})

	const removeCard = useCallback(() => {
		if (displayedQuestions.length > 0) {
			const removedQuestion = displayedQuestions[0] // Получаем первую карточку
			setDisplayedQuestions(prevState => prevState.slice(1)) // Удаляем первую карточку
			setDeletedQuestions(prevDeleted => {
				// Проверяем, содержится ли удаляемый вопрос уже в массиве удаленных вопросов
				const isAlreadyDeleted = prevDeleted.some(
					dq => dq.id === removedQuestion.id
				)

				if (!isAlreadyDeleted) {
					const newDeletedQuestions = [removedQuestion, ...prevDeleted]
					// Сохраняем обновленный массив deletedQuestions в AsyncStorage
					AsyncStorage.setItem(
						`deletedQuestions_${id}`,
						JSON.stringify(newDeletedQuestions)
					).catch(e =>
						console.error('Ошибка сохранения удаленных вопросов:', e)
					)
					return newDeletedQuestions
				}
				return prevDeleted
			})
		}
		swipe.setValue({ x: 0, y: 0 })
		setSwipeDirection(prevDirection => -prevDirection)
	}, [swipe, displayedQuestions, id])

	const handleSelection = useCallback(
		(direction: any) => {
			Animated.timing(swipe, {
				toValue: { x: direction * 500, y: 0 },
				useNativeDriver: true,
				duration: 500
			}).start(removeCard)
		},
		[removeCard]
	)

	const loadQuestionsForLevel = async (levelId: string) => {
		if (chunkIndexByLevel[levelId] < 0) {
			setDisplayedQuestions([{ text: 'Карты в колоде кончились =(' }])
			setIsLastCardInDeck(true)
		}

		if (!questionsByLevel[levelId] || chunkIndexByLevel[levelId] < 0) {
			// Перезагрузка вопросов уровня
			const reloadedQuestions = questions
				.filter((q: any) => q.level_id === levelId)
				.filter((q: any) => !deletedQuestions.some(dq => dq.id === q.id))

			// Очищаем удаленные вопросы из состояния и AsyncStorage
			setDeletedQuestions([])
			try {
				await AsyncStorage.removeItem(`deletedQuestions_${id}`)
			} catch (e) {
				console.error(
					'Ошибка при удалении deletedQuestions из AsyncStorage:',
					e
				)
			}

			// Обновление состояний для вопросов уровня
			setQuestionsByLevel(prev => ({ ...prev, [levelId]: reloadedQuestions }))
			setChunkIndexByLevel(prev => ({
				...prev,
				[levelId]: reloadedQuestions.length
			}))
			setIncrementChunkIndexByLevel(prev => ({ ...prev, [levelId]: 0 }))

			if (reloadedQuestions.length === 0) {
				setDisplayedQuestions([{ text: 'Карты в колоде кончились =(' }])
				setIsLastCardInDeck(true)
			} else {
				setDisplayedQuestions(reloadedQuestions.slice(0, CHUNK_SIZE))
				setIsLastCardInDeck(false)
			}

			return
		}

		const currentIncrementalChunkIndex =
			incrementChunkIndexByLevel[levelId] || 0
		let newQuestions: any[] = []

		const difference = currentIncrementalChunkIndex - chunkIndexByLevel[levelId]
		if (difference < CHUNK_SIZE && difference > 0) {
			newQuestions = questionsByLevel[levelId]?.slice(
				currentIncrementalChunkIndex,
				currentIncrementalChunkIndex + difference
			)
		} else {
			newQuestions = questionsByLevel[levelId]?.slice(
				currentIncrementalChunkIndex,
				currentIncrementalChunkIndex + CHUNK_SIZE
			)
		}

		if (deletedQuestions)
			setDisplayedQuestions(prev => {
				const isQuestionsSame = newQuestions?.every(
					(newQuestion, i) => prev[i] && newQuestion.id === prev[i].id
				)
				if (isQuestionsSame) {
					// Если вопросы те же, не обновляем состояние
					return prev
				}

				return [...prev, ...newQuestions]
			})

		setChunkIndexByLevel(prev => ({
			...prev,
			[levelId]: chunkIndexByLevel[levelId] - CHUNK_SIZE
		}))

		setIncrementChunkIndexByLevel(prev => ({
			...prev,
			[levelId]: currentIncrementalChunkIndex + CHUNK_SIZE
		}))
	}

	const backToDecks = () => {
		// Создаём новый объект для обновленного состояния
		const updatedQuestionsByLevel = { ...questionsByLevel }

		// Перебираем каждый уровень и фильтруем вопросы
		for (const levelId in updatedQuestionsByLevel) {
			updatedQuestionsByLevel[levelId] = updatedQuestionsByLevel[
				levelId
			].filter(q => !deletedQuestions.some(dq => dq.id === q.id))
		}

		// Обновляем состояние questionsByLevel
		setQuestionsByLevel(updatedQuestionsByLevel)

		// Возвращаем пользователя назад
		goBack()
	}

	const onButtonPress = (
		levelId: string,
		buttonName: string,
		colorButton: string
	) => {
		const colorOfLevel = getLevelColor(colorButton)

		setIsFirstCardInDeck(false)
		setButtonState({ levelBgColor: colorOfLevel, levelTitle: buttonName })
		if (level !== levelId) {
			setLevel(levelId)
			setDisplayedQuestions([])
			loadQuestionsForLevel(levelId)
			setIsLastCardInDeck(false)
		}
		handleSelection(swipeDirection)

		setIsButtonPressed(true)
		setCountOfCompletedCards(prevCount => prevCount + 1)
	}

	useEffect(() => {
		if (isButtonPressed) {
			const timer = setTimeout(() => {
				setIsButtonPressed(false)
			}, 500)

			return () => clearTimeout(timer)
		}
	}, [isButtonPressed])

	useEffect(() => {
		if ((displayedQuestions.length < 2 && level) || isLastCardInDeck) {
			loadQuestionsForLevel(level)
		}
	}, [displayedQuestions.length, level])
	if (
		isLoadingQuestions ||
		isFetchingQuestions ||
		isFetchingLevels ||
		isLoadingLevels
	) {
		return <Loader />
	}

	if (isError) {
		return <Text>Произошла ошибка при загрузке данных</Text>
	}
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.deck}>
				<View style={styles.wrapper}>
					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						<DeckTopContent
							svgData={svgData}
							isLoadingImage={isLoadingImage}
							selectedDeck={selectedDeck}
							goBack={backToDecks}
						/>

						<View
							style={{
								flex: 1,
								marginBottom: 12,
								marginTop: 12
							}}
						>
							{displayedQuestions.length > 0 &&
								displayedQuestions
									.map((question: IQuestion, index: number) => {
										let isFirst = index === 0
										let dragHanlders = isFirst ? panResponser.panHandlers : {}

										return (
											<Card
												additionalText={question.additional_text}
												isLastCardInDeck={isLastCardInDeck}
												isFirstCardInDeck={isFirstCardInDeck}
												numOfCards={displayedQuestions?.length || 0}
												key={`${question.id}-${index}`}
												index={index}
												activeIndex={activeIndex}
												level={buttonState}
												isFirst={isFirst}
												color={Colors.beige}
												text={question?.text}
												rotate={rotate}
												swipe={swipe}
												questionId={question.id}
												{...(!isFirstCardInDeck ? { ...dragHanlders } : null)}
											/>
										)
									})
									.reverse()}
						</View>
						<View style={{ marginBottom: 12 }}>
							<LevelInfo levelInfo={levelInfoText} />
						</View>

						<LevelButtons
							isButtonPressed={isButtonPressed}
							levels={levels || []}
							onButtonPress={onButtonPress}
							size='large'
						/>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default React.memo(DeckId)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	wrapper: {
		flex: 1,
		flexDirection: 'column',
		margin: 24,
		gap: 12
	},
	deck: {
		flex: 1,
		width: width - 40,
		marginBottom: 20,
		marginTop: 20,
		backgroundColor: 'white',
		borderRadius: 33
	}
})
