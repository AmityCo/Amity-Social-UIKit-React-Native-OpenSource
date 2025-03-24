import React, { memo, useEffect, useRef } from 'react';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import bottomSheetSlice, {
  BottomSheetState,
} from '../../../redux/slices/bottomSheetSlice';
import { useAmityComponent } from '../../hook';
import { StyleSheet } from 'react-native';

const BottomSheetComponent = () => {
  const { closeBottomSheet } = bottomSheetSlice.actions;
  const dispatch = useDispatch();
  const { content, height, pageId, componentId } = useSelector(
    (state: RootState) => state.bottomSheet as BottomSheetState
  );
  const sheetRef = useRef<BottomSheetMethods>(null);
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: themeStyles.colors.background,
    },
  });

  useEffect(() => {
    if (content) {
      sheetRef.current.open();
    } else {
      sheetRef.current.close();
    }
  }, [content]);

  return (
    <BottomSheet
      ref={sheetRef}
      height={height}
      onClose={() => dispatch(closeBottomSheet())}
      closeOnDragDown
      closeOnBackdropPress
      style={styles.container}
    >
      {content}
    </BottomSheet>
  );
};

export default memo(BottomSheetComponent);
