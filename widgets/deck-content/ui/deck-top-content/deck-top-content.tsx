import { View, Text } from "react-native";
import styles from "./styles";
import React from "react";
import { getLevelColor } from "@/features/converters/button-converters";
import { IDeck, ILevelData } from "@/services/types/types";
import { DeckLikeButton } from "@/features/deck-likes/ui/deck-like-button";

interface DeckInfoTopContentProps {
  deck: IDeck;
  levels: ILevelData[];
}

export const DeckInfoTopContent: React.FC<DeckInfoTopContentProps> = ({ deck, levels }) => {
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
