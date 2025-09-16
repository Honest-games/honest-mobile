import Colors from "@shared/config/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/shared/lib/ui/haptic-tab/haptic-tab";
import TabBarBackground from "@/shared/lib/ui/tabbar-background/TabBarBackground";
import CustomNavBar from "@/widgets/custom-tabbar/ui/custom-tabbar";

export default function TabLayout() {
  return (
    <Tabs
	tabBar={(props) => <CustomNavBar {...props} />}
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors.deepBlue,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //     tabBarBackground: TabBarBackground,
    //     tabBarStyle: Platform.select({
    //       ios: {
    //         // Use a transparent background on iOS to show the blur effect
    //         position: "absolute",
    //       },
    //       default: {},
    //     }),
    //   }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Decks",
          headerShown: false,
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="cards" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
