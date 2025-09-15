import { TakeFirstCard } from "@/entities/question/ui";
import { IDisplayedCard, createDisplayedCard } from "@/entities/card/ui";
import { useDeck, useDeckId, useUserId } from "@/features/hooks";
import { useDeckState } from "@/features/deck-management";
import { useSwipeAnimation } from "@/features/animations/hooks";
import { useDialogState } from "@/features/dialog-management";
import { CardStackManager } from "@/widgets/card-stack";
import { LevelButtons } from "@/widgets/level-list";
import { useGetLevelsQuery, useShuffleLevelMutation } from "@/entities/level";
import { useShuffleDeckMutation } from "@/entities/deck";
import { IDeck, ILevelData, IAchievement } from "@/services/types/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useCallback, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
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
import { usePerformanceMonitor } from "@shared/hooks";

const { width } = Dimensions.get("window");

const DeckId: React.FC = () => {
  const { id: deckId } = useLocalSearchParams();

  const userId = useUserId();
  const { decks } = useDeck(userId, { skip: !userId });

  const [selectedDeck, setSelectedDeck] = useState<IDeck>();

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

const OpenedDeck = React.memo<{ deck: IDeck; userId: string }>(({ deck, userId }) => {
  const { data: levels } = useGetLevelsQuery({ deckId: deck.id, clientId: userId });
  if (!levels) {
    return <Loader />;
  } else {
    return <OpenedDeckWithLevels deck={deck} levels={levels} userId={userId} />;
  }
});

const OpenedDeckWithLevels = React.memo<{ deck: IDeck; levels: ILevelData[]; userId: string }>(({ deck: selectedDeck, levels, userId }) => {
  usePerformanceMonitor('DeckDetailScreen');
  const { t } = useTranslation();
  const isSeveralLevels = levels.length > 1;
  const { goBack } = useDeckId();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  // Custom hooks for state management
  const deckState = useDeckState();
  const dialogState = useDialogState();
  const swipeAnimation = useSwipeAnimation({ duration: 500, swipeDistance: 500 });

  // Mutations
  const [shuffleDeck] = useShuffleDeckMutation();
  const [shuffleLevel] = useShuffleLevelMutation();

  // Achievement handling
  useEffect(() => {
    if (profile.lastUnlockedAchievement) {
      const achievement = profile.achievements.find((a: any) => a.id === profile.lastUnlockedAchievement);
      if (achievement) {
        dialogState.showAchievementModalAction(achievement as IAchievement);
      }
    }
  }, [profile.lastUnlockedAchievement, dialogState.showAchievementModalAction]);

  // Core functions
  const handleCardComplete = useCallback(() => {
    if (deckState.selectedLevel?.id) {
      dispatch(incrementStats({ levelId: deckState.selectedLevel.id }));
    }
  }, [deckState.selectedLevel, dispatch]);

  const moveToNextCard = useCallback(
    (level: ILevelData) => {
      console.log('deckState.displayDataStack', deckState.displayDataStack);
      if (deckState.displayDataStack.length > 0) {
        console.log("moveToNextCard", level);
        handleCardComplete();
        deckState.moveToNextCard(level);
      }
    },
    [deckState, handleCardComplete],
  );

  const moveToNextCardAfterShuffle = useCallback(() => {
    if (deckState.displayDataStack.length > 1) {
      deckState.removeFromStack(0);
    }
  }, [deckState]);

  // Event handlers
  const handleFireworksFinish = useCallback(() => {
    dialogState.hideFireworks();
  }, [dialogState]);

  const handleAchievementModalClose = useCallback(() => {
    dialogState.hideAchievementModal();
    dispatch(clearLastUnlockedAchievement());
  }, [dialogState, dispatch]);

  const handleResumeDialogClose = useCallback(() => {
    dialogState.hideResumeDialog();
  }, [dialogState]);

  const handleShufflePress = useCallback(() => {
    dialogState.showShuffleDialogAction();
  }, [dialogState]);

  const handleShuffleDeck = useCallback(async () => {
    try {
      await shuffleDeck({ deckId: selectedDeck.id, userId });

      if (deckState.displayDataStack.length === 0 || !deckState.selectedLevel) {
        const shuffleCard = createDisplayedCard(null, false, false, false, t("allLevelsShuffled"));
        deckState.setDisplayStack([shuffleCard]);
      } else {
        const newStack: IDisplayedCard[] = [
          deckState.displayDataStack[0],
          createDisplayedCard(null, false, false, deckState.selectedLevel !== undefined, t("allLevelsShuffled")),
          ...(deckState.selectedLevel ? [createDisplayedCard(deckState.selectedLevel, true, isSeveralLevels)] : []),
        ];
        deckState.setDisplayStack(newStack);

        swipeAnimation.triggerSwipeAnimation(-1, () => {
          moveToNextCardAfterShuffle();
        });
      }
    } catch (error) {
      console.error("Error shuffling deck:", error);
    }
    dialogState.hideShuffleDialog();
  }, [shuffleDeck, selectedDeck, userId, deckState, t, isSeveralLevels, swipeAnimation, moveToNextCardAfterShuffle, dialogState]);

  const handleShuffleLevel = useCallback(async () => {
    if (deckState.selectedLevel && !deckState.isShuffling) {
      try {
        deckState.setIsShuffling(true);
        await shuffleLevel({ levelId: deckState.selectedLevel.id, userId });

        deckState.createShuffleCards(deckState.selectedLevel, t("levelCardsShuffled"), isSeveralLevels);

        swipeAnimation.triggerSwipeAnimation(-1, () => {
          moveToNextCardAfterShuffle();
        });
      } catch (error) {
        console.error("Error shuffling level:", error);
        deckState.setIsShuffling(false);
      }
    }
    dialogState.hideShuffleDialog();
  }, [deckState, shuffleLevel, userId, t, isSeveralLevels, swipeAnimation, moveToNextCardAfterShuffle, dialogState]);

  const handleStartOver = useCallback(async () => {
    try {
      await handleShuffleDeck();
      const firstLevel = levels[0];
      deckState.createInitialCards(firstLevel, isSeveralLevels);
    } catch (error) {
      console.error("Error shuffling deck:", error);
    }
    dialogState.hideResumeDialog();
  }, [handleShuffleDeck, levels, isSeveralLevels, deckState, dialogState]);

  const onButtonPress = useCallback(
    async (level: ILevelData) => {
      if (swipeAnimation.isAnimating.value) return;

      if (!deckState.selectedLevel) {
        deckState.createInitialCards(level, isSeveralLevels);
      } else {
        if (deckState.selectedLevel.id === level.id) {
          deckState.updateSecondCardQuestionLoading();
          console.log(123)
        } else {
          console.log(456)
          const newCard = createDisplayedCard(level, true, isSeveralLevels);
          const updatedStack: IDisplayedCard[] = [deckState.displayDataStack[0], newCard];
          deckState.setDisplayStack(updatedStack);
          deckState.setSelectedLevel(level);
        }
        swipeAnimation.triggerSwipeAnimation(-1, () => moveToNextCard(level));
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [swipeAnimation, deckState, isSeveralLevels, moveToNextCard],
  );

  // Watch for user swipe completion
  useEffect(() => {
    if (deckState.userSwiped && deckState.selectedLevel) {
      deckState.setUserSwiped(false);
      try {
        moveToNextCard(deckState.selectedLevel);
      } catch (error) {
        console.error("Move to next card error:", error);
      }
    }
  }, [deckState.userSwiped, deckState.selectedLevel, moveToNextCard, deckState]);

  return (
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
              {deckState.displayDataStack.length > 0 && deckState.selectedLevel ? (
                <CardStackManager
                  userId={userId}
                  displayDataStack={deckState.displayDataStack}
                  swipeX={swipeAnimation.swipeX}
                  swipeY={swipeAnimation.swipeY}
                  setUserSwiped={deckState.setUserSwiped}
                  selectedLevel={deckState.selectedLevel}
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
        visible={dialogState.isShuffleDialogVisible}
        onClose={dialogState.hideShuffleDialog}
        onShuffleLevel={handleShuffleLevel}
        onShuffleDeck={handleShuffleDeck}
        isShuffleLevelDisabled={!deckState.selectedLevel || deckState.isShuffling}
        isSingleLevel={levels.length === 1}
      />
      <ResumeDeckDialog visible={dialogState.isResumeDialogVisible} onClose={handleResumeDialogClose} onStartOver={handleStartOver} />

      <AchievementModal
        achievement={dialogState.unlockedAchievement}
        visible={dialogState.showAchievementModal}
        onClose={handleAchievementModalClose}
        showFireworks={dialogState.showFireworks}
        onFireworksFinish={handleFireworksFinish}
      />
    </SafeAreaView>
  );
});

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
