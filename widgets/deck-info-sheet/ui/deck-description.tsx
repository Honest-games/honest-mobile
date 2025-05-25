import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { IDeck } from "@/services/types/types";
import Colors from "@/constants/Colors";

interface DeckDescriptionProps {
  deck: IDeck;
  style?: ViewStyle;
}

export const DeckDescription: React.FC<DeckDescriptionProps> = ({ deck, style }) => {
  return (
    <View style={[styles.commonInformation, style]}>
      <Text style={styles.deckTitle}>{deck.name.toUpperCase() || "Название колоды"}</Text>
      <Text style={styles.deckDescription}>{deck.description.toLowerCase() || "описание колоды"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commonInformation: {
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
}); 