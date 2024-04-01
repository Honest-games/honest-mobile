import { useGetDecksQuery, useGetLevelsQuery } from '@/services/api'
import { IDeck } from '@/services/types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'
import { useAppSelector } from './useRedux'

const useDeck = () => {
	const language = useAppSelector(state => state.language.language)
	const {
		data: decks,
		isLoading: isLoadingDecks,
		isFetching: isFetchingDecks,
		error
	} = useGetDecksQuery(language)
	const [deckId, setDeckId] = useState('')
	const { data: levels, isFetching: isFetchingLevels } =
		useGetLevelsQuery(deckId)
	const [selectedDeck, setSelectedDeck] = useState<IDeck>()
	const [filteredDecks, setFilteredDecks] = useState<IDeck[] | undefined>(decks)

	useEffect(() => {
		const findDeck = decks?.find((item: IDeck) => item.id === deckId.toString())
		if (findDeck) {
			setSelectedDeck(findDeck)
		}
	}, [deckId, decks])

	useEffect(() => {
		setFilteredDecks(decks || [])
	}, [decks])

	const onFilteredDecks = useCallback(
		(text: string) => {
			const result = decks?.filter((item: IDeck) =>
				item.name.toLowerCase().includes(text.toLowerCase().trim())
			)
			setFilteredDecks(result || decks || [])
		},
		[decks]
	)

	return {
		decks,
		isLoadingDecks,
		isFetchingDecks,
		error,
		deckId,
		setDeckId,
		levels,
		isFetchingLevels,
		selectedDeck,
		setSelectedDeck,
		filteredDecks,
		onFilteredDecks
	}
}

export default useDeck
