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