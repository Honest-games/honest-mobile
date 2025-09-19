import { QuestionCard, TakeFirstCard } from "@/entities/question/ui";
import { SwipableCard } from "@/entities/card/ui";
import { getPanResponder } from "@/features/animations/model";
import { useDeck, useDeckId, useUserId } from "@/features/hooks";
import { LevelButtons } from "@/widgets/level-list";
import { useGetLevelsQuery, useShuffleLevelMutation } from "@/entities/level";
import { useGetQuestionQuery } from "@/entities/question";
import { useShuffleDeckMutation } from "@/entities/deck";
import { IDeck, ILevelData, IQuestion, IAchievement } from "@/services/types/types";
import { useLocalSearchParams } from "expo-router";
import React, { ReactNode, useEffect, useState, useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSharedValue, withTiming, SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import { AchievementModal } from "@/features/achievements/ui";
import { ShuffleDialog } from "@/features/deck-shuffle";
import { clearLastUnlockedAchievement, incrementStats } from "@/entities/profile/model";
import { ResumeDeckDialog } from "@/features/deck-resume";
import { DeckTopContent } from "@/entities/deck/ui/deck-top-content";
import { Loader } from "@/shared/ui/loader";

const { width } = Dimensions.get("window");

export class DisplayedCardItem {
  id: string;
  level: ILevelData | null;
  shouldLoadQuestion: boolean;
  shouldShowLevelOnCard: boolean;
  isSwipeable: boolean;
  isVisible: boolean;
  customText?: string;

  static _currentDisplayDataIndex = 0;

  static createWithText(text: string, isSwipeable: boolean = true) {
    return new DisplayedCardItem(
      null, // level
      false, // shouldLoadQuestion
      false, // shouldShowLevelOnCard
      isSwipeable,
      true, // isVisible
      text,
    );
  }

  static create(level: ILevelData, shouldLoadQuestion: boolean = false, shouldShowLevelOnCard: boolean = true) {
    // Force new ID every time to prevent content reuse
    DisplayedCardItem._currentDisplayDataIndex += Math.floor(Math.random() * 1000);
    return new DisplayedCardItem(
      level,
      shouldLoadQuestion,
      shouldShowLevelOnCard,
      true, // isSwipeable
      true, // isVisible
    );
  }

  constructor(
    level: ILevelData | null,
    shouldLoadQuestion: boolean,
    shouldShowLevelOnCard: boolean,
    isSwipeable: boolean,
    isVisible: boolean,
    customText?: string,
  ) {
    this.id = (DisplayedCardItem._currentDisplayDataIndex++).toString();
    this.level = level;
    this.shouldLoadQuestion = shouldLoadQuestion;
    this.shouldShowLevelOnCard = shouldShowLevelOnCard;
    this.isSwipeable = isSwipeable;
    this.isVisible = isVisible;
    this.customText = customText;
  }
}

const DeckId: React.FC = () => {
  const { id: deckId } = useLocalSearchParams();

  const userId = useUserId();
  const { decks } = useDeck(userId);

  const [selectedDeck, setSelectedDeck] = useState<IDeck>();

  //TODO fix
  useEffect(() => {
    if (decks && userId) {
      const found = decks.find((d) => d.id === deckId);
      if (found) {
        setSelectedDeck(found);
      } else throw new Error("deck not found");
    }
  }, [decks, userId]);

  if (!selectedDeck || !userId) return <Loader />;
  return <OpenedDeck deck={selectedDeck} userId={userId} />;
};

const OpenedDeck = ({ deck, userId }: { deck: IDeck; userId: string }) => {
  const { data: levels } = useGetLevelsQuery({ deckId: deck.id, clientId: userId });
  if (!levels) {
    return <Loader />;
  } else {
    return <OpenedDeckWithLevels deck={deck} levels={levels} userId={userId} />;
  }
};
const OpenedDeckWithLevels = ({ deck: selectedDeck, levels, userId }: { deck: IDeck; levels: ILevelData[]; userId: string }) => {
  const { t } = useTranslation();
  const isSeveralLevels = levels.length > 1;
  const [selectedLevel, setSelectedLevel] = useState<ILevelData>();
  const [displayDataStack, setDisplayDataStack] = useState<DisplayedCardItem[]>([]);
  const { goBack } = useDeckId();
  const [isShuffleDialogVisible, setShuffleDialogVisible] = useState(false);
  const [isResumeDialogVisible, setIsResumeDialogVisible] = useState(false);

  const [shuffleDeck] = useShuffleDeckMutation();
  const [shuffleLevel] = useShuffleLevelMutation();
  const [isShuffling, setIsShuffling] = useState(false);
  const dispatch = useAppDispatch();
  const [showFireworks, setShowFireworks] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const profile = useAppSelector((state) => state.profile);
  const [unlockedAchievement, setUnlockedAchievement] = useState<IAchievement | null>(null);

  useEffect(() => {
    if (profile.lastUnlockedAchievement) {
      const achievement = profile.achievements.find((a: any) => a.id === profile.lastUnlockedAchievement);
      if (achievement) {
        setUnlockedAchievement(achievement as IAchievement);
        setShowAchievementModal(true);
        setShowFireworks(true);
      }
    }
  }, [profile.lastUnlockedAchievement]);

  const handleFireworksFinish = () => {
    setShowFireworks(false);
  };

  const handleAchievementModalClose = () => {
    setShowAchievementModal(false);
    setUnlockedAchievement(null);
    dispatch(clearLastUnlockedAchievement());
  };

  const handleResumeDialogClose = () => {
    setIsResumeDialogVisible(false);
  };
  const handleStartOver = async () => {
    try {
      await handleShuffleDeck();
      // Создаем две карты с первым уровнем после перемешивания
      const firstLevel = levels[0];
      setDisplayDataStack([
        DisplayedCardItem.create(firstLevel, true, isSeveralLevels),
        DisplayedCardItem.create(firstLevel, true, isSeveralLevels),
      ]);
      setSelectedLevel(firstLevel);
    } catch (error) {
      console.error("Error shuffling deck:", error);
    }
    setIsResumeDialogVisible(false);
  };
  const handleCardComplete = useCallback(() => {
    if (selectedLevel?.id) {
      dispatch(incrementStats({ levelId: selectedLevel.id }));
    }
  }, [selectedLevel, dispatch]);

  const onButtonPress = async (level: ILevelData) => {
    if (isAnimationGoing) return;

    if (!selectedLevel) {
      // Первое нажатие - создаем две карточки с загруженными вопросами
      setDisplayDataStack([
        DisplayedCardItem.create(level, true, isSeveralLevels), // Первая карта с загруженным вопросом
        DisplayedCardItem.create(level, true, isSeveralLevels), // Вторая карта с загруженным вопросом
      ]);
      setSelectedLevel(level);

      // Засчитываем первую карточку сразу
      dispatch(incrementStats({ levelId: level.id }));
    } else {
      if (selectedLevel.id === level.id) {
        // Тот же уровень - активируем загрузку вопроса для второй карты
        setDisplayDataStack((prev) => {
          const second = prev[1];
          second.shouldLoadQuestion = true;
          return [...prev];
        });
        // triggerSwipeAnimation(() => moveToNextCard(level));
      } else {
        // Новый уровень - заменяем вторую карту с новым уровнем
        setDisplayDataStack((prev) => [
          prev[0],
          DisplayedCardItem.create(level, true, isSeveralLevels), // Новая карта сразу с загрузкой вопроса
        ]);
        setSelectedLevel(level);
      }
      triggerSwipeAnimation(() => {
        // Сначала засчитываем предыдущую карточку
        handleCardComplete();
        // Затем переходим к следующей (пропускаем повторный подсчет)
        moveToNextCard(level, true);
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const moveToNextCard = useCallback(
    (level: ILevelData, skipStatsIncrement = false) => {
      if (displayDataStack.length > 0) {
        // Вызываем handleCardComplete только если не пропускаем (для случаев когда уже вызвали)
        if (!skipStatsIncrement) {
          handleCardComplete();
        }

        // Force immediate update with completely new cards
        setDisplayDataStack((prevState) => {
          const newCard = DisplayedCardItem.create(level, true, isSeveralLevels);
          const secondCard = prevState[1] || newCard;

          // Ensure we have completely fresh cards
          return [secondCard, newCard];
        });
      }
    },
    [handleCardComplete, isSeveralLevels, displayDataStack.length],
  );

  /*ANIMATION*/
  const swipeX = useSharedValue(0);
  const swipeY = useSharedValue(0);
  const [swipeDirection, setSwipeDirection] = useState(-1);
  const [isAnimationGoing, setIsAnimationGoing] = useState<boolean>(false);
  const [pendingActionAfterAnimation, setPendingActionAfterAnimation] = useState<(() => void) | null>(null);
  const [userSwiped, setUserSwiped] = useState(false);

  // Watch for animation completion using a simple effect
  useEffect(() => {
    if (!isAnimationGoing && pendingActionAfterAnimation) {
      const action = pendingActionAfterAnimation;
      setPendingActionAfterAnimation(null);

      // Execute after a small delay
      setTimeout(() => {
        try {
          action();
        } catch (error) {
          console.error("Pending action error:", error);
        }
      }, 100);
    }
  }, [isAnimationGoing, pendingActionAfterAnimation]);

  // Watch for user swipe completion
  useEffect(() => {
    if (userSwiped && selectedLevel) {
      setUserSwiped(false);

      // Move to next card IMMEDIATELY (animation values already reset in getPanResponder)
      try {
        moveToNextCard(selectedLevel, false); // Не пропускаем подсчет при смахивании пользователем
      } catch (error) {
        console.error("Move to next card error:", error);
      }
    }
  }, [userSwiped, selectedLevel, moveToNextCard]);

  const triggerSwipeAnimation = (onEnd: () => void) => {
    if (isAnimationGoing) return;

    setIsAnimationGoing(true);
    setPendingActionAfterAnimation(() => onEnd);

    // Start animation WITHOUT any callbacks
    swipeX.value = withTiming(swipeDirection * 500, { duration: 500 });
    swipeY.value = withTiming(0, { duration: 500 });

    // Reset after animation duration + small buffer
    setTimeout(() => {
      swipeX.value = 0;
      swipeY.value = 0;
      setSwipeDirection((prevDirection) => -prevDirection);
      setIsAnimationGoing(false);

      // Если была карта с сообщением о перемешивании, сбрасываем флаг
      if (displayDataStack[0]?.customText === t("levelCardsShuffled")) {
        setIsShuffling(false);
      }
    }, 600); // 500ms animation + 100ms buffer
  };

  const handleShufflePress = () => {
    setShuffleDialogVisible(true);
  };

  const handleShuffleLevel = async () => {
    if (selectedLevel && !isShuffling) {
      try {
        setIsShuffling(true);
        await shuffleLevel({ levelId: selectedLevel.id, userId });

        // Создаем новый стек карточек с сообщением о перемешивании
        const newStack = [
          displayDataStack[0], // Оставляем текущую карту
          DisplayedCardItem.createWithText(t("levelCardsShuffled"), true),
          DisplayedCardItem.create(selectedLevel, true, isSeveralLevels),
        ];

        setDisplayDataStack(newStack);
        triggerSwipeAnimation(() => {
          // После смахивания первой карты isShuffling останется true
          // Он сбросится только когда пользователь смахнет карту с сообщением
          moveToNextCardAfterShuffle();
        });
      } catch (error) {
        console.error("Error shuffling level:", error);
        setIsShuffling(false);
      }
    }
    setShuffleDialogVisible(false);
  };

  const moveToNextCardAfterShuffle = () => {
    if (displayDataStack.length > 1) {
      setDisplayDataStack((prevState) => {
        const remainingCards = prevState.slice(1);
        return remainingCards;
      });
    }
  };

  const handleShuffleDeck = async () => {
    try {
      await shuffleDeck({ deckId: selectedDeck.id, userId });

      // Если нет карт в стеке (первый вход) или нет выбранного уровня
      if (displayDataStack.length === 0 || !selectedLevel) {
        setDisplayDataStack([
          DisplayedCardItem.createWithText(
            t("allLevelsShuffled"),
            false, // нельзя смахнуть, нужно выбрать уровень
          ),
        ]);
      } else {
        // Если есть текущая карта, добавляем её в стек перед сообщением
        setDisplayDataStack([
          displayDataStack[0],
          DisplayedCardItem.createWithText(
            t("allLevelsShuffled"),
            selectedLevel !== undefined, // можно смахнуть только если уровень был выбран
          ),
          ...(selectedLevel ? [DisplayedCardItem.create(selectedLevel, true, isSeveralLevels)] : []),
        ]);

        // Запускаем анимацию смахивания текущей карты
        triggerSwipeAnimation(() => {
          moveToNextCardAfterShuffle();
        });
      }
    } catch (error) {
      console.error("Error shuffling deck:", error);
    }
    setShuffleDialogVisible(false);
  };

  return (
    //TODO block buttons when animation
    <SafeAreaView style={styles.container}>
      <View style={styles.deck}>
        <View style={styles.wrapper}>
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <DeckTopContent selectedDeck={selectedDeck} goBack={goBack} onShufflePress={handleShufflePress} />
            <View
              style={{
                flex: 1,
                marginBottom: 12,
                marginTop: 12,
              }}
            >
              {displayDataStack.length > 0 && selectedLevel ? (
                <CardsStack
                  userId={userId}
                  displayDataStack={displayDataStack}
                  swipeX={swipeX}
                  swipeY={swipeY}
                  setUserSwiped={setUserSwiped}
                  selectedLevel={selectedLevel}
                />
              ) : (
                <TakeFirstCard />
              )}
            </View>

            <LevelButtons levels={levels} onButtonPress={onButtonPress} size="large" />
          </View>
        </View>
      </View>

      <ShuffleDialog
        visible={isShuffleDialogVisible}
        onClose={() => setShuffleDialogVisible(false)}
        onShuffleLevel={handleShuffleLevel}
        onShuffleDeck={handleShuffleDeck}
        isShuffleLevelDisabled={!selectedLevel || isShuffling}
        isSingleLevel={levels.length === 1}
      />
      <ResumeDeckDialog visible={isResumeDialogVisible} onClose={handleResumeDialogClose} onStartOver={handleStartOver} />

      <AchievementModal
        achievement={unlockedAchievement}
        visible={showAchievementModal}
        onClose={handleAchievementModalClose}
        showFireworks={showFireworks}
        onFireworksFinish={handleFireworksFinish}
      />
    </SafeAreaView>
  );
};

function WithLoadingQuestion({
  displayData,
  userId,
  children,
}: {
  displayData: DisplayedCardItem;
  userId: string;
  children: (question?: IQuestion, isFetchingQuestion?: boolean, questionId?: string) => ReactNode;
}) {
  // Generate unique timestamp for each card to force fresh question
  const [time] = useState(() => Date.now() + parseInt(displayData.id) * 1000);
  const [question, setQuestion] = useState<IQuestion>();
  const [questionId, setQuestionId] = useState<string>();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset question when displayData changes
  useEffect(() => {
    setIsTransitioning(true);
    setQuestion(undefined);
    setQuestionId(undefined);

    // Short delay to prevent flickering
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [displayData.id]);

  const { data: fetchedQuestion, isFetching: isFetchingQuestion } = useGetQuestionQuery(
    displayData.level?.id
      ? {
          levelId: displayData.level.id,
          clientId: userId,
          timestamp: time,
        }
      : { levelId: "", clientId: userId, timestamp: time },
    {
      skip: !displayData.level?.id,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    // Only update question when we have a new one AND it's not loading
    if (fetchedQuestion && !isFetchingQuestion) {
      setQuestion(fetchedQuestion);
      setQuestionId(fetchedQuestion.id);
    }
  }, [fetchedQuestion, isFetchingQuestion]);

  // Complete content isolation - never show old content
  const isLoading = isFetchingQuestion || isTransitioning;

  // Only show question if we have it AND we're not transitioning AND not fetching
  const shouldShowContent = !isTransitioning && !isFetchingQuestion && question;
  const questionToShow = shouldShowContent ? question : undefined;
  const shouldShowLoading = isLoading || (!shouldShowContent && displayData.shouldLoadQuestion);

  return children(questionToShow, shouldShowLoading, shouldShowContent ? questionId : undefined);
}

const CardsStack = ({
  displayDataStack,
  swipeX,
  swipeY,
  setUserSwiped,
  selectedLevel,
  userId,
}: {
  displayDataStack: DisplayedCardItem[];
  swipeX: SharedValue<number>;
  swipeY: SharedValue<number>;
  setUserSwiped: (swiped: boolean) => void;
  selectedLevel: ILevelData;
  userId: string;
}) => {
  const panResponder = selectedLevel && getPanResponder(swipeX, swipeY, setUserSwiped);

  return displayDataStack
    .map((displayData, i) => {
      const isFirst = i === 0;
      const actualHandlers = isFirst && panResponder ? panResponder.panHandlers : {};

      return (
        <SwipableCard
          key={`card-${displayData.id}`}
          swipeX={isFirst ? swipeX : undefined}
          swipeY={isFirst ? swipeY : undefined}
          allowDrag={isFirst}
          {...actualHandlers}
        >
          {displayData.shouldLoadQuestion ? (
            <WithLoadingQuestion key={`question-${displayData.id}`} displayData={displayData} userId={userId}>
              {(question, isFetchingQuestion, questionId) => (
                <QuestionCard
                  key={`content-${displayData.id}`}
                  questionId={questionId}
                  displayData={displayData}
                  question={question}
                  isFetchingQuestion={isFetchingQuestion}
                />
              )}
            </WithLoadingQuestion>
          ) : (
            <QuestionCard key={`static-${displayData.id}`} displayData={displayData} />
          )}
        </SwipableCard>
      );
    })
    .reverse();
};

export default React.memo(DeckId);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    flexDirection: "column",
    margin: 24,
    gap: 12,
  },
  deck: {
    flex: 1,
    width: width - 40,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 33,
  },
});
