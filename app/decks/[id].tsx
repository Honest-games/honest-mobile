import { QuestionCard, TakeFirstCard } from "@/entities/question/ui";
import { SwipableCard } from "@/entities/card/ui";
import { getPanResponder } from "@/features/animations/model";
import { useDeck, useDeckId, useUserId } from "@/features/hooks";
import { LevelButtons } from "@/widgets/level-list";
import { useGetLevelsQuery, useGetQuestionQuery, useShuffleDeckMutation, useShuffleLevelMutation } from "@/services/api";
import { IDeck, ILevelData, IQuestion, IAchievement } from "@/services/types/types";
import { useLocalSearchParams } from "expo-router";
import React, { ReactNode, memo, useEffect, useRef, useState, useCallback } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import { Fireworks } from "@/shared/ui/animations";
import { AchievementModal } from "@/features/achievements/ui";
import { ShuffleDialog } from "@/features/deck-shuffle";
import { clearLastUnlockedAchievement, incrementStats } from "@/entities/profile/model";
import { ResumeDeckDialog } from "@/features/deck-resume";
import { DeckTopContent } from "@/entities/deck/ui/deck-top-content";
import { Loader } from "@/shared/ui/loader";

const { width } = Dimensions.get("window");

const CardMemo = memo(SwipableCard);

export class DisplayedCardItem {
  id: number;
  level: ILevelData | null;
  shouldLoadQuestion: boolean;
  shouldShowLevelOnCard: boolean;
  isSwipeable: boolean;
  customText?: string;

  static _currentDisplayDataIndex = 0;

  static createWithText(text: string, isSwipeable: boolean = true) {
    return new DisplayedCardItem(
      null, // level
      false, // shouldLoadQuestion
      false, // shouldShowLevelOnCard
      isSwipeable,
      text,
    );
  }

  static create(level: ILevelData, shouldLoadQuestion: boolean = false, shouldShowLevelOnCard: boolean = true) {
    return new DisplayedCardItem(
      level,
      shouldLoadQuestion,
      shouldShowLevelOnCard,
      true, // isSwipeable
    );
  }

