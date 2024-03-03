export interface IDeck {
	description: string
	id: string
	name: string
}

export interface IQuestion {
	id: string
	level_id: string
	text: string
}

export interface ILevelData {
	ColorEnd: string
	ColorStart: string
	DeckID: string
	ID: string
	LevelOrder: number
	Name: string
}
