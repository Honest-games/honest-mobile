import { useAppDispatch, useAppSelector } from "@/features/hooks/useRedux";
import { useDislikeDeckMutation, useLikeDeckMutation } from "@/services/api";
import { addDeckId, removeDeckId } from "@/store/reducer/deck-likes-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DeckLikeButton from "../UI/DeckLikeButton";
import DeckAdditionalButton from "../components/deck/DeckAdditionalButton";
import DeckInfo from "../components/deck/DeckInfo";
import LabelList from "../components/deck/DeckLabelList";
import { useUserId } from "@/features/hooks";
import { IDeck } from "@/services/types/types";

export interface DeckProps {
  deck: IDeck;
  onInfoClick: () => void;
  onDismiss: () => void;
  onPress?: () => void;
}

function DeckItem({ deck, onInfoClick }: DeckProps) {
  const labels = deck.labels?.split(";");

  return (
    <TouchableOpacity style={styles.deck} key={deck.id} onPress={onInfoClick}>
      <View style={{ flexDirection: "column", margin: 12, flex: 1 }}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <LabelList labels={labels} />

          <DeckLikeButton deckId={deck.id} />
        </View>
        <DeckInfo imageId={deck.image_id} title={deck.name} id={deck.id} />
      </View>
    </TouchableOpacity>
  );
}

export default DeckItem;

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
  },
});
