import DeckScrollView from "@/components/deck/DeckScrollView";
import { getLevelsInfo } from "@/features/converters";
import { useDeck, useUserId } from "@/features/hooks";
import useLanguage from "@/features/hooks/useLanguage";
import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import CustomBottomSheetModal from "@/modules/CustomBottomSheetModal";
import Loader from "@/modules/Loader";
import { useGetAllLikesQuery, useSendPromoMutation } from "@/services/api";
import { IDeck } from "@/services/types/types";
import { setDecksLikesSet } from "@/store/reducer/deck-likes-slice";

import SearchBar from "@/UI/SearchBar";
import Switcher from "@/UI/Switcher";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { setQuestionsLikesSet } from "@/store/reducer/question-like-slice";

const WithUserId = ({ children }: { children: (userId: string) => React.ReactNode }) => {
  const userId = useUserId();
  if (!userId) {
    return null;
  } else {
    return children(userId);
  }
};

const Page = () => {
  return <WithUserId>{(userId) => <PageWithUserId userId={userId} />}</WithUserId>;
};

const filterDecks = (decks: IDeck[], search: string) => {
  return decks.filter((d) => {
    return d.name.toLowerCase().includes(search.toLowerCase()) || d.promo.toLowerCase().includes(search.toLowerCase());
  });
};

// const switcherStyle = (scrollY: SharedValue<number>) =>
//   useAnimatedStyle(() => {
//     const scrollOffset = interpolate(scrollY.value, [0, 10], [0, 150], Extrapolate.CLAMP);

//     const opacity = interpolate(scrollY.value, [0, 10], [1, 0], Extrapolate.CLAMP);
//     return {
//       transform: [{ translateX: withTiming(scrollOffset, { duration: 600 }) }],
//       opacity: withTiming(opacity, { duration: 600 }),
//     };
//   });

const PageWithUserId = ({ userId }: { userId: string }) => {
  const dispatch = useAppDispatch();
  const { decks, isLoadingDecks, isFetchingDecks, refetch: refetchDecks } = useDeck(userId);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const fadeAnimation = useSharedValue(0);
  const animationOpacity = useSharedValue(0);
  const [searchText, setSearchText] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<IDeck>();
  const [tapOnDeck, setTapOnDeck] = useState<boolean>();
  const [filteredDecks, setFilteredDecks] = useState<IDeck[]>([]);
  const [sendPromo] = useSendPromoMutation();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (decks) {
      setFilteredDecks(filterDecks(decks, searchText));
    }
  }, [decks, searchText]);

  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
    
    // Очищаем предыдущий таймаут
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Устанавливаем новый таймаут
    searchTimeoutRef.current = setTimeout(() => {
      if (text) {
        sendPromo({ promo: text, userId });
        refetchDecks();
      }
    }, 2000);
  }, [userId, sendPromo, refetchDecks]);

  // Очищаем таймаут при размонтировании компонента
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const { data: likes, isFetching: isFetchingLikes } = useGetAllLikesQuery(userId);

  useEffect(() => {
    if (likes) {
      if (likes.decks) dispatch(setDecksLikesSet(likes.decks));
      if (likes.questions) dispatch(setQuestionsLikesSet(likes.questions));
    }
  }, [likes]);

  useEffect(() => {
    fadeAnimation.value = withTiming(1, {
      duration: 3000,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  useEffect(() => {
    animationOpacity.value = withTiming(1, {
      duration: 2000,
      // easing: Easing.out(Easing.exp),
    });
  }, []);

  /*ANIMATION*/
  const scrollToTop = (scrollRef: any) => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleScrollToTop = () => {
    scrollToTop(scrollRef);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const contentStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
    // transform: [
    //   {
    //     translateY: interpolate(fadeAnimation.value, [0, 1], [20, 0], Extrapolate.CLAMP),
    //   },
    // ],
  }));

  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: animationOpacity.value,
    };
  });
  /*END ANIMATION*/

  const onSelectDeck = (deck: IDeck) => {
    setTapOnDeck(true);
    setSelectedDeck(deck);
  };

  useEffect(() => {
    if (selectedDeck || tapOnDeck) {
      bottomSheetRef?.current?.present();
      setTapOnDeck(false);
    }
  }, [selectedDeck, tapOnDeck]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[animatedOpacity, { flex: 1 }]}>
        <DeckScrollView
          onSearchSubmit={() => {
            if (searchText) {
              sendPromo({ promo: searchText, userId });
              refetchDecks();
            }
            handleScrollToTop();
          }}
          scrollRef={scrollRef}
          filteredDecks={filteredDecks}
          onSelectDeck={onSelectDeck}
          handleDismissSheet={() => bottomSheetRef.current?.dismiss()}
          decks={decks}
          isLoading={isLoadingDecks || isFetchingDecks || isFetchingLikes}
          onChangeInput={handleSearchTextChange}
          searchValue={searchText}
        />
      </Animated.View>

      {selectedDeck && <CustomBottomSheetModal deck={selectedDeck} ref={bottomSheetRef} userId={userId} />}
    </SafeAreaView>
  );
};
export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? -35 : 0,
    width: "100%",
  },
  switcherContainer: {
    flex: 1,
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 25,
  },
});
