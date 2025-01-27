import SearchBar from "@/UI/SearchBar";
import { IDeck } from "@/services/types/types";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import DeckItem from "../../modules/DeckItem";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";

interface DeckScrollViewProps {
  scrollRef: any;
  onSearchSubmit: () => void;
  filteredDecks: IDeck[] | undefined;
  decks: any;
  onSelectDeck: (deck: IDeck) => void;
  handleDismissSheet: () => void;
  isLoading: boolean;
  onChangeInput: (text: string) => void;
  onSearchSubmit?: () => void;
}

const DeckScrollView: React.FC<DeckScrollViewProps> = ({
  scrollRef,
  filteredDecks,
  decks,
  onSelectDeck,
  handleDismissSheet,
  isLoading,
  onChangeInput,
  onSearchSubmit,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={{ paddingTop: 20 }}>
          {[...Array(6)].map((_, index) => (
            <View key={index} style={styles.skeletonWrapper}>
              <ContentLoader speed={2} width="100%" height={221} viewBox="0 0 400 221" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                <Rect x="12" y="12" rx="10" ry="24.5" width="100" height="0" />
                {/* <Rect x="12" y="44" rx="10" ry="24.5" width="80" height="24" />

                <Rect x="350" y="12" rx="10" ry="10" width="40" height="20" />

                <Circle cx="200" cy="110" r="35" />

                <Rect x="100" y="160" rx="4" ry="4" width="200" height="16" />
                <Rect x="157" y="185" rx="10" ry="10" width="86" height="32" /> */}
              </ContentLoader>
            </View>
          ))}
        </View>
      );
    }

    return filteredDecks?.map((deck: IDeck) => (
      <DeckItem key={deck.id} deck={deck} onInfoClick={() => onSelectDeck(deck)} onDismiss={handleDismissSheet} />
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer} scrollEventThrottle={16}>
        <View>
          <SearchBar onChangeInput={onChangeInput} onSearchSubmit={onSearchSubmit} />
        </View>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 75 : 100,
  },
  skeletonWrapper: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 221,
    marginBottom: 20,
    overflow: "hidden",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 12,
  },
});

export default DeckScrollView;
