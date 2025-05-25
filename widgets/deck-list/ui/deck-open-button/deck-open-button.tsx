import { Colors } from "@/shared/config";
import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View, ViewStyle, Text, StyleSheet } from "react-native";

interface DeckOpenButtonProps {
  id: string | number;
  style?: ViewStyle;
  onDismiss: () => void;
}

export const DeckOpenButton: React.FC<DeckOpenButtonProps> = ({ 
  id, 
  style, 
  onDismiss 
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Link href={`/decks/${id}`} asChild>
        <TouchableOpacity style={styles.button} onPress={onDismiss}>
          <Text style={styles.textButton}>{t("play")}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    height: 46,
    width: 178,
    backgroundColor: Colors.deepBlue,
    borderRadius: 24.5,
  },
  textButton: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
}); 