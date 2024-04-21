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
	deck: selectedDeck, levels, userId
}: {deck: IDeck, levels: ILevelData[], userId: string})=>{
	const [selectedLevel, setSelectedLevel] = useState<ILevelData>()
	const [displayDataStack, setDisplayDataStack] =
		useState<DisplayedQuestionData[]>([])
	const { goBack } = useDeckId()

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
		startSwipeAnimation(moveToNextCard.bind(null, level))
		setSelectedLevel(level)
	}

	/*ANIMATION*/
	const swipe = useRef(new Animated.ValueXY()).current
	const [swipeDirection, setSwipeDirection] = useState(-1) //s Начинаем с направления влево (-1)

	const startSwipeAnimation = (
		onEnd: () => void
	) => {
		Animated.timing(swipe, {
			toValue: { x: swipeDirection * 500, y: 0 },
			useNativeDriver: true,
			duration: 500
		}).start(()=>{
			onAnimationEnd(onEnd)
		})
	}
	const onAnimationEnd = (action: ()=>void)=>{
		swipe.setValue({x: 0, y: 0})
		setSwipeDirection(prevDirection => -prevDirection)
		action()
	}
	/*END ANIMATION*/
	const [func, setFunc] = useState()

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
									userId={userId}
									displayDataStack={displayDataStack}
									swipe={swipe}
									onAnimationEnd={onAnimationEnd.bind(null, moveToNextCard.bind(null, selectedLevel))}
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

const CardsStack = ({
	displayDataStack,
	swipe,
	onAnimationEnd,
	selectedLevel,
	userId
}:{
	displayDataStack: DisplayedQuestionData[],
	swipe: Animated.ValueXY,
	onAnimationEnd: ()=>void,
	selectedLevel: ILevelData,
	userId: string
})=>{
	const panResponder = selectedLevel && getPanResponder(swipe, onAnimationEnd)
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
				<QuestionCard userId={userId} displayData={displayData} />
			</SwipeableCard>
		)
	}).reverse()
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
})
