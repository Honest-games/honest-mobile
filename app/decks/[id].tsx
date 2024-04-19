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
import {useGetDecksQuery, useGetLevelsQuery, useGetQuestionQuery} from '@/services/api'
import {IDeck, ILevelData, IQuestion} from '@/services/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useLocalSearchParams } from 'expo-router'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
	Animated,
	Dimensions,
	PanResponder,
	StyleSheet,
	View,
	Text, PanResponderInstance
} from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import CardTopContent from "../../components/card/CardTopContent";
import CardText from "../../components/card/CardText";
import CardLikeButton from "../../components/card/CardLikeButton";
import QuestionCard, {TakeFirstCard} from "@/components/QuestionCard";
import getPanResponder from "@/components/animations";
import DeckWithLevels from "@/components/DeckWithLevels";

const { width } = Dimensions.get('window')

const CardMemo = memo(SwipeableCard)

interface DisplayedQuestionData {
	id: number
	level: ILevelData
}

interface DeckIdProps {

}

const DeckId: React.FC = ({

}: DeckIdProps) => {
	const { id: deckId } = useLocalSearchParams()

	const { decks } = useDeck()

	const [selectedDeck, setSelectedDeck] = useState<IDeck>()

	useEffect(() => {
		if (decks) {
			const finded = decks.find(d => d.id === deckId)
			if (finded) {
				setSelectedDeck(finded)
			} else throw new Error('deck not found')
		}
	}, [decks])

	const [userId, setUserId] = useState<string>()
	useEffect(() => {
		;(async () => {
			const userIdFromAS = await AsyncStorage.getItem('user_id')
			if (userIdFromAS) setUserId(userIdFromAS)
		})()
	})

	/*	const [selectedDeck, setSelectedDeck] = useState<IDeck>()

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
        const [displayedQuestions, setDisplayedQuestions] = useState<DisplayedQuestionData[]>([])
        const {
            data: levels,
            isFetching: isFetchingLevels,
            isLoading: isLoadingLevels
        } = useGetLevelsQuery({ deckId: id.toString(), time })
        const { goBack } = useDeckId()
        const [buttonState, setButtonState] = useState<IQuestonLevelAndColor>()

        const [level, setLevel] = useState<string>('')


        const levelInfoText = 'chooseLevel'

        const [swipeDirection, setSwipeDirection] = useState(-1) //s Начинаем с направления влево (-1)
        const [isButtonPressed, setIsButtonPressed] = useState(false)

        const swipe = useRef(new Animated.ValueXY()).current

        const [swiped, setSwiped] = useState(false)

        useEffect(() => {
            if (swiped) {
                setSwiped(false)
            }
        }, [swiped])

        const moveToNextCard = useCallback(() => {
            /!*if (displayedQuestions.length > 0) {
                // setDisplayedQuestions(prevState => prevState.slice(1)) // Удаляем первую карточку
                setDisplayedQuestions(prevState => {
                    let last = prevState[prevState.length - 1];
                    return [last, {id: last.id+1, level: levels!.find(x=>x.ID===level)!}]
                })
            } else {
                setDisplayedQuestions([{id: 1, level: }])
            }*!/
            if (displayedQuestions.length > 0) {
                setDisplayedQuestions(prevState => prevState.slice(1)) // Удаляем первую карточку
            }
            swipe.setValue({ x: 0, y: 0 })
            setSwipeDirection(prevDirection => -prevDirection)
            setSwiped(true)
            setIsFirstCardTaken(true)
        }, [swipe, displayedQuestions, id])

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
        }, [isButtonPressed])*/

	// if (isFetchingLevels || isLoadingLevels) {
	if (!selectedDeck || !userId) return <Loader />
	return <OpenedDeck deck={selectedDeck} userId={userId} />
}

