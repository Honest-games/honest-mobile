import { LevelInfo } from "@/UI/LevelInfo";
import Colors from "@/constants/Colors";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import { useAppDispatch } from "@/features/hooks/useRedux";
import { useGetLevelsQuery } from "@/services/api";
import { IDeck, ILevelData } from "@/services/types/types";
import { FontAwesome } from "@expo/vector-icons";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Rect, SvgXml } from "react-native-svg";
import Loader from "./Loader";
import { getLevelsInfo } from "@/features/converters";
import { useTranslation } from "react-i18next";
import { Link } from "expo-router";
import { hideTooltip, showTooltip } from "@/store/reducer/levels-slice";
import DeckLevels from "./Decks/components/DeckLevels";
import { DeckInfoTopContent } from "./Decks/components";
interface CustomBottomSheetModalProps {
  deck: IDeck;
  userId: string;
}

export type Ref = BottomSheetModal;
const renderBackdrop = () => useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);
const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(({ deck, userId }, ref) => {
  const snapPoints = useMemo(() => ["77%"], []);

  const dismissModal = () => {
    if (ref && "current" in ref && ref.current) {
      ref.current.dismiss();
    }
  };
  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop()}
      backgroundStyle={styles.bottomSheetModal}
    >
      <BottomSheetView style={styles.modalWrapper}>
        <DeckInfoSheet deck={deck} userId={userId} onDismiss={dismissModal} />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

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

const DeckDescription = ({ deck, style }: { deck: IDeck; style?: ViewStyle }) => {
  const { svgData, isLoadingImage } = useFetchDeckSvg(deck?.image_id);
  return (
    <View style={[styles.commonInformation, style]}>
      {isLoadingImage ? (
        <Loader />
      ) : svgData ? (
        <View>
          <SvgXml xml={svgData} width={121} height={118} />
        </View>
      ) : (
        <Text>.</Text>
      )}
      <Text style={styles.deckTitle}>{deck.name.toLowerCase() || "Название колоды"}</Text>
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
    color: Colors.deepGray,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 17,
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
    borderRadius: 32,
  },
  modalWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    width: 178,
    backgroundColor: Colors.deepBlue,
    borderRadius: 24.5,
  },
});

export default CustomBottomSheetModal;
