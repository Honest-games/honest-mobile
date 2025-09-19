import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Colors } from "@shared/config";
import * as Haptics from "expo-haptics";

interface NavigationControlsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  style?: ViewStyle;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  style,
}) => {
  const { t } = useTranslation();
  const primaryButtonScale = useSharedValue(1);
  const secondaryButtonScale = useSharedValue(1);

  const handlePrimaryPress = () => {
    primaryButtonScale.value = withSequence(withSpring(0.95, { damping: 15 }), withSpring(1, { damping: 15 }));

    if (isLastStep) {
      onComplete();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      onNext();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSecondaryPress = () => {
    secondaryButtonScale.value = withSequence(withSpring(0.95, { damping: 15 }), withSpring(1, { damping: 15 }));

    if (isFirstStep) {
      onSkip();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      onPrevious();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const primaryButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: primaryButtonScale.value }],
    };
  });

  const secondaryButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: secondaryButtonScale.value }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonRow}>
        <Animated.View style={[styles.secondaryButtonContainer, secondaryButtonStyle]}>
          <TouchableOpacity
            onPress={handleSecondaryPress}
            style={styles.secondaryButton}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isFirstStep ? t("onboarding.buttons.skip") : t("onboarding.buttons.back")}
          >
            <Text style={styles.secondaryButtonText}>{isFirstStep ? t("onboarding.buttons.skip") : t("onboarding.buttons.back")}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.primaryButtonContainer, primaryButtonStyle]}>
          <TouchableOpacity
            onPress={handlePrimaryPress}
            style={styles.primaryButton}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isLastStep ? t("onboarding.buttons.start") : t("onboarding.buttons.next")}
          >
            <Text style={styles.primaryButtonText}>{isLastStep ? t("onboarding.buttons.start") : t("onboarding.buttons.next")}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 56,
  },
  primaryButtonContainer: {
    flex: 2,
  },
  primaryButton: {
    backgroundColor: Colors.deepBlue,
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
  secondaryButtonContainer: {
    flex: 2,
  },
  secondaryButton: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: Colors.grey2,
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "bold",
  },
});
