import { useAppDispatch } from "@/features/hooks/useRedux";
import { useGetLevelsQuery, ILevelData } from "@/entities/level";
import { IDeck } from "@/services/types/types";
import React, { forwardRef, useCallback, useRef, useState } from "react";
import { Text, TouchableOpacity, View, ViewStyle, Dimensions, StyleSheet } from "react-native";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import Svg, { SvgXml } from "react-native-svg";

import { getLevelsInfo } from "@/features/converters";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { BottomSheetModal, TouchableWithoutFeedback, useBottomSheetTimingConfigs } from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";
import { hideTooltip, showTooltip } from "@/entities/level/model/slice";
import { LevelInfo } from "@/entities/level/ui";
import { DeckWithLevels } from "@/widgets/deck-with-levels";
import styles from "./styles";
import { Loader } from "@/shared/ui/loader";
import { DeckInfoTopContent } from "@/widgets/deck-content";
import { DynamicSizeBottomSheet } from "@/shared/ui/bottom-sheet";
import { Colors } from "@/shared/config";

interface CustomBottomSheetModalProps {
  deck: IDeck;
  userId: string;
}

export type Ref = BottomSheetModal;

export const DeckBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(({ deck, userId }, ref) => {
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  });

  if (!deck) {
    return (
      <DynamicSizeBottomSheet ref={ref} backgroundStyle={styles.bottomSheetModal} enableScroll={false} animationConfigs={animationConfigs}>
        <Loader />
      </DynamicSizeBottomSheet>
    );
  }

  return (
    <DynamicSizeBottomSheet ref={ref} enableScroll={true} backgroundStyle={styles.bottomSheetModal} animationConfigs={animationConfigs}>
      <View style={styles.modalWrapper}>
        <DeckInfoSheet
          deck={deck}
          userId={userId}
          onDismiss={() => {
            if (ref && "current" in ref && ref.current) {
              ref.current.dismiss();
            }
          }}
        />
      </View>
    </DynamicSizeBottomSheet>
  );
});

const DeckInfoSheet = ({ deck, userId, onDismiss }: { deck: IDeck; userId: string; onDismiss: () => void }) => {
  const { data: levels, isLoading } = useGetLevelsQuery({ deckId: deck.id, clientId: userId });
  const levelInfo = getLevelsInfo(levels?.length ?? 0);
  const dispatch = useAppDispatch();
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { svgData, isLoadingImage } = useFetchDeckSvg(deck.modalImageId || "");
  const isValidSvg = typeof svgData === "string" && svgData.trim().toLowerCase().startsWith("<svg");
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const handleButtonPress = useCallback(
    (level: ILevelData) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setSelectedLevelId(level.id);
      setTooltipContent(level.description || "Описание недоступно");
      setTooltipVisible(true);

      dispatch(showTooltip({ levelId: level.id, content: level.description || "" }));
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
      <View style={{ position: "relative", gap: 20, marginBottom: 20 }}>
        <View style={deck.modalImageId && isValidSvg && svgData && !isLoadingImage ? styles.contentOverlay : { gap: 20 }}>
          {deck.modalImageId && isValidSvg && svgData && !isLoadingImage && (
            <View style={styles.backgroundImageContainer}>
              <Svg width={screenWidth} height={screenHeight * 0.8} style={StyleSheet.absoluteFillObject}>
                <SvgXml xml={svgData} width={screenWidth} height={screenHeight * 0.5} preserveAspectRatio="xMidYMid slice" opacity={0.2} />
              </Svg>
            </View>
          )}
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
          <DeckOpenButton deck={deck} onDismiss={onDismiss} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const DeckDescription = ({ deck, style }: { deck: IDeck; style?: ViewStyle }) => {
  return (
    <View style={[styles.commonInformation, style]}>
      <Text
        style={{
          fontFamily: "MakanHatiCyrillic",
          color: deck.color || Colors.deepGreen,
          fontSize: 50,
          marginTop: 17,
          textAlign: "center",
        }}
      >
        {deck?.name || "Название колоды"}
      </Text>
      <Text style={styles.deckDescription}>{deck?.description || "описание колоды"}</Text>
    </View>
  );
};

const DeckOpenButton = ({ deck, style, onDismiss }: { deck: IDeck; style?: ViewStyle; onDismiss: () => void }) => {
  const { t } = useTranslation();
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Link href={`/decks/${deck.id}`} asChild>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 46,
            paddingHorizontal: 84,
            borderRadius: 16,
            backgroundColor: deck.color,
          }}
          onPress={onDismiss}
        >
          <Text style={{ color: "white", fontSize: 24, marginBottom: 5 }}>{t("play")}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
