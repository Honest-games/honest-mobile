import { useCallback, useEffect, useState } from 'react'
import { useGetDecksQuery, useGetLevelsQuery } from '@/services/api'
import { IDeck } from '@/services/types/types'

const useDecks = () => {
	const {
		data: decks,
		isLoading: isLoadingDecks,
		isFetching: isFetchingDecks,
		error
	} = useGetDecksQuery()
	const [deckId, setDeckId] = useState('')
	const { data: levels, isFetching: isFetchingLevels } =
		useGetLevelsQuery(deckId)
	const [selectedDeck, setSelectedDeck] = useState<IDeck>()
	const [filtedDecks, setFilteredDecks] = useState<any>(decks)

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
			const result = decks?.filter(item =>
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
		filtedDecks,
		onFilteredDecks
	}
}

export default useDecks
