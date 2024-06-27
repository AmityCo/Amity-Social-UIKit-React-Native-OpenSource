import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardStatus = () => {
  const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setIsKeyboardShowing(true);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShowing(false);
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return { isKeyboardShowing, keyboardHeight };
};
