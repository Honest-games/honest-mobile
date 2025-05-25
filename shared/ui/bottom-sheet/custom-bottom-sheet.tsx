import React, { forwardRef, useRef, PropsWithChildren } from "react";
import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";

enum SNAP_POINT_TYPE {
  PROVIDED = 0,
  DYNAMIC = 1,
}

interface CustomBottomSheetProps extends BottomSheetModalProps {
  analytics?: boolean;
  animationConfigs?: WithSpringConfig | WithTimingConfig;
}

export const CustomBottomSheet = forwardRef<BottomSheetModalMethods, CustomBottomSheetProps>(
  ({ children, onChange, animationConfigs, ...props }, ref) => {
    const timerRef = useRef<number>(0);

    const onCustomChange = (index: number, position: number, type: SNAP_POINT_TYPE) => {
      if (index >= 0) {
        timerRef.current = new Date().getTime();
      }

      onChange?.(index, position, type);
    };

    const newProps = {
      ...props,
      onChange: onCustomChange,
      animationConfigs,
    };

    return (
      <BottomSheetModal ref={ref} {...newProps}>
        {children}
      </BottomSheetModal>
    );
  },
); 