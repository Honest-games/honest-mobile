import { useGetDecksQuery, useGetLevelsQuery } from '@/services/api'
import { IDeck } from '@/services/types/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppSelector } from './useRedux'

const useDeck = (userId: string) => {
	const language = useAppSelector(state => state.language.language)
	// const timestampRef = useRef(Date.now()).current
	const {
		data: decks,
		isLoading: isLoadingDecks,
		isFetching: isFetchingDecks,
		refetch,
		error
	} = useGetDecksQuery({ language, clientId: userId })

	return {
		decks,
		isLoadingDecks,
		isFetchingDecks,
		error,
		refetch
	}
}

export default useDeck
