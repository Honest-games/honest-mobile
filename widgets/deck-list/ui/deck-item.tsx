import React from "react";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { IDeck } from "@/services/types/types";
import { DeckInfo } from "@/entities/deck/ui/deck-info";
import { DeckLabelList } from "@/entities/deck/ui/deck-label-list";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import Svg, { Defs, SvgXml, ClipPath, Path, Rect } from "react-native-svg";

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
  const { width: screenWidth } = Dimensions.get("window");
  const cardWidth = screenWidth - 32; // учитываем отступы
  const cardHeight = 221;
  const cornerRadius = 20;
  const cutoutRadius = 20;
  if (deck.backgroundImageId && deck.backgroundImageId !== null) {
    const foldSize = 40;

    return (
      <TouchableOpacity style={styles.deckWithSvg} key={deck.id} onPress={onInfoClick}>
        <Svg width={cardWidth} height={cardHeight} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <ClipPath id="foldedCorner">
              <Path
                d={`M 0,${cornerRadius}
                   Q 0,0 ${cornerRadius},0
                   L ${cardWidth - foldSize},0
                   L ${cardWidth},${foldSize}
                   L ${cardWidth},${cardHeight - cornerRadius}
                   Q ${cardWidth},${cardHeight} ${cardWidth - cornerRadius},${cardHeight}
                   L ${cornerRadius},${cardHeight}
                   Q 0,${cardHeight} 0,${cardHeight - cornerRadius}
                   Z`}
              />
            </ClipPath>
          </Defs>

          <Rect width={cardWidth} height={cardHeight} fill="white" clipPath="url(#foldedCorner)" />

          {isValidSvg && svgData && (
            <SvgXml
              xml={svgData}
              height={cardHeight - 25}
              width={cardWidth}
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#foldedCorner)"
            />
          )}
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
    height: 195,
    width: "100%",
    backgroundColor: "white",
    overflow: "hidden",
    marginTop: 20,
    borderRadius: 20,
  },
  contentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  topContent: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
});
