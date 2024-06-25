import { useState, useRef } from 'react';

export const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, setIsOpen, toggle, popupRef };
};
