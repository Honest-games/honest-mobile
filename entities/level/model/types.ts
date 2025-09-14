export interface ILevelData {
	id: string;
	deckId: string;
	order: number;
	name: string;
	description: string;
	counts: {
		questionsCount: number;
		openedQuestionsCount: number;
	};
	color: string;
	cardBackgroundImageId: string | null;
} 