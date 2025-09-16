import React, { useMemo } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { SwipableCard } from '@/entities/card/ui';
import { QuestionCard } from '@/entities/question/ui';
import { getPanResponder } from '@/features/animations/model';
import { OptimizedQuestionLoader } from '@/widgets/question-loader';
import { IDisplayedCard } from '@/entities/card/ui';
import { ILevelData } from '@/entities/level';

interface CardStackManagerProps {
  displayDataStack: IDisplayedCard[];
  swipeX: SharedValue<number>;
  swipeY: SharedValue<number>;
  setUserSwiped: (swiped: boolean) => void;
  selectedLevel: ILevelData;
  userId: string;
}

interface CardItemProps {
  displayData: IDisplayedCard;
  userId: string;
  isFirst: boolean;
  swipeX?: SharedValue<number>;
  swipeY?: SharedValue<number>;
  panHandlers?: any;
}

const CardItem: React.FC<CardItemProps> = React.memo(({
  displayData,
  userId,
  isFirst,
  swipeX,
  swipeY,
  panHandlers,
}) => {
  const cardKey = useMemo(() =>
    `card-${displayData.id}-${displayData.level?.id || 'no-level'}`,
    [displayData.id, displayData.level?.id]
  );

  const shouldLoadQuestion = displayData.shouldLoadQuestion;
  return (
    <SwipableCard
      key={cardKey}
      swipeX={isFirst ? swipeX : undefined}
      swipeY={isFirst ? swipeY : undefined}
      allowDrag={isFirst}
      isVisible={displayData.isVisible}
      {...(panHandlers || {})}
    >
      {shouldLoadQuestion ? (
        <OptimizedQuestionLoader
          key={`question-${displayData.id}-${displayData.level?.id || 'no-level'}`}
          displayData={displayData}
          userId={userId}
        >
          {(question, isFetchingQuestion, questionId) => (
            <QuestionCard
              key={`content-${displayData.id}-${questionId || 'loading'}`}
              questionId={questionId}
              displayData={displayData}
              question={question}
              isFetchingQuestion={isFetchingQuestion}
            />
          )}
        </OptimizedQuestionLoader>
      ) : (
        <QuestionCard
          key={`static-${displayData.id}`}
          displayData={displayData}
        />
      )}
    </SwipableCard>
  );
});

export const CardStackManager: React.FC<CardStackManagerProps> = React.memo(({
  displayDataStack,
  swipeX,
  swipeY,
  setUserSwiped,
  selectedLevel,
  userId,
}) => {
  const panResponder = useMemo(() => {
    return selectedLevel ? getPanResponder(swipeX, swipeY, setUserSwiped) : null;
  }, [selectedLevel, swipeX, swipeY, setUserSwiped]);
  const renderedCards = useMemo(() => {
    return displayDataStack
      .map((displayData, i) => {
        const isFirst = i === 0;
        const actualHandlers = isFirst && panResponder ? panResponder.panHandlers : {};
        console.log('displayData', displayData);
        return (
          <CardItem
            key={displayData.id}
            displayData={displayData}
            userId={userId}
            isFirst={isFirst}
            swipeX={isFirst ? swipeX : undefined}
            swipeY={isFirst ? swipeY : undefined}
            panHandlers={actualHandlers}
          />
        );
      })
      .reverse(); // Reverse for proper z-index stacking
  }, [displayDataStack, panResponder, swipeX, swipeY, userId]);

  return <>{renderedCards}</>;
});