import { useGetDecksQuery } from '@/entities/deck'
import { useGetLevelsQuery } from '@/entities/level'
import { IDeck } from '@/services/types/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppSelector } from './useRedux'

const useDeck = (userId: string, options?: { skip?: boolean }) => {
	const language = useAppSelector(state => state.language.language)
	const {
		data: decks,
		isLoading: isLoadingDecks,
		isFetching: isFetchingDecks,
		refetch,
		error
	} = useGetDecksQuery({ clientId: userId }, { skip: options?.skip })
	return {
		decks,
		isLoadingDecks,
		isFetchingDecks,
		error,
		refetch
	}
}

export default useDeck
