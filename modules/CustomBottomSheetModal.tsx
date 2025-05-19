import { LevelInfo } from "@/UI/LevelInfo";
import Colors from "@/constants/Colors";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import { useAppDispatch } from "@/features/hooks/useRedux";
import { useGetLevelsQuery } from "@/services/api";
import { IDeck, ILevelData } from "@/services/types/types";
import { FontAwesome } from "@expo/vector-icons";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Rect, SvgXml } from "react-native-svg";
import Loader from "./Loader";
import { getLevelsInfo } from "@/features/converters";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { hideTooltip, showTooltip } from "@/store/reducer/levels-slice";
import DeckLevels from "./Decks/components/DeckLevels";
import { DeckInfoTopContent } from "./Decks/components";
import DynamicSizeBottomSheet from "../components/DynamicSizeBottomSheet";
import { BottomSheetModal, TouchableWithoutFeedback, useBottomSheetTimingConfigs } from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";

interface CustomBottomSheetModalProps {
  deck: IDeck;
  userId: string;
}

export type Ref = BottomSheetModal;

const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(({ deck, userId }, ref) => {
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
  const { data: levels, isLoading } = useGetLevelsQuery({ deckId: deck.id, time: useRef(Date.now()).current, clientId: userId });
  const levelInfo = getLevelsInfo(levels?.length ?? 0);
  const dispatch = useAppDispatch();
  console.log("deck", deck);
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

const DeckDescription = ({ deck, style }: { deck: IDeck; style?: ViewStyle }) => {
  return (
    <View style={[styles.commonInformation, style]}>
      <Text style={styles.deckTitle}>{deck.name.toUpperCase() || "Название колоды"}</Text>
      <Text style={styles.deckDescription}>{deck.description.toLowerCase() || "описание колоды"}</Text>
    </View>
  );
};

const DeckOpenButton = ({ id, style, onDismiss }: { id: string | number; style?: ViewStyle; onDismiss: () => void }) => {
  const { t } = useTranslation();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Link href={`/decks/${id}`} asChild>
        <TouchableOpacity style={styles.button} onPress={onDismiss}>
          <Text style={{ color: "white", fontSize: 24, marginBottom: 5 }}>{t("play")}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  commonInformation: {
    // marginTop: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  deckTitle: {
    fontFamily: "MakanHatiCyrillic",
    color: Colors.deepGreen,
    fontSize: 50,
    marginTop: 17,
    textAlign: "center",
  },

  deckDescription: {
    width: "90%",
    color: Colors.grey1,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 33,
  },

  bottomSheetModal: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalWrapper: {
    gap: 20,
    paddingHorizontal: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    width: 178,
    backgroundColor: Colors.deepGreen,
    borderRadius: 12,
  },
});

export default CustomBottomSheetModal;
