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
import { useGetLevelsQuery, useGetQuestionQuery } from '@/services/api'
import { IDeck, IQuestion } from '@/services/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
	Animated,
	Dimensions,
	PanResponder,
	StyleSheet,
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

	const time = useRef(Date.now()).current
	const [userId, setUserId] = useState('')
	useEffect(() => {
		;(async () => {
			const userIdFromAS = await AsyncStorage.getItem('user_id')
			if (userIdFromAS) setUserId(userIdFromAS)
		})()
	})
	const [displayedQuestions, setDisplayedQuestions] = useState<any[]>([
		{ text: 'firstCard' }
	])
	const {
		data: levels,
		isFetching: isFetchingLevels,
		isLoading: isLoadingLevels
	} = useGetLevelsQuery({ deckId: id.toString(), time })
	const { goBack } = useDeckId()
	const [buttonState, setButtonState] = useState<IQuestonLevelAndColor>()

	const [level, setLevel] = useState<string>('')
	const activeIndex = useSharedValue(0)

	const getQuestion = useCallback(
		(time: number) => {
			const {
				data: question,
				isFetching: isFetchingQ,
				isLoading: isLoadingQ
			} = useGetQuestionQuery({
				levelId: level,
				clientId: userId,
				timestamp: time
			})
			console.log(userId, time)
			console.log('q' + JSON.stringify(question))
			console.log(JSON.stringify(displayedQuestions))

			// const {
			// 	data: question2,
			// 	isFetching: isFetchingQ2,
			// 	isLoading: isLoadingQ2
			// } = useGetQuestionQuery({levelId: level, clientId: userId, timestamp: time/2})
			// console.log(userId, time)
			// console.log("q" + JSON.stringify(question2))
			// console.log(JSON.stringify(displayedQuestions))

			useEffect(() => {
				// setDisplayedQuestions(prevState => prevState.slice(1))
				if (question) {
					const newQuestions = [...displayedQuestions]
					newQuestions.push(question)
					setDisplayedQuestions(x => newQuestions)
				}
			}, [question])
		},
		[displayedQuestions]
	)

	const loadQuestions = useCallback(async () => {
		const questionsToLoad = 3
		let newQuestions = []

		for (let i = 0; i < questionsToLoad; i++) {
			const time = Date.now() + i // Уникальная временная метка для каждого запроса
			const { data: question } = useGetQuestionQuery({
				levelId: level,
				clientId: userId,
				timestamp: time
			})
			if (question) newQuestions.push(question)
		}

		setDisplayedQuestions(currentQuestions => [
			...currentQuestions,
			...newQuestions
		])
	}, [level, userId])

	getQuestion(time)
	const [time2, setTime2] = useState(Date.now())
	getQuestion(time2)

	const levelInfoText = 'chooseLevel'

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

	const [swiped, setSwiped] = useState(false)

	useEffect(() => {
		if (swiped) {
			setTime2(Date.now())
			setSwiped(false)
		}
	}, [swiped])

	const removeCard = useCallback(() => {
		console.log('BB' + displayedQuestions)
		if (displayedQuestions.length > 0) {
			setDisplayedQuestions(prevState => prevState.slice(1)) // Удаляем первую карточку
		}
		swipe.setValue({ x: 0, y: 0 })
		setSwipeDirection(prevDirection => -prevDirection)
		setSwiped(true)
	}, [swipe, displayedQuestions, id, getQuestion])

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

	const loadQuestionsForLevel = async (levelId: string) => {}

	const backToDecks = () => {
		goBack()
	}

	const onButtonPress = (
		levelId: string,
		buttonName: string,
		colorButton: string
	) => {
		const colorOfLevel = getLevelColor(colorButton)

		// setIsFirstCardInDeck(false)
		setButtonState({ levelBgColor: colorOfLevel, levelTitle: buttonName })
		if (level !== levelId) {
			setLevel(levelId)
			setDisplayedQuestions([])
			loadQuestionsForLevel(levelId)
			// setIsLastCardInDeck(false)
		}
		handleSelection(swipeDirection)
		// const time = useRef(Date.now()).current
		// getQuestion(time)

		setIsButtonPressed(true)
		// setCountOfCompletedCards(prevCount => prevCount + 1)
	}

	useEffect(() => {
		if (isButtonPressed) {
			const timer = setTimeout(() => {
				setIsButtonPressed(false)
			}, 500)

			return () => clearTimeout(timer)
		}
	}, [isButtonPressed])

	if (isFetchingLevels || isLoadingLevels || !displayedQuestions) {
		return <Loader />
	}

	// if (isError) {
	// 	return <SafeAreaView style={styles.container}><Text>Произошла ошибка при загрузке данных</Text></SafeAreaView>
	// }
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
												isLastCardInDeck={false}
												isFirstCardInDeck={false}
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
												{...{ ...dragHanlders }}
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
