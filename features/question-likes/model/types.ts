export interface QuestionLike {
  questionId: string;
  userId: string;
}

export interface QuestionsLikesState {
  questionsLikesSet: Set<string>;
} 