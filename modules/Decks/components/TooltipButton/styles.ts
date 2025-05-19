import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      alignItems: "center",
      position: "relative",
    },
    tooltip: {
      position: "absolute",
      bottom: "130%",
      padding: 10,
      borderRadius: 8,
      maxWidth: 200,
      elevation: 5,
      zIndex: 1000,
    },
    tooltipText: {
      fontSize: 14,
      textAlign: "center",
    },
  });