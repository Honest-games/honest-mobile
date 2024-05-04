import { LevelInfo } from '@/UI/LevelInfo'
import QuestionCard, { TakeFirstCard } from '@/components/QuestionCard'
import SwipeableCard from '@/components/SwipableCard'
import getPanResponder from '@/components/animations'
import { DeckTopContent } from '@/components/deck'
import {useDeck, useDeckId, useUserId} from '@/features/hooks'
import { LevelButtons } from '@/modules/LevelButtons'
import Loader from '@/modules/Loader'
import { useGetLevelsQuery, useGetQuestionQuery } from '@/services/api'
import { IDeck, ILevelData, IQuestion } from '@/services/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'
import React, { ReactNode, memo, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const CardMemo = memo(SwipeableCard)

export class DisplayedCardItem {
	id: number
	level: ILevelData
	shouldLoadQuestion: boolean
	shouldShowLevelOnCard: boolean

	static _currentDisplayDataIndex = 0

	static create(level: ILevelData, shouldLoadQuestion: boolean = false,
				  shouldShowLevelOnCard: boolean = true) {
		return new DisplayedCardItem(level, shouldLoadQuestion, shouldShowLevelOnCard)
	}

	constructor(level: ILevelData, shouldLoadQuestion: boolean, shouldShowLevelOnCard: boolean) {
		this.id = DisplayedCardItem._currentDisplayDataIndex++
		this.level = level
		this.shouldLoadQuestion = shouldLoadQuestion
		this.shouldShowLevelOnCard = shouldShowLevelOnCard
	}
}

const DeckId: React.FC = () => {
	const { id: deckId } = useLocalSearchParams()

	const { decks } = useDeck()

	const [selectedDeck, setSelectedDeck] = useState<IDeck>()

	//TODO fix
	useEffect(() => {
		if (decks) {
			const finded = decks.find(d => d.id === deckId)
			if (finded) {
				setSelectedDeck(finded)
			} else throw new Error('deck not found')
		}
	}, [decks])

	const userId = useUserId()
	if (!selectedDeck || !userId) return <Loader />
	return <OpenedDeck deck={selectedDeck} userId={userId} />
}

const OpenedDeck = ({ deck, userId }: { deck: IDeck; userId: string }) => {
	const time = useRef(Date.now()).current
	const { data: levels } = useGetLevelsQuery({ deckId: deck.id, time })
	if (!levels) {
		return <Loader />
	} else {
		return <OpenedDeckWithLevels deck={deck} levels={levels} userId={userId} />
	}
}
const OpenedDeckWithLevels = ({
	deck: selectedDeck,
	levels,
	userId
}: {
	deck: IDeck
	levels: ILevelData[]
	userId: string
}) => {
	const isSingleLevel = levels.length === 1
	const [selectedLevel, setSelectedLevel] = useState<ILevelData>()
	const [displayDataStack, setDisplayDataStack] = useState<DisplayedCardItem[]>(
		[]
	)
	const { goBack } = useDeckId()

	const moveToNextCard = (level: ILevelData) => {
		if (displayDataStack.length > 0) {
			//discard first item; put second as first and make it load question; add new item
			setDisplayDataStack(prevState => {
				let second = prevState[1]
				second.shouldLoadQuestion = true
				return [second, DisplayedCardItem.create(level, false, isSingleLevel)]
			})
		}
	}

	const onButtonPress = (level: ILevelData) => {
		if (!selectedLevel) {
			setDisplayDataStack([
				DisplayedCardItem.create(level, true),
				DisplayedCardItem.create(level, false, isSingleLevel)
			])
			setSelectedLevel(level)
		} else {
			if (selectedLevel.ID === level.ID) {
				//start loading question for second card while first is preparing to be discarded later
				setDisplayDataStack(prev => {
					const second = prev[1]
					if (second) second.shouldLoadQuestion = true
					return [...prev]
				})
			} else {
				//replace second item with having needed level and loading its question
				setDisplayDataStack(prev => [
					prev[0],
					DisplayedCardItem.create(level, true, isSingleLevel)
				])
				setSelectedLevel(level)
			}
			triggerSwipeAnimation(moveToNextCard.bind(null, level))
		}
	}

	/*ANIMATION*/
	const swipe = useRef(new Animated.ValueXY()).current
	const [swipeDirection, setSwipeDirection] = useState(-1) //s Начинаем с направления влево (-1)

	const triggerSwipeAnimation = (onEnd: () => void) => {
		Animated.timing(swipe, {
			toValue: { x: swipeDirection * 500, y: 0 },
			useNativeDriver: true,
			duration: 500
		}).start(() => {
			onAnimationEnd(onEnd)
		})
	}
	const onAnimationEnd = (action: () => void) => {
		swipe.setValue({ x: 0, y: 0 })
		setSwipeDirection(prevDirection => -prevDirection)
		action()
	}

	return (
		//TODO block buttons when animation
		<SafeAreaView style={styles.container}>
			<View style={styles.deck}>
				<View style={styles.wrapper}>
					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						<DeckTopContent selectedDeck={selectedDeck} goBack={goBack} />
						<View
							style={{
								flex: 1,
								marginBottom: 12,
								marginTop: 12
							}}
						>
							{displayDataStack.length && selectedLevel ? (
								<CardsStack
									userId={userId}
									displayDataStack={displayDataStack}
									swipe={swipe}
									onAnimationEnd={onAnimationEnd.bind(
										null,
										moveToNextCard.bind(null, selectedLevel)
									)}
									selectedLevel={selectedLevel}
								/>
							) : (
								<TakeFirstCard />
							)}
						</View>
						<View style={{ marginBottom: 12 }}>
							<LevelInfo levelInfo={'chooseLevel'} />
						</View>

						<LevelButtons
							levels={levels}
							onButtonPress={onButtonPress}
							size='large'
						/>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

function WithLoadingQuestion({
	displayData,
	userId,
	children
}: {
	displayData: DisplayedCardItem
	userId: string
	children: (
		question?: IQuestion,
		isFetchingQuestion?: boolean,
		questionId?: string
	) => ReactNode
}) {
	const [time] = useState(Date.now())
	const [question, setQuestion] = useState<IQuestion>()
	const [questionId, setQuestionId] = useState<string>()
	const {
		data: fetchedQuestion,
		isFetching: isFetchingQuestion,
		refetch
	} = useGetQuestionQuery({
		levelId: displayData.level.ID,
		clientId: userId,
		timestamp: time
	})
	useEffect(() => {
		if (fetchedQuestion && !isFetchingQuestion) {
			setQuestion(fetchedQuestion)
			setQuestionId(fetchedQuestion.id)
		}
	}, [fetchedQuestion])
	return children(question, isFetchingQuestion, questionId)
}

const CardsStack = ({
	displayDataStack,
	swipe,
	onAnimationEnd,
	selectedLevel,
	userId
}: {
	displayDataStack: DisplayedCardItem[]
	swipe: Animated.ValueXY
	onAnimationEnd: () => void
	selectedLevel: ILevelData
	userId: string
}) => {
	const panResponder = selectedLevel && getPanResponder(swipe, onAnimationEnd)
	return displayDataStack
		.map((displayData, i) => {
			const isFirst = i === 0
			const actualHandlers = /*isFirst &&*/ panResponder
				? panResponder.panHandlers
				: {}
			return (
				<SwipeableCard
					key={displayData.id}
					swipe={swipe}
					allowDrag={isFirst}
					{...{ ...actualHandlers }}
				>
					{!displayData.shouldLoadQuestion ? (
						//Если вопрос не надо грузить - показываем карточку без него - она с блюром
						<QuestionCard displayData={displayData} />
					) : (
						//А если надо - оборачиваем в функцию которая грузит этот вопрос и отдаёт карточке уже точно загруженный
						<WithLoadingQuestion displayData={displayData} userId={userId}>
							{/*здесь в качестве children используется функция. Компонент WithLoadingQuestion сам даёт в неё переменную question*/}
							{(question, isFetchingQuestion, questionId) => (
								<QuestionCard
									questionId={questionId}
									displayData={displayData}
									question={question}
									isFetchingQuestion={isFetchingQuestion}
								/>
							)}
						</WithLoadingQuestion>
					)}
				</SwipeableCard>
			)
		})
		.reverse()
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
