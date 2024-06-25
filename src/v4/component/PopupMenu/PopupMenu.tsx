import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  ViewStyle,
  Dimensions,
  Pressable,
} from 'react-native';

interface PopupProps {
  children: React.ReactNode;
  open: boolean;
  style?: ViewStyle;
  position: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  setOpen: (open: boolean) => void;
}

const Popup: React.FC<PopupProps> = ({
  open,
  setOpen,
  position,
  style,
  children,
}) => {
  const [visible, setVisible] = useState(true);
  const { width, height } = Dimensions.get('screen');

  const styles = StyleSheet.create({
    outer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width,
      height,
    },
    container: {
      position: 'absolute',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8, // for android
      ...position,
    },
  });

  // Animated value for opacity
  const opacity = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(-10))[0]; // Initial position off-screen

  // Function to show the popup
  const showPopup = useCallback(() => {
    setVisible(true);
    // Animate both opacity and translateY
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0, // Slide to original position
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const hidePopup = useCallback(() => {
    // Animate both opacity and translateY
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -10, // Slide upwards
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false)); // Hide the popup after the animation
  }, [opacity, translateY]);

  useEffect(() => {
    if (open) {
      showPopup();
    } else hidePopup();
  }, [open, showPopup, hidePopup]);

  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.outer} onPress={() => setOpen(false)} />
      <Animated.View
        style={[
          styles.container,
          { opacity, transform: [{ translateY }] },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
};

export default Popup;
