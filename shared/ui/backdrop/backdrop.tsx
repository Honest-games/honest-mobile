import React, { memo } from "react";
import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

const BackdropComponent = (backdropProps: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop 
    {...backdropProps}
    disappearsOnIndex={-1} 
    appearsOnIndex={0} 
    opacity={0.6}
    enableTouchThrough={false}
  />
);

export default memo(BackdropComponent);
