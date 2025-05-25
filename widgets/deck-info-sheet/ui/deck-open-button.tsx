import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import Colors from "@/constants/Colors";

interface DeckOpenButtonProps {
  id: string | number;
  style?: ViewStyle;
  onDismiss: () => void;
}

export const DeckOpenButton: React.FC<DeckOpenButtonProps> = ({ id, style, onDismiss }) => {
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
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    width: 178,
    backgroundColor: Colors.deepGreen,
    borderRadius: 12,
  },
}); 