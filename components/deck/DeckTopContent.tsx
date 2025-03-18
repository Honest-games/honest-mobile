import Colors from "@/constants/Colors";
import Loader from "@/modules/Loader";
import { IDeck } from "@/services/types/types";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import React from "react";
import useFetchDeckSvg from "@/features/hooks/useFetchDeckSvg";
import ContentLoader, { Circle } from "react-content-loader/native";

interface TopContentProps {
  goBack: () => void;
  selectedDeck: IDeck;
  onShufflePress: () => void;
}

export const DeckTopContent: React.FC<TopContentProps> = ({ goBack, selectedDeck, onShufflePress }) => {
  const { svgData, isLoadingImage, error: errorSvg } = useFetchDeckSvg(selectedDeck.image_id);
  return (
    <View style={styles.topContent}>
      <View style={styles.deckProgress}>
        {isLoadingImage ? (
          <ContentLoader speed={2} width={24} height={24} backgroundColor="#d1d1d1" foregroundColor="#c0c0c0">
            <Circle cx="12" cy="12" r="12" />
          </ContentLoader>
        ) : (
          <View>
            <SvgXml xml={svgData} width={24} height={24} />
          </View>
        )}
      </View>
      {!isLoadingImage && (
        <>
          <Text style={styles.text}>{selectedDeck.name.toLowerCase()}</Text>
          <View style={styles.rightButtons}>
            <TouchableOpacity 
              onPress={onShufflePress}
              style={styles.iconButton}
            >
              <MaterialIcons name="shuffle" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={goBack}>
              <AntDesign name="close" size={30} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deckProgress: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.deepGray,
    fontSize: 16,
    fontWeight: "bold",
  },
  img: {
    height: 32,
    width: 32,
  },
  skeletonItem: {
    marginRight: 10,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
});
