import React from "react";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { IDeck } from "@/services/types/types";
import { DeckInfo } from "@/entities/deck/ui/deck-info";
import { DeckLabelList } from "@/entities/deck/ui/deck-label-list";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import Svg, { Circle, Defs, Mask, Rect, SvgXml } from "react-native-svg";

export interface DeckItemProps {
  deck: IDeck;
  onInfoClick: () => void;
  onDismiss: () => void;
  onPress?: () => void;
}

export const DeckItem: React.FC<DeckItemProps> = ({ deck, onInfoClick }) => {
  const labels = deck.labels || [];
  const { svgData, isLoadingImage, error } = useFetchDeckSvg(deck.backgroundImageId || "");
  const isValidSvg = typeof svgData === "string" && svgData.trim().toLowerCase().startsWith("<svg");
  if (deck.backgroundImageId && deck.backgroundImageId !== null) {
    return (
      <TouchableOpacity style={styles.deckWithSvg} key={deck.id} onPress={onInfoClick}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <Mask id="cutoutMask">
              <Rect width="100%" height="100%" fill="white" />
              <Circle r="20" cx="95%" cy="5%" fill="white" />
            </Mask>
          </Defs>
          <Rect width="100%" height="100%" fill="white" mask="url(#cutoutMask)" />
          {isValidSvg ? (
            <SvgXml xml={svgData} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          ) : null}
        </Svg>
        
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.deck} key={deck.id} onPress={onInfoClick}>
      {/* {isLoadingImage && (
        <View style={styles.backgroundImageContainer}>
          <SvgXml xml={svgData} width="100%" height="100%" />
        </View>
      )} */}
      <View style={{ flexDirection: "column", margin: 12, flex: 1 }}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <DeckLabelList labels={labels} />
          {/* <DeckLikeButton deckId={deck.id} /> */}
        </View>
        <DeckInfo imageId={deck.imageId} title={deck.name} id={deck.id} handleOpenDeckInfo={onInfoClick} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deck: {
    flex: 1,
    position: "relative",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    height: 221,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    overflow: "hidden",
  },
  backgroundImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  deckWithSvg: {
    flex: 1,
    position: "relative",
    height: 221,
    borderRadius: 20,
    width: "100%",
    backgroundColor: "white",
    overflow: "hidden",
    marginTop: 20,
  },
  contentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
   
  },
  topContent: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
});
