import { Colors } from "@/shared/config";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  commonInformation: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  deckDescription: {
    width: "90%",
    color: Colors.grey1,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 33,
  },

  bottomSheetModal: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  modalWrapper: {
    gap: 20,
    paddingHorizontal: 20,
  },
  backgroundImageContainer: {
    position: "absolute",
    top: 0,
    left: 100,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  contentOverlay: {
    position: "relative",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
  },
});
