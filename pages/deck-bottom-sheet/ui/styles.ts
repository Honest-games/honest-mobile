import { Colors } from "@/shared/config";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    commonInformation: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  
    deckTitle: {
      fontFamily: "MakanHatiCyrillic",
      color: Colors.deepGreen,
      fontSize: 50,
      marginTop: 17,
      textAlign: "center",
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
    button: {
      justifyContent: "center",
      alignItems: "center",
      height: 46,
      width: 178,
      backgroundColor: Colors.deepGreen,
      borderRadius: 12,
    },
  });