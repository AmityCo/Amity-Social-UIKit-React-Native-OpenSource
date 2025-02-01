import { StyleSheet, Text, Animated, ActivityIndicator } from 'react-native';
import React, { FC, memo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { RootState } from '../../redux/store';
import { toastIcon, toastSuccess } from '../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';

const Toast: FC = () => {
  const dispatch = useDispatch();
  const { hideToastMessage } = uiSlice.actions;
  const { toastMessage, showToastMessage, isLoadingToast, isSuccessToast } =
    useSelector((state: RootState) => state.ui);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  useEffect(() => {
    if (showToastMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: isLoadingToast ? 2500 : 500,
        useNativeDriver: false,
      }).start(() => {
        timeoutRef.current = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: isLoadingToast ? 2500 : 500,
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
  }, [dispatch, fadeAnim, hideToastMessage, isLoadingToast, showToastMessage]);

  const styles = StyleSheet.create({
    toastContainer: {
      width: '90%',
      position: 'absolute',
      bottom: 100,
      backgroundColor: '#292b32',
      borderRadius: 16,
      padding: 16,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    message: {
      lineHeight: 24,
      flex: 1,
      marginLeft: 4,
      color: '#ffffff',
    },
  });

  if (!showToastMessage) return null;
  return (
    <Animated.View style={[styles.toastContainer, { opacity: 1 }]}>
      {isLoadingToast ? (
        <ActivityIndicator
          style={{ marginRight: 5 }}
          animating={isLoadingToast}
          color="lightblue"
          size="small"
        />
      ) : isSuccessToast ? (
        <SvgXml xml={toastSuccess()} width="24" height="24" />
      ) : (
        <SvgXml xml={toastIcon()} width="24" height="24" />
      )}
      <Text style={styles.message}>{toastMessage}</Text>
    </Animated.View>
  );
};

export default memo(Toast);
