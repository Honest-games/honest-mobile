import { View, Text, TouchableOpacity} from "react-native";
import styles from "./styles";
import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import { useUserId } from "@/features/hooks";
import { useDislikeDeckMutation, useLikeDeckMutation } from "@/services/api";
import { addDeckId, removeDeckId } from "@/store/reducer/deck-likes-slice";
import React from "react";
import { getLevelColor } from "@/features/converters/button-converters";
import { IDeck, ILevelData } from "@/services/types/types";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import DeckLikeButton from "@/UI/DeckLikeButton";

const DeckInfoTopContent = ({ deck, levels }: { deck: IDeck; levels: ILevelData[] }) => {
  const dispatch = useAppDispatch();
  const decksLikesSet = useAppSelector((state) => state.decksLikes.decksLikesSet);
  const userId = useUserId();
  const [likeDeck] = useLikeDeckMutation();
  const [dislikeDeck] = useDislikeDeckMutation();

  const isLiked = decksLikesSet.has(deck.id);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await dislikeDeck({ deckId: deck.id, userId });
        dispatch(removeDeckId(deck.id));
      } else {
        await likeDeck({ deckId: deck.id, userId });
        dispatch(addDeckId(deck.id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };
  return (
    <View style={[styles.topContent]}>
      <View>
        {levels.map((level) => {
          const all = level.counts.questionsCount;
          const opened = level.counts.openedQuestionsCount;
          const progressPercents = all > 0 ? (opened / all) * 100 : 0;
          return (
            <View key={level.ID} style={styles.deckProgress}>
              <View style={styles.progressBar}>
                <View
                  style={{
                    ...styles.progressColor,
                    backgroundColor: getLevelColor(level.ColorButton),
                    width: `${progressPercents}%`,
                  }}
                ></View>
              </View>
              <Text style={styles.progressText}>
                {opened} / {all}
              </Text>
            </View>
          );
        })}
      </View>
      <DeckLikeButton
        deckId={deck.id}
      />
 
    </View>
  );
};

export default DeckInfoTopContent;
