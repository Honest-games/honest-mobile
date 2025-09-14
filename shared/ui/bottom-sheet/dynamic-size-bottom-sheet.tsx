import React, { PropsWithChildren, forwardRef, useCallback, useRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { WithSpringConfig, WithTimingConfig, useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { CustomBottomSheet } from "./custom-bottom-sheet";
import { Backdrop } from "../backdrop";

interface IProps {
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  enableScroll?: boolean;
  showBackdrop?: boolean;
  enablePanDownToClose?: boolean;
  detached?: boolean;
  bottomInset?: number;
  backgroundStyle?: StyleProp<ViewStyle>;
  animationConfigs?: WithSpringConfig | WithTimingConfig;
}

const DEFAULT_BOTTOM_INSET = 0;

export const DynamicSizeBottomSheet = forwardRef<BottomSheetModal, PropsWithChildren<IProps>>(
  (
    {
      onClose,
      style,
      containerStyle,
      enableScroll = false,
      children,
      showBackdrop = true,
      enablePanDownToClose = true,
      detached = true,
      bottomInset = DEFAULT_BOTTOM_INSET,
      backgroundStyle,
      animationConfigs,
    },
    ref,
  ) => {
    const backdropOpacity = useSharedValue(0);
    const isFirstOpen = useRef(true);
    
    const animatedBackdropStyle = useAnimatedStyle(() => {
      return {
        opacity: backdropOpacity.value,
      };
    });
    
    const AnimatedBackdrop = useCallback((props: BottomSheetBackdropProps) => {
      return (
        <Animated.View style={[props.style, animatedBackdropStyle]}>
          <Backdrop {...props} />
        </Animated.View>
      );
    }, [animatedBackdropStyle]);

    const handleChange = useCallback((index: number) => {
      if (index >= 0) {
        const delay = isFirstOpen.current ? 50 : 100;
        isFirstOpen.current = false;
        
        setTimeout(() => {
          backdropOpacity.value = withTiming(1, { duration: 350 });
        }, delay);
      } else {
        backdropOpacity.value = withTiming(0, { duration: 300 });
      }
    }, [backdropOpacity]);

    return (
      <CustomBottomSheet
        ref={ref}
        style={style}
        enableDynamicSizing
        onDismiss={onClose}
        onChange={handleChange}
        backgroundStyle={backgroundStyle}
        backdropComponent={showBackdrop ? AnimatedBackdrop : undefined}
        containerStyle={[containerStyle]}
        enablePanDownToClose={enablePanDownToClose}
        handleStyle={enablePanDownToClose ? undefined : { display: 'none' }}
        detached={detached}
        bottomInset={bottomInset}
        animationConfigs={animationConfigs}
      >
        <BottomSheetScrollView
          scrollEnabled={enableScroll}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {children}
        </BottomSheetScrollView>
      </CustomBottomSheet>
    );
  },
); 