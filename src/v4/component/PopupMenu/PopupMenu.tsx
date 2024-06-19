import React, { useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

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
}

const Popup: React.FC<PopupProps> = ({ open, position, style, children }) => {
  const [visible, setVisible] = useState(true);

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      width: 0,
      height: 0,
    },
    popupPosition: {
      position: 'absolute',
      ...position,
    },
  });

  // Animated value for opacity
  const opacity = useState(new Animated.Value(0))[0];

  // Function to show the popup
  const showPopup = useCallback(() => {
    // Set the popup to visible
    setVisible(true);
    // Start the animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const hidePopup = useCallback(() => {
    // Start the animation
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false)); // Hide the popup after the animation
  }, [opacity]);

  useEffect(() => {
    if (open) {
      showPopup();
    } else hidePopup();
  }, [open, showPopup, hidePopup]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.popupPosition}>{children}</View>
    </Animated.View>
  );
};

export default Popup;
