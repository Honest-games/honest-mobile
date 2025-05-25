import { StyleSheet } from "react-native";

export default StyleSheet.create({
  topContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  deckProgress: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    width: 80,
    height: 8,
    backgroundColor: "#EBEBEB",
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  progressColor: {
    height: "100%",
    width: "0%",
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 10,
    color: "#ADADAD",
  },
  likes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
  },
});
