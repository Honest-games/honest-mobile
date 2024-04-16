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
import SwipeableCard from '@/components/SwipableCard'
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
import CardTopContent from "../../components/card/CardTopContent";
import CardText from "../../components/card/CardText";
import CardLikeButton from "../../components/card/CardLikeButton";
import QuestionCard, {TakeFirstCard} from "@/components/QuestionCard";
import getPanResponser from "@/components/animations";

const { width } = Dimensions.get('window')

const CardMemo = memo(SwipeableCard)

const DeckId: React.FC = () => {
	const { id } = useLocalSearchParams()

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
	useEffect(() => {(async () => {
			const userIdFromAS = await AsyncStorage.getItem('user_id')
			if (userIdFromAS) setUserId(userIdFromAS)
		})()
	})
	const [isFirstCardTaken, setIsFirstCardTaken] = useState<boolean>(false)
	const [displayedQuestions, setDisplayedQuestions] = useState<any[]>([])
	const {
		data: levels,
		isFetching: isFetchingLevels,
		isLoading: isLoadingLevels
	} = useGetLevelsQuery({ deckId: id.toString(), time })
	const { goBack } = useDeckId()
	const [buttonState, setButtonState] = useState<IQuestonLevelAndColor>()

	const [level, setLevel] = useState<string>('')

	const getQuestion = useCallback(
		(time: number) => {
			const {
				data: question,
			} = useGetQuestionQuery({
				levelId: level,
				clientId: userId,
				timestamp: time
			})
			useEffect(() => {
				if (question) {
					const newQuestions = [...displayedQuestions]
					newQuestions.push(question)
					setDisplayedQuestions(x => newQuestions)
				}
			}, [question])
		},
		[displayedQuestions]
	)

	getQuestion(time)
	const [time2, setTime2] = useState(Date.now())
	getQuestion(time2)

	const levelInfoText = 'chooseLevel'

	const [swipeDirection, setSwipeDirection] = useState(-1) //s Начинаем с направления влево (-1)
	const [isButtonPressed, setIsButtonPressed] = useState(false)

	const swipe = useRef(new Animated.ValueXY()).current

	const [swiped, setSwiped] = useState(false)

	useEffect(() => {
		if (swiped) {
			setTime2(Date.now())
			setSwiped(false)
		}
	}, [swiped])

	const moveToNextCard = useCallback(() => {
		if (displayedQuestions.length > 0) {
			setDisplayedQuestions(prevState => prevState.slice(1)) // Удаляем первую карточку
		}
		swipe.setValue({ x: 0, y: 0 })
		setSwipeDirection(prevDirection => -prevDirection)
		setSwiped(true)
		setIsFirstCardTaken(true)
	}, [swipe, displayedQuestions, id, getQuestion])

	const panResponser = getPanResponser(swipe, moveToNextCard)

	const handleSelection = useCallback(
		(direction: any) => {
			Animated.timing(swipe, {
				toValue: { x: direction * 500, y: 0 },
				useNativeDriver: true,
				duration: 500
			}).start(moveToNextCard)
		},
		[moveToNextCard]
	)

	const onButtonPress = (
		levelId: string,
		buttonName: string,
		colorButton: string
	) => {
		const colorOfLevel = getLevelColor(colorButton)
		setButtonState({ levelBgColor: colorOfLevel, levelTitle: buttonName })
		if (level !== levelId) {
			setLevel(levelId)
			setDisplayedQuestions([])
		}
		handleSelection(swipeDirection)

		setIsButtonPressed(true)
	}

	useEffect(() => {
		if (isButtonPressed) {
			const timer = setTimeout(() => {
				setIsButtonPressed(false)
			}, 500)

			return () => clearTimeout(timer)
		}
	}, [isButtonPressed])

	if (isFetchingLevels || isLoadingLevels) {
		return <Loader />
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
							goBack={goBack}
						/>

						<View
							style={{
								flex: 1,
								marginBottom: 12,
								marginTop: 12
							}}
						>
							{isFirstCardTaken ? displayedQuestions.length > 0 &&
								displayedQuestions
									.map((question: IQuestion, index: number) => {
										let isFirst = index === 0
										let dragHandlers = isFirst ? panResponser.panHandlers : {}
										return (
											<SwipeableCard
												key={`${question.id}-${index}`}
												swipe={swipe}
												isFirst={isFirst}
												{...{ ...dragHandlers }}
											>
												<QuestionCard buttonState={buttonState} question={question}/>
											</SwipeableCard>
										)
									})
									.reverse() : <TakeFirstCard/>}
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
	},
	questionCardWrapper: {
		flex: 1,
		margin: 16,
		zIndex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	additionalText: {
		position: 'absolute',
		fontSize: 16,
		textAlign: 'center',
		top: 0,
		left: 0,
		color: Colors.grey1
	}
})
