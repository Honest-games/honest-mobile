import { IDeck } from "@/services/types/types";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import DeckItem from "../../modules/DeckItem";
import ContentLoader, { Rect } from "react-content-loader/native";

interface DeckScrollViewProps {
  scrollRef: any;
  scrollHandler: any;
  filteredDecks: IDeck[] | undefined;
  decks: any;
  onSelectDeck: (deck: IDeck) => void;
  handleDismissSheet: () => void;
  isLoading: boolean;
}

const DeckScrollView: React.FC<DeckScrollViewProps> = ({
  scrollRef,
  scrollHandler,
  filteredDecks,
  decks,
  onSelectDeck,
  handleDismissSheet,
  isLoading,
}) => {

  const [showLoader, setShowLoader] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {[...Array(6)].map((_, index) => (
          <ContentLoader
            key={index}
            speed={2}
            width="100%"
            height={221}
            viewBox="0 0 400 221"
            backgroundColor="#d2d2d2"
            foregroundColor="#c0c0c0"
            style={styles.skeletonItem}
          >
            <Rect x="5" y="0" rx="20" ry="20" width="90%" height="221" />
          </ContentLoader>
        ))}
      </View>
    );
  }

  return (
    <Animated.ScrollView
      ref={scrollRef}
      onScroll={scrollHandler}
      contentContainerStyle={styles.scrollContainer}
      scrollEventThrottle={16}
    >
      {
        filteredDecks &&
        decks &&
        filteredDecks.map((deck: IDeck) => (
          <DeckItem
            key={deck.id}
            deck={deck}
            onInfoClick={() => onSelectDeck(deck)}
            onDismiss={handleDismissSheet}
          />
        ))
      }
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: Platform.OS === "ios" ? 75 : 100,
    margin: 20,
    paddingTop: 28,
  },
  skeletonContainer: {
    width: "100%",
  },
  skeletonItem: {
    marginBottom: 20,
    top: 90,
  },
});

export default DeckScrollView;
