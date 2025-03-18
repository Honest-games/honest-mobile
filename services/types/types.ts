export interface IDeck {
	id: string;
	languageCode: string;
	name: string;
	emoji: string;
	description: string;
	labels: string;
	image_id: string;
	cardsCount: number;
	hidden: boolean;
	promo: string;
}

export interface IQuestion {
	id: string
	level_id: string
	text: string
	additional_text?: string
}

export interface ILevelData {
	ColorButton: string; // предполагаем, что это строка в формате 'r,g,b'
	ColorEnd: string; // также строка в формате 'r,g,b'
	ColorStart: string; // аналогично строка в формате 'r,g,b'
	DeckID: string; // или number, если это числовой ID
	ID: string; // UUID, так что это строка
	LevelOrder: number; // числовое значение
	Name: string; // строка с названием
	emoji: string; // строка с эмодзи
	counts: {
		questionsCount: number,
		openedQuestionsCount: number
	};
	description: string
}

export interface DeckLike{
	id: string
	deckId: string
}

export interface QuestionLike{
	id: string
	questionId: string
}

export interface IUserProfile {
	id: string;
	name: string;
	bio: string;
	interests: string[];
	mood: string;
	avatarId: number;
	achievements: IAchievement[];
	stats: IUserStats;
}

export interface IAchievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	isUnlocked: boolean;
	progress?: {
		current: number;
		required: number;
	};
}

export interface IUserStats {
	totalRounds: number;
	totalQuestions: number;
	levelStats: {
		[levelId: string]: {
			questionsAnswered: number;
			roundsPlayed: number;
		};
	};
}