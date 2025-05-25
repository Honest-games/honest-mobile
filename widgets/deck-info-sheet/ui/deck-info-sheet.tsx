import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { TouchableWithoutFeedback } from "@gorhom/bottom-sheet";
import { IDeck, ILevelData } from "@/services/types/types";
import { useGetLevelsQuery } from "@/services/api";
import { getLevelsInfo } from "@/features/converters";
import { useAppDispatch } from "@/features/hooks/useRedux";
import { hideTooltip, showTooltip } from "@/entities/level/model/slice";
import { LevelInfo } from "@/entities/level/ui";
import { Loader } from "@/shared/ui/loader";
import { DeckOpenButton } from "@/widgets/deck-info-sheet/ui/deck-open-button";
import { DeckDescription } from "@/widgets/deck-info-sheet/ui/deck-description";
import { DeckInfoTopContent } from "@/widgets/deck-content/ui/deck-top-content";
import { DeckWithLevels } from "@/widgets/deck-with-levels";

interface DeckInfoSheetProps {
  deck: IDeck;
  userId: string;
  onDismiss: () => void;
}

export const DeckInfoSheet: React.FC<DeckInfoSheetProps> = ({ deck, userId, onDismiss }) => {
  const { data: levels, isLoading } = useGetLevelsQuery({ deckId: deck.id, time: useRef(Date.now()).current, clientId: userId });
  const levelInfo = getLevelsInfo(levels?.length ?? 0);
  const dispatch = useAppDispatch();
  
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleButtonPress = useCallback(
    (level: ILevelData) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setSelectedLevelId(level.ID);
      setTooltipContent(level.description || "Описание недоступно");
      setTooltipVisible(true);

      dispatch(showTooltip({ levelId: level.ID, content: level.description || "" }));

      timerRef.current = setTimeout(() => {
        setTooltipVisible(false);
        setSelectedLevelId(null);
        dispatch(hideTooltip());
        timerRef.current = null;
      }, 3000);
    },
    [dispatch],
  );

  const handleCloseTooltip = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setTooltipVisible(false);
    setSelectedLevelId(null);
    dispatch(hideTooltip());
  }, [dispatch]);

  if (isLoading || !levels) {
    return <Loader />;
  }

  return (
    <TouchableWithoutFeedback onPress={handleCloseTooltip}>
      <View style={{gap: 20, marginBottom: 20}}>
        <DeckInfoTopContent levels={levels} deck={deck} />
        <DeckDescription deck={deck} />
        <LevelInfo levelInfo={levelInfo} />
        <DeckWithLevels
          levels={levels}
          onButtonPress={handleButtonPress}
          size="small"
          selectedLevelId={selectedLevelId}
          tooltipContent={tooltipContent}
          tooltipVisible={tooltipVisible}
          onCloseTooltip={handleCloseTooltip}
        />
        <DeckOpenButton id={deck.id} onDismiss={onDismiss} />
      </View>
    </TouchableWithoutFeedback>
  );
}; 