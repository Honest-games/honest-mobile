import React from "react";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { IDeck } from "@/services/types/types";
import { DeckInfo } from "@/entities/deck/ui/deck-info";
import { DeckLabelList } from "@/entities/deck/ui/deck-label-list";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import { SvgXml } from "react-native-svg";

export interface DeckItemProps {
  deck: IDeck;
  onInfoClick: () => void;
  onDismiss: () => void;
  onPress?: () => void;
}

export const DeckItem: React.FC<DeckItemProps> = ({ deck, onInfoClick }) => {
  const labels = Array.isArray(deck.labels) ? deck.labels : [];
  
  // Получаем фоновое изображение, если оно есть
  const { svgData: backgroundSvg, isLoadingImage: isLoadingBackground } = 
    useFetchDeckSvg(deck.backgroundImageId || undefined);
  
  // Проверка на валидность SVG
  const isValidSvg = React.useMemo(() => {
    if (!backgroundSvg) return false;
    return backgroundSvg.trim().startsWith('<svg') || backgroundSvg.trim().startsWith('<?xml');
  }, [backgroundSvg]);
  
  const hasBackgroundImage = !!deck.backgroundImageId && !isLoadingBackground && isValidSvg;

  return (
    <TouchableOpacity style={styles.deck} key={deck.id} onPress={onInfoClick}>
      {hasBackgroundImage && (
        <View style={styles.backgroundImageContainer}>
          <SvgXml xml={backgroundSvg} width="100%" height="100%" />
        </View>
      )}
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
        <DeckInfo imageId={deck.imageId} title={deck.name} id={deck.id} />
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
}); 