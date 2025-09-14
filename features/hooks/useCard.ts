import { useGetDecksQuery } from '@/entities/deck'
import { useGetLevelsQuery } from '@/entities/level'
import { IDeck } from '@/services/types/types'
import { useCallback, useEffect, useState } from 'react'

const useCard = () => {
	
	const isSpecialCard = (text: string): boolean => {
    return ['firstCard', 'chooseLevelContinue'].includes(text);
	};

	return {
		isSpecialCard
	}
}

export default useCard
