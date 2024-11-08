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
      borderRadius: 16,
      maxWidth: 200,
      elevation: 5,
    },
    tooltipText: {
      fontSize: 14,
      textAlign: "center",
    },
  });