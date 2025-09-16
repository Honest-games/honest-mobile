import { View, Text } from "react-native";
import styles from "./styles";
import React, { useMemo } from "react";
import { getLevelColor } from "@/features/converters/button-converters";
import { IDeck } from "@/services/types/types";
import { ILevelData } from "@/entities/level";
import { DeckLikeButton } from "@/features/deck-likes/ui/deck-like-button";
import { useProfile } from "@shared/config/_providers/ProfileProvider";

interface DeckInfoTopContentProps {
  deck: IDeck;
  levels: ILevelData[];
}

export const DeckInfoTopContent: React.FC<DeckInfoTopContentProps> = ({ deck, levels }) => {
  const { profile } = useProfile();

  const levelProgress = useMemo(() => {
    return levels.map((level) => {
      const all = level.counts.questionsCount;
      const levelStats = profile.stats.levelStats[level.id];
      
      // Используем максимальное значение между API данными и пользовательской статистикой
      const apiOpened = level.counts.openedQuestionsCount || 0;
      const userAnswered = levelStats ? levelStats.questionsAnswered : 0;
      const opened = Math.max(apiOpened, userAnswered);
      
      const progressPercents = all > 0 ? (opened / all) * 100 : 0;
      
      return {
        id: level.id,
        color: level.color,
        opened: Math.min(opened, all),
        all,
        progressPercents: Math.min(progressPercents, 100)
      };
    });
  }, [levels, profile.stats.levelStats]);

  return (
    <View style={[styles.topContent]}>
      <View>
        {levelProgress.map((level) => (
          <View key={level.id} style={styles.deckProgress}>
            <View style={styles.progressBar}>
              <View
                style={{
                  ...styles.progressColor,
                  backgroundColor: getLevelColor(level.color),
                  width: `${level.progressPercents}%`,
                }}
              ></View>
            </View>
            <Text style={styles.progressText}>
              {level.opened} / {level.all}
            </Text>
          </View>
        ))}
      </View>
      <DeckLikeButton
        deckId={deck.id}
      />
    </View>
  );
};

export default DeckInfoTopContent;
