import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
