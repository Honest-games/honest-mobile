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
import * as Haptics from 'expo-haptics';

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

	const userId = useUserId()
	const { decks } = useDeck(userId)

	const [selectedDeck, setSelectedDeck] = useState<IDeck>()

	//TODO fix
	useEffect(() => {
		if (decks && userId) {
			const found = decks.find(d => d.id === deckId)
			if (found) {
				setSelectedDeck(found)
			} else throw new Error('deck not found')
		}
	}, [decks, userId])

	if (!selectedDeck || !userId) return <Loader />
	return <OpenedDeck deck={selectedDeck} userId={userId} />
}

const OpenedDeck = ({ deck, userId }: { deck: IDeck; userId: string }) => {
	const time = useRef(Date.now()).current
	const { data: levels } = useGetLevelsQuery({ deckId: deck.id, time, clientId: userId })
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
	const isSeveralLevels = levels.length > 1;
	const [selectedLevel, setSelectedLevel] = useState<ILevelData>();
	const [displayDataStack, setDisplayDataStack] = useState<DisplayedCardItem[]>([]);
	const { goBack } = useDeckId();
	const time = useRef(Date.now()).current;

	const onButtonPress = async (level: ILevelData) => {
		if (isAnimationGoing) return;

		if (!selectedLevel) {
			// Первое нажатие - создаем две карточки с загруженными вопросами
			setDisplayDataStack([
				DisplayedCardItem.create(level, true, isSeveralLevels),  // Первая карта с загруженным вопросом
				DisplayedCardItem.create(level, true, isSeveralLevels)   // Вторая карта с загруженным вопросом
			]);
			setSelectedLevel(level);
		} else {
			if (selectedLevel.ID === level.ID) {
				// Тот же уровень - активируем загрузку вопроса для второй карты
				setDisplayDataStack(prev => {
					const second = prev[1];
					second.shouldLoadQuestion = true;
					return [...prev];
				});
				// triggerSwipeAnimation(() => moveToNextCard(level));
			} else {
				// Новый уровень - заменяем вторую карту с новым уровнем
				setDisplayDataStack(prev => [
					prev[0],
					DisplayedCardItem.create(level, true, isSeveralLevels) // Новая карта сразу с загрузкой вопроса
				]);
				setSelectedLevel(level);
			}
			triggerSwipeAnimation(moveToNextCard.bind(null, level))
		}
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	};

	const moveToNextCard = (level: ILevelData) => {
		if (displayDataStack.length > 0) {
			setDisplayDataStack(prevState => {
				const second = prevState[1];
				return [
					second,
					DisplayedCardItem.create(level, true, isSeveralLevels) // Новая карта сразу с загрузкой вопроса
				];
			});
		}
	};

	/*ANIMATION*/
	const swipe = useRef(new Animated.ValueXY()).current
	const [swipeDirection, setSwipeDirection] = useState(-1) //s Начинаем с направления влево (-1)
	const [isAnimationGoing, setIsAnimationGoing] = useState<boolean>(false)

	const triggerSwipeAnimation = (onEnd: () => void) => {
		Animated.timing(swipe, {
			toValue: { x: swipeDirection * 500, y: 0 },
			useNativeDriver: true,
			duration: 500
		}).start(() => {
			onAnimationEnd(onEnd)
		})
		setIsAnimationGoing(true)
	}
	const onAnimationEnd = (action: () => void) => {
		swipe.setValue({ x: 0, y: 0 })
		setSwipeDirection(prevDirection => -prevDirection)
		setIsAnimationGoing(false)
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
	children: (question?: IQuestion, isFetchingQuestion?: boolean, questionId?: string) => ReactNode
}) {
	const [time] = useState(Date.now());
	const [question, setQuestion] = useState<IQuestion>();
	const [questionId, setQuestionId] = useState<string>();

	const {
		data: fetchedQuestion,
		isFetching: isFetchingQuestion,
	} = useGetQuestionQuery({
		levelId: displayData.level.ID,
		clientId: userId,
		timestamp: time
	});

	const {
		data: fetchedQuestion2,
		isFetching: isFetchingQuestion2,
	} = useGetQuestionQuery({
		levelId: displayData.level.ID,
		clientId: userId,
		timestamp: time
	});

	useEffect(() => {
		// Используем первый успешно загруженный вопрос
		if (fetchedQuestion && !isFetchingQuestion) {
			setQuestion(fetchedQuestion);
			setQuestionId(fetchedQuestion.id);
		} else if (fetchedQuestion2 && !isFetchingQuestion2) {
			setQuestion(fetchedQuestion2);
			setQuestionId(fetchedQuestion2.id);
		}
	}, [fetchedQuestion, fetchedQuestion2, isFetchingQuestion, isFetchingQuestion2]);

	return children(question, isFetchingQuestion && isFetchingQuestion2, questionId);
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
	const panResponder = selectedLevel && getPanResponder(swipe, onAnimationEnd);

	return displayDataStack
		.map((displayData, i) => {
			const isFirst = i === 0;
			const actualHandlers = isFirst && panResponder ? panResponder.panHandlers : {};

			return (
				<SwipeableCard
					key={displayData.id}
					swipe={swipe}
					allowDrag={isFirst}
					{...actualHandlers}
				>
					{displayData.shouldLoadQuestion ? (
						<WithLoadingQuestion displayData={displayData} userId={userId}>
							{(question, isFetchingQuestion, questionId) => (
								<QuestionCard
									questionId={questionId}
									displayData={displayData}
									question={question}
									isFetchingQuestion={isFetchingQuestion}
								/>
							)}
						</WithLoadingQuestion>
					) : (
						<QuestionCard displayData={displayData} />
					)}
				</SwipeableCard>
			);
		})
		.reverse();
};

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
