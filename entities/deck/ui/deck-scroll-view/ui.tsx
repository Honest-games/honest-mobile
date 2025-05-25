import { SearchBar } from '@shared/ui';
import { IDeck } from '@entities/deck/model/types';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View, Keyboard } from 'react-native';
import Animated, { AnimatedRef } from 'react-native-reanimated';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { DeckItem } from '@/widgets/deck-list/ui';

interface DeckScrollViewProps {
  onSearchSubmit: () => void;
  scrollRef: AnimatedRef<Animated.ScrollView>;
  filteredDecks: IDeck[];
  onSelectDeck: (deck: IDeck) => void;
  handleDismissSheet: () => void;
  decks: IDeck[];
  isLoading: boolean;
  onChangeInput: (text: string) => void;
  searchValue: string;
}

export const DeckScrollView: React.FC<DeckScrollViewProps> = ({
  onSearchSubmit,
  scrollRef,
  filteredDecks,
  onSelectDeck,
  handleDismissSheet,
  decks,
  isLoading,
  onChangeInput,
  searchValue
}) => {
  const handleScroll = () => {
    Keyboard.dismiss();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={{ paddingTop: 20 }}>
          {[...Array(6)].map((_, index) => (
            <View key={index} style={styles.skeletonWrapper}>
              <ContentLoader speed={2} width="100%" height={221} viewBox="0 0 400 221" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
                <Rect x="12" y="12" rx="10" ry="24.5" width="100" height="0" />
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
      <ScrollView 
        ref={scrollRef} 
        contentContainerStyle={styles.scrollContainer} 
        scrollEventThrottle={16}
        onScrollBeginDrag={handleScroll}
        keyboardShouldPersistTaps="never"
      >
        <View>
          <SearchBar
            onChangeInput={onChangeInput}
            onSearchSubmit={onSearchSubmit}
            value={searchValue}
          />
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
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 75 : 100,
  },
  skeletonWrapper: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 221,
    marginBottom: 20,
    overflow: 'hidden',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
}); 