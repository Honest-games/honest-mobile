import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Colors } from "@/shared/config";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOR = "#130057";
const SECONDARY_COLOR = "#fff";

const CustomNavBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const visibleRoutes = state.routes.filter(
    route => !["_sitemap", "+not-found"].includes(route.name)
  );
  const tabCount = visibleRoutes.length;
  
  return (
    <View style={[styles.container, { width: Math.max(tabCount * 80, 180) }]}>
      <BlurView
        tint="systemChromeMaterial"
        intensity={30}
        style={StyleSheet.absoluteFill}
      />
      {state.routes.map((route, index) => {
        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              { backgroundColor: isFocused ? Colors.white : "transparent" },
            ]}
          >
            {getIconByRouteName(
              route.name,
              isFocused ? Colors.deepBlue : Colors.grey1
            )}
            {isFocused && (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={styles.text}
              >
                {label as string}
              </Animated.Text>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "index":
        return <MaterialCommunityIcons name="cards" size={24} color={color}/>;
      case "profile":
        return <MaterialCommunityIcons name="account" size={24} color={color} />;
      default:
        return <MaterialCommunityIcons name="cards" size={24} color={color}/>;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(206, 204, 215, 0.3)",
    alignSelf: "center",
    bottom: 16,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: "hidden",
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 13,
    borderRadius: 30,
  },
  text: {
    color: Colors.deepBlue,
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default CustomNavBar;