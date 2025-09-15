import React, { useCallback, useMemo } from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, ListRenderItem } from 'react-native';
import { usePerformanceMonitor } from '@shared/hooks';

// Popular emojis for better UX
const POPULAR_EMOJIS = [
  '😊', '😂', '🥰', '😍', '🤗', '😎', '🤔', '😇', '🙃', '😉',
  '😆', '😅', '🤣', '😋', '😌', '🥳', '🤩', '🥺', '😴', '🤤',
  '🤯', '🤠', '🥴', '😈', '👻', '🤖', '👑', '💎', '🔥', '⭐',
  '💫', '✨', '💥', '💫', '🌟', '⚡', '💯', '👍', '👌', '✌️',
  '🤞', '🤟', '🤘', '👊', '✊', '🙌', '👏', '🤝', '🙏', '💪'
];

interface EmojiItem {
  emoji: string;
  index: number;
}

interface VirtualizedEmojiListProps {
  onEmojiSelect: (emoji: string) => void;
  numColumns?: number;
}

// Simplified emoji item component - no animations for maximum performance
const EmojiItemComponent = React.memo<{
  item: EmojiItem;
  onPress: (emoji: string) => void;
}>(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item.emoji);
  }, [item.emoji, onPress]);

  return (
    <TouchableOpacity
      style={styles.emojiItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.emojiText}>{item.emoji}</Text>
    </TouchableOpacity>
  );
});

EmojiItemComponent.displayName = 'EmojiItemComponent';

export const VirtualizedEmojiList = React.memo<VirtualizedEmojiListProps>(({
  onEmojiSelect,
  numColumns = 5
}) => {
  usePerformanceMonitor('VirtualizedEmojiList');

  // Memoize emoji data to prevent re-creation
  const emojiData = useMemo(() =>
    POPULAR_EMOJIS.map((emoji, index) => ({ emoji, index })),
    []
  );

  // Optimized render item function
  const renderItem: ListRenderItem<EmojiItem> = useCallback(({ item }) => (
    <EmojiItemComponent item={item} onPress={onEmojiSelect} />
  ), [onEmojiSelect]);

  // Memoized key extractor
  const keyExtractor = useCallback((item: EmojiItem) =>
    `emoji-${item.index}-${item.emoji}`,
    []
  );

  // Optimized getItemLayout for better performance
  const getItemLayout = useCallback((data: ArrayLike<EmojiItem> | null | undefined, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * Math.floor(index / numColumns),
    index,
  }), [numColumns]);

  return (
    <FlatList
      data={emojiData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      getItemLayout={getItemLayout}
      bounces={false}
      scrollEventThrottle={32}
    />
  );
});

VirtualizedEmojiList.displayName = 'VirtualizedEmojiList';

const ITEM_HEIGHT = 50;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  emojiItem: {
    flex: 1,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  emojiText: {
    fontSize: 28,
    textAlign: 'center',
  },
});