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
const { width } = Dimensions.get("window");

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

const searchBarStyle = (scrollY: SharedValue<number>) =>
  useAnimatedStyle(() => {
    const searchBarWidth = interpolate(scrollY.value, [0, 20], [width - 42, 70], Extrapolate.CLAMP);

    const shadowOpacity = interpolate(scrollY.value, [0, 100], [0, 0.25], Extrapolate.CLAMP);

    const shadowOffset = interpolate(scrollY.value, [0, 100], [0, 4], Extrapolate.CLAMP);

    return {
      width: withTiming(searchBarWidth, { duration: 800 }),
      shadowColor: "#000000",
      // shadowOffset: withTiming({ width: 0, height: 4 }, { duration: 500 }),
      shadowRadius: 4,
      shadowOpacity: withTiming(shadowOpacity, { duration: 1000 }),
      elevation: 5,
    };
  });
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
  // const userId = useUserId();
  const dispatch = useAppDispatch();
  // const decks = useAppSelector((state) => state.cardsOfDecks.decks); // Из Redux

  const { decks, isLoadingDecks, isFetchingDecks, refetch: refetchDecks } = useDeck(userId);

  const { changeLanguage } = useLanguage();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const fadeAnimation = useSharedValue(0); // состояние для анимации появления контента

  const [searchText, setSearchText] = useState("");
  const [selectedDeck, setSelectedDeck] = useState<IDeck>();
  const [tapOnDeck, setTapOnDeck] = useState<boolean>();
  const [filteredDecks, setFilteredDecks] = useState<IDeck[]>([]);
  const [sendPromo] = useSendPromoMutation();

  useEffect(() => {
    if (decks) {
      setFilteredDecks(filterDecks(decks, searchText));
    }
  }, [decks, searchText]);

  const { data: likes, isFetching: isFetchingLikes } = useGetAllLikesQuery(userId);

  useEffect(() => {
    if (likes) {
      if (likes.decks) dispatch(setDecksLikesSet(likes.decks));
      if (likes.questions) dispatch(setQuestionsLikesSet(likes.questions));
    }
  }, [likes]);

  useEffect(() => {
    fadeAnimation.value = withTiming(1, {
      duration: 10000,
      easing: Easing.out(Easing.exp),
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
    transform: [
      {
        translateY: interpolate(fadeAnimation.value, [0, 1], [20, 0], Extrapolate.CLAMP),
      },
    ],
  }));
  /*END ANIMATION*/

  const onSelectDeck = (deck: IDeck) => {
    setTapOnDeck(true);
    setSelectedDeck(deck);
  };

  const onSearchSubmit = () => {
    if (scrollY.value === 0) {
      sendPromo({ promo: searchText, userId });
      handleScrollToTop();
      refetchDecks();
    } else {
      scrollToTop(scrollRef);
    }
  };

  useEffect(() => {
    if (selectedDeck || tapOnDeck) {
      bottomSheetRef?.current?.present();
      setTapOnDeck(false);
    }
  }, [selectedDeck, tapOnDeck]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ position: "relative", flex: 1, width: '100%', top: 20 }}>
        <SearchBar searchBarStyle={searchBarStyle(scrollY)} onChangeInput={setSearchText} onSearchSubmit={onSearchSubmit} />
        <Animated.View style={[contentStyle, { flex: 1}]}>
          <DeckScrollView
            scrollRef={scrollRef}
            scrollHandler={scrollHandler}
            filteredDecks={filteredDecks}
            onSelectDeck={onSelectDeck}
            handleDismissSheet={() => bottomSheetRef.current?.dismiss()}
            decks={decks}
            isLoading={isLoadingDecks || isFetchingDecks || isFetchingLikes}
          />
        </Animated.View>
      </View>

      {selectedDeck && <CustomBottomSheetModal deck={selectedDeck} ref={bottomSheetRef} userId={userId} />}
    </SafeAreaView>
  );
};
export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
