import { useGetDecksQuery, useGetLevelsQuery } from '@/services/api'
import { IDeck } from '@/services/types/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppSelector } from './useRedux'

const useDeck = () => {
	//TODO refactor
	const language = useAppSelector(state => state.language.language)
	const timestampRef = useRef(Date.now()).current
	const {
		data: decks,
		isLoading: isLoadingDecks,
		isFetching: isFetchingDecks,
		refetch,
		error
	} = useGetDecksQuery({ language, timestampRef })
	const [deckId, setDeckId] = useState('')
	const time = useRef(Date.now()).current

	const { data: levels, isFetching: isFetchingLevels } = useGetLevelsQuery({
		deckId,
		time
	})
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
