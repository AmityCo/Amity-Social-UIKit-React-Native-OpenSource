import { StyleSheet, Text, Animated } from 'react-native';
import React, { FC, memo, useEffect, useRef } from 'react';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useDispatch, useSelector } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { RootState } from 'src/redux/store';

const Toast: FC = () => {
  const dispatch = useDispatch();
  const { hideToastMessage } = uiSlice.actions;
  const { toastMessage, showToastMessage } = useSelector(
    (state: RootState) => state.ui
  );
  const theme = useTheme() as MyMD3Theme;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    if (showToastMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        timeoutRef.current = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            dispatch(hideToastMessage());
          });
        }, 2000);
      });
    }

    return () => {
      fadeAnim.setValue(0);
      fadeAnim.stopAnimation();
      clearTimeout(timeoutRef.current);
    };
  }, [dispatch, fadeAnim, hideToastMessage, showToastMessage]);

  const styles = StyleSheet.create({
    toastContainer: {
      position: 'absolute',
      bottom: 100,
      backgroundColor: theme.colors.baseShade4,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      alignSelf: 'center',
    },
    message: {
      color: 'white',
    },
  });

  if (!showToastMessage) return null;
  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.message}>{toastMessage}</Text>
    </Animated.View>
  );
};

export default memo(Toast);
