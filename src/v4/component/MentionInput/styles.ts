import { useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useKeyboardStatus } from '../../hook';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { isKeyboardShowing } = useKeyboardStatus();
  const { width, height } = useWindowDimensions();
  const animatedMarginTop = useRef(
    new Animated.Value(height * 0.25 - 10)
  ).current;

  const animateMarginTop = useCallback(
    (toValue) => {
      Animated.timing(animatedMarginTop, {
        toValue: toValue,
        easing: Easing.linear,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
    [animatedMarginTop]
  );

  useEffect(() => {
    const marginTop = isKeyboardShowing ? height * 0.25 - 10 : height * 0.5;
    animateMarginTop(marginTop);
  }, [animateMarginTop, height, isKeyboardShowing]);

  const styles = StyleSheet.create({
    mentionListContainer: {
      alignSelf: 'center',
      marginTop: animatedMarginTop,
      width,
      height: 170,
    },
    mentionListInnerContainer: {
      justifyContent: 'flex-end',
    },
    mentionContainer: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    mentionText: {
      color: theme.colors.primary,
      fontSize: 15,
    },
    inputContainer: {
      width: '100%',
      flex: 1,
    },
    inputText: {
      color: theme.colors.base,
      fontSize: 15,
      padding: 0,
      maxHeight: 200,
    },
    textInput: {
      marginTop: 12,
      fontSize: 15,
      width: '100%',
    },
    transparentText: {
      color: 'transparent',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 6,
    },
  });

  return styles;
};
