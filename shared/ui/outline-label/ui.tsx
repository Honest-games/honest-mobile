import { StyleSheet, Text, View } from "react-native";

interface OutlineLabelProps {
  levelBgColor: string;
  levelTitle: string;
}

export const OutlineLabel = ({ levelBgColor, levelTitle }: OutlineLabelProps) => {
  const styles = StyleSheet.create({
    label: {
      justifyContent: "flex-start",
      borderRadius: 12,
    //   borderWidth: 1,

    //   borderColor: levelBgColor,
      alignItems: "center",
    },
    labelText: {
      fontSize: 16,
      marginTop: 12,
      marginBottom: 12,
      marginLeft: 16,
      marginRight: 16,
      color: levelBgColor,
    },
  });

  return (
    <View style={styles.label}>
      <Text style={styles.labelText}>{levelTitle.toLowerCase()}</Text>
    </View>
  );
};
