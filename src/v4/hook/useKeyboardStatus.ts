import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardStatus = () => {
  const [isKayboardShowing, setIsKayboardShowing] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKayboardShowing(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKayboardShowing(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return { isKayboardShowing };
};
