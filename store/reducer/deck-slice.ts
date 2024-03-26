import { createSlice } from '@reduxjs/toolkit'

const cardsOfDeckSlice = createSlice({
	name: 'CardsOfDeckSlice',
	initialState: {
		deckSize: 0,
		count: 0
	},
	reducers: {
		incrementDeletedCards: state => {
			// Проверяем, достигнуто ли максимальное количество удаленных карт
			if (state.count < state.deckSize) {
				// Увеличиваем количество удаленных карт на 1
				state.count += 1
			}
		},
		setDeckSize: (state, action) => {
			state.deckSize = action.payload
			// Проверяем, если количество удаленных карт превышает новое количество карт в колоде, сбрасываем его до нуля
			if (state.count >= state.deckSize) {
				state.count = 0
			}
		}
	}
})

export const { incrementDeletedCards, setDeckSize } = cardsOfDeckSlice.actions
export default cardsOfDeckSlice.reducer
