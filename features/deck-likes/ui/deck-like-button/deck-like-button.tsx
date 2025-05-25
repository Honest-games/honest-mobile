import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@shared/lib/hooks/useRedux';
import { useUserId } from '@/features/hooks';
import { addDeckId, removeDeckId } from '@/features/deck-likes/model/slice';
import { useDislikeDeckMutation, useLikeDeckMutation } from '../../api/deck-likes-api';
import { Colors } from '@/shared/config';

interface DeckLikeButtonProps {
  deckId: string;
}

export const DeckLikeButton: React.FC<DeckLikeButtonProps> = ({ deckId }) => {
  const decksLikesSet = useAppSelector(state => state.decksLikes.decksLikesSet);
  const isLiked = decksLikesSet.has(deckId);

  const dispatch = useAppDispatch();
  const userId = useUserId();
  const [likeDeck] = useLikeDeckMutation();
  const [dislikeDeck] = useDislikeDeckMutation();
  
  const handleLike = async () => {
    try {
      if (decksLikesSet.has(deckId)) {
        await dislikeDeck({ deckId: deckId, userId });
        dispatch(removeDeckId(deckId));
      } else {
        await likeDeck({ deckId: deckId, userId });
        dispatch(addDeckId(deckId));
      }
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <TouchableOpacity style={styles.likes} onPress={handleLike}>
      <FontAwesome
        style={{
          marginLeft: 10,
          marginRight: 10
        }}
        name={isLiked ? 'heart' : 'heart-o'}
        size={16}
        color={Colors.lightRed}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    width: 40,
  }
}); 