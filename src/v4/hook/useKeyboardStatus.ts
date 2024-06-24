import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardStatus = () => {
  const [isKeyboardShowing, setIsKeyboardShowing] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShowing(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShowing(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return { isKeyboardShowing };
};