  constructor(
    level: ILevelData | null,
    shouldLoadQuestion: boolean,
    shouldShowLevelOnCard: boolean,
    isSwipeable: boolean,
    customText?: string,
  ) {
    this.id = DisplayedCardItem._currentDisplayDataIndex++;
    this.level = level;
    this.shouldLoadQuestion = shouldLoadQuestion;
    this.shouldShowLevelOnCard = shouldShowLevelOnCard;
    this.isSwipeable = isSwipeable;
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
  const time = useRef(Date.now()).current;
  const { data: levels } = useGetLevelsQuery({ deckId: deck.id, time, clientId: userId });
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
  const time = useRef(Date.now()).current;
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
        setUnlockedAchievement(achievement);
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
    if (selectedLevel?.ID) {
      dispatch(incrementStats({ levelId: selectedLevel.ID }));
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
    } else {
      if (selectedLevel.ID === level.ID) {
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
      triggerSwipeAnimation(moveToNextCard.bind(null, level));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const moveToNextCard = (level: ILevelData) => {
    if (displayDataStack.length > 0) {
      // Вызываем handleCardComplete при переходе к следующей карте
      handleCardComplete();

      setDisplayDataStack((prevState) => {
        const second = prevState[1];
        return [second, DisplayedCardItem.create(level, true, isSeveralLevels)];
      });
    }
  };

  /*ANIMATION*/
  const swipe = useRef(new Animated.ValueXY()).current;
  const [swipeDirection, setSwipeDirection] = useState(-1); //s Начинаем с направления влево (-1)
  const [isAnimationGoing, setIsAnimationGoing] = useState<boolean>(false);

  const triggerSwipeAnimation = (onEnd: () => void) => {
    Animated.timing(swipe, {
      toValue: { x: swipeDirection * 500, y: 0 },
      useNativeDriver: true,
      duration: 500,
    }).start(() => {
      onAnimationEnd(onEnd);
    });
    setIsAnimationGoing(true);
  };
  const onAnimationEnd = useCallback((onComplete: () => void) => {
    swipe.setValue({ x: 0, y: 0 });
    setSwipeDirection((prevDirection) => -prevDirection);
    setIsAnimationGoing(false);

    // Если была карта с сообщением о перемешивании, сбрасываем флаг
    if (displayDataStack[0]?.customText === t("levelCardsShuffled")) {
      setIsShuffling(false);
    }

    onComplete();
  }, []);

  const handleShufflePress = () => {
    setShuffleDialogVisible(true);
  };

  const handleShuffleLevel = async () => {
    if (selectedLevel && !isShuffling) {
      try {
        setIsShuffling(true);
        await shuffleLevel({ levelId: selectedLevel.ID, userId });

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

  const handleCardSwipe = () => {
    dispatch(incrementStats({ levelId: selectedLevel?.ID }));
    // остальная логика обработки свайпа
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
                  swipe={swipe}
                  onAnimationEnd={onAnimationEnd.bind(null, moveToNextCard.bind(null, selectedLevel))}
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
      <Fireworks visible={showFireworks} onAnimationFinish={handleFireworksFinish} />

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
  const [time] = useState(Date.now());
  const [question, setQuestion] = useState<IQuestion>();
  const [questionId, setQuestionId] = useState<string>();

  const { data: fetchedQuestion, isFetching: isFetchingQuestion } = useGetQuestionQuery(displayData.level?.ID ? {
    levelId: displayData.level.ID,
    clientId: userId,
    timestamp: time,
  } : { levelId: '', clientId: userId, timestamp: time }, { skip: !displayData.level?.ID });

  const { data: fetchedQuestion2, isFetching: isFetchingQuestion2 } = useGetQuestionQuery(displayData.level?.ID ? {
    levelId: displayData.level.ID,
    clientId: userId,
    timestamp: time,
  } : { levelId: '', clientId: userId, timestamp: time }, { skip: !displayData.level?.ID });

  useEffect(() => {
    // Используем первый успешно загруженный вопрос
    if (fetchedQuestion && !isFetchingQuestion) {
      setQuestion(fetchedQuestion);
      setQuestionId(fetchedQuestion.id);
    } else if (fetchedQuestion2 && !isFetchingQuestion2) {
      setQuestion(fetchedQuestion2);
      setQuestionId(fetchedQuestion2.id);
    }
  }, [fetchedQuestion, fetchedQuestion2, isFetchingQuestion, isFetchingQuestion2]);

  return children(question, isFetchingQuestion && isFetchingQuestion2, questionId);
}

const CardsStack = ({
  displayDataStack,
  swipe,
  onAnimationEnd,
  selectedLevel,
  userId,
}: {
  displayDataStack: DisplayedCardItem[];
  swipe: Animated.ValueXY;
  onAnimationEnd: () => void;
  selectedLevel: ILevelData;
  userId: string;
}) => {
  const panResponder = selectedLevel && getPanResponder(swipe, onAnimationEnd);

  return displayDataStack
    .map((displayData, i) => {
      const isFirst = i === 0;
      const actualHandlers = isFirst && panResponder ? panResponder.panHandlers : {};

      return (
        <SwipableCard key={displayData.id} swipe={swipe} allowDrag={isFirst} {...actualHandlers}>
          {displayData.shouldLoadQuestion ? (
            <WithLoadingQuestion displayData={displayData} userId={userId}>
              {(question, isFetchingQuestion, questionId) => (
                <QuestionCard
                  questionId={questionId}
                  displayData={displayData}
                  question={question}
                  isFetchingQuestion={isFetchingQuestion}
                />
              )}
            </WithLoadingQuestion>
          ) : (
            <QuestionCard displayData={displayData} />
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
