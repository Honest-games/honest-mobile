import { Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View, ViewStyle, Text } from "react-native";
import styles from "./styles";

const DeckOpenButton = ({ id, style, onDismiss }: { id: string | number; style?: ViewStyle; onDismiss: () => void }) => {
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

export default DeckOpenButton