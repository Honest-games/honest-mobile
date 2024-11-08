import { getLevelsInfo } from "@/features/converters";
import Loader from "@/modules/Loader";
import React, { useCallback, useRef, useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { DeckInfoTopContent, DeckOpenButton } from "..";
import { useGetLevelsQuery } from "@/services/api";
import { IDeck } from "@/services/types/types";
import { useAppDispatch } from "@/features/hooks/useRedux";
import { hideTooltip, showTooltip } from "@/store/reducer/levels-slice";

const DeckInfoSheet = ({ deck, userId, onDismiss }: { deck: IDeck; userId: string; onDismiss: () => void }) => {
  const { data: levels, isLoading, isError } = useGetLevelsQuery({ deckId: deck.id, time: useRef(Date.now()).current, clientId: userId });
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
      setTooltipContent(level.Description || "Описание недоступно");
      setTooltipVisible(true);

      dispatch(showTooltip({ levelId: level.ID, content: level.Description || "" }));

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
      <View style={{ flex: 1, marginBottom: 65, gap: 20, flexDirection: "column" }}>
        <DeckInfoTopContent levels={levels} deck={deck} />
        <DeckDescription deck={deck} />
        <LevelInfo levelInfo={levelInfo} />
        <DeckLevels
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
export default DeckInfoSheet