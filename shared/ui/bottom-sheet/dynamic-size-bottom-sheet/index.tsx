import React, { PropsWithChildren, forwardRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";
import { CustomBottomSheet } from "../custom-bottom-sheet";

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

const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />;


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
  ) => (
    <CustomBottomSheet
      ref={ref}
      style={style}
      enableDynamicSizing
      onDismiss={onClose}
      backgroundStyle={backgroundStyle}
      backdropComponent={showBackdrop ? renderBackdrop : null}
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
  ),
); 