const OpenedDeck = ({deck, userId}: { deck: IDeck, userId: string })=>{
	const time = useRef(Date.now()).current
	const {
		data: levels,
		isFetching: isFetchingLevels,
		isLoading: isLoadingLevels
	} = useGetLevelsQuery({deckId: deck.id, time})
	if(!levels) return <Loader/>
	return <OpenedDeckWithLevels deck={deck} levels={levels} userId={userId}/>
}
const OpenedDeckWithLevels = ({
	deck: selectedDeck, levels
}: {deck: IDeck, levels: ILevelData[], userId: string})=>{
	const [selectedLevel, setSelectedLevel] = useState<ILevelData>()
	const [displayDataStack, setDisplayDataStack] =
		useState<DisplayedQuestionData[]>([])
	const { goBack } = useDeckId()

	/*ANIMATION*/
	// const [swiped, setSwiped] = useState(false)
	const swipe = useRef(new Animated.ValueXY()).current
	const [swipeDirection, setSwipeDirection] = useState(-1) //s Начинаем с направления влево (-1)

	const startSwipeAnimation = (
		direction: any,
		onEnd: () => void
	) => {
		console.log('start anim')
		Animated.timing(swipe, {
			toValue: { x: direction * 500, y: 0 },
			useNativeDriver: true,
			duration: 500
		}).start(()=>{
			console.log('end anum')
			onAnimationEnd(onEnd)
		})
	}
	const onAnimationEnd = (action: ()=>void)=>{
		swipe.setValue({x: 0, y: 0})
		setSwipeDirection(prevDirection => -prevDirection)
		action()
	}
	/*END ANIMATION*/
	const moveToNextCard = (level: ILevelData) => {
		if (displayDataStack.length > 0) {
			setDisplayDataStack(prevState => {
				let last = prevState[prevState.length - 1];
				return [last, {id: last.id+1, level: level}]
			})
		} else {
			setDisplayDataStack([{id: 1, level}, {id: 2, level}])
		}
	}

	const onButtonPress = (level: ILevelData)=>{
		setSelectedLevel(level)
		startSwipeAnimation(swipeDirection, moveToNextCard.bind(null, level))
	}
	console.log(displayDataStack.map(d=>d.id))
	return ( //TODO block buttons when animation
		<SafeAreaView style={styles.container}>
			<View style={styles.deck}>
				<View style={styles.wrapper}>
					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						<DeckTopContent selectedDeck={selectedDeck} goBack={goBack}/>
						<View style={{
								flex: 1,
								marginBottom: 12,
								marginTop: 12
							}}>
							{displayDataStack.length && selectedLevel
								? <CardsStack
									displayDataStack={displayDataStack}
									swipe={swipe}
									onAnimationEnd={onAnimationEnd}
									moveToNextCard={moveToNextCard}
									selectedLevel={selectedLevel}
								/>
								: <TakeFirstCard/>}
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

interface DisplayedQuestionData{
	id: number,
	level: ILevelData
}

const CardsStack = ({
	displayDataStack,
	swipe,
	onAnimationEnd,
	selectedLevel,
	moveToNextCard
}:{
	displayDataStack: DisplayedQuestionData[],
	swipe: Animated.ValueXY,
	onAnimationEnd: (action: ()=>void)=>void,
	selectedLevel: ILevelData,
	moveToNextCard: (level: ILevelData)=>void
})=>{
	let args = moveToNextCard.bind(null, selectedLevel);
	const panResponder = selectedLevel && getPanResponder(swipe, onAnimationEnd.bind(null, args))
	return displayDataStack.map((displayData, i)=>{
		const isFirst = i === 0
		const actualHandlers = (/*isFirst &&*/ panResponder) ? panResponder.panHandlers : {}
		console.log(isFirst)
		return (
			<SwipeableCard
				key={displayData.id}
				swipe={swipe}
				allowDrag={isFirst}
				{...{ ...actualHandlers }}
			>
				<QuestionCard level={displayData.level} question={
					{ id: 'lol', text: 'someText'+displayData.id, level_id: displayData.level.ID, additional_text: "You're awesome!" }
				} />
			</SwipeableCard>
		)
	}).reverse()
}

	// }

	// return <DeckWithLevels deck={} />

/*	return (
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
	)*/

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
})
