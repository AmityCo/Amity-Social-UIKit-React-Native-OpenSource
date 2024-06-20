import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return { isOpen, toggle, popupRef };
};
