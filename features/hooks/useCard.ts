import { useGetDecksQuery, useGetLevelsQuery } from '@/services/api'
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
