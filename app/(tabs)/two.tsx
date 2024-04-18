import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, Text } from 'react-native'
import {setState} from "jest-circus";
import {useGetDecksQuery, useGetLevelsQuery, useGetQuestionQuery} from "@/services/api";
import {IDeck, ILevelData, IQuestion} from "@/services/types/types";
import {useDeck} from "@/features/hooks";
import {useAppSelector} from "@/features/hooks/useRedux";

const TinderSwipeDemo = () => {
	const { t } = useTranslation()
    const [selectedDeck, setSelectedDeck] = useState<IDeck>()
    const [savedDecks, setSavedDecks] = useState<IDeck[]>([])
    const [currentLevel, setCurrentLevel] = useState<ILevelData>()
    const [loadedQuestions, setLoadedQuestions] = useState<any[]>([])

    const timestampRef = useRef(Date.now()).current;
    const {
        data: decks,
        isLoading: isLoadingDecks,
        isFetching: isFetchingDecks,
        error
    } = useGetDecksQuery({ language: "RU", timestampRef })

    useEffect(() => {
        if(decks){
            setSavedDecks(decks)
        }
    }, [decks]);

    const onDeckSelect = (deck: IDeck)=>{
        setSelectedDeck(deck)
    }

    const onSelectLevel = (l: ILevelData)=>{
		if(!loadedQuestions.length) {
			setLoadedQuestions(prevState => {
				return [{i: 0, level: l}, {i: 1, level: l}]
			})
		} else {
			setLoadedQuestions(prevState => {
				let last = loadedQuestions[1];
				return [last, {level: l, i: last.i+1}]
			})
		}
		setCurrentLevel(l)
    }

    console.log("ren")
	return (
		<View style={styles.container}>
            <Text>{selectedDeck?.name}</Text>
            <Text>{currentLevel?.Name}</Text>
            {loadedQuestions.map(obj=><QuestionCard key={obj.i} level={obj.level} i={obj.i}/>)}
            {selectedDeck &&
                <LevelsSelect deck={selectedDeck} setCurrLevel={onSelectLevel}/>}
            <View style={{height: 20}}/>
            {savedDecks.map(deck=>{
                return <Button key={deck.id} onPress={onDeckSelect.bind(null, deck)} title={deck.name}/>
            })}
		</View>
	)
}

const QuestionCard = ({
    level, i
}: {level: ILevelData, i: number}) => {
	const [loadedQuestion, setLoadedQuestion] = useState<IQuestion>()
	const timestampRef = useRef(Date.now()).current;
	const { data: question, isFetching: isFetchingQuestion } =
		useGetQuestionQuery({ levelId: level.ID, clientId: "1", timestamp: timestampRef })

    useEffect(() => {
		console.log("question", question)
		if(question){
			setLoadedQuestion(question)
		}
    }, [question]);

    if (question){
        return <View><Text style={{color: "red"}}>{i} {question.text}</Text></View>
    } else return <View><Text>{i} q of {level ? level.Name : level}</Text></View>
}

const LevelsSelect = ({
    deck, setCurrLevel
}: {
    deck: IDeck, setCurrLevel: (l: ILevelData)=>void
})=>{
    const timestampRef = useRef(Date.now()).current;
    const { data: levels, isFetching: isFetchingLevels } =
        useGetLevelsQuery({deckId: deck.id, time: timestampRef})
    console.log("levels", levels)

    return (<>
        {levels &&<View>
            {levels.map(level => (
                <Button key={level.ID} onPress={setCurrLevel.bind(null, level)} title={level.Name}/>
            ))}
        </View>}
    </>)
}

const Button = (props: {onPress: ()=>void, title: string})=>{
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={styles.appButtonContainer}
        >
            <Text style={styles.appButtonText}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
	appButtonContainer: {
		elevation: 8,
		backgroundColor: '#009688',
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 12
	},
	appButtonText: {
		fontSize: 18,
		color: '#fff',
		fontWeight: 'bold',
		alignSelf: 'center',
		textTransform: 'uppercase'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})
export default React.memo(TinderSwipeDemo)
