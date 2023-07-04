import { useRef } from 'react';
import { useClickAway, useKey } from 'react-use';

export function useCloseActions(onClose: () => void) {
  const contentRef = useRef(null);
  useKey('Esc', onClose);
  useKey('Escape', onClose);
  useClickAway(contentRef, onClose); //Specifying event should be avoided as it has unpredictable results
  return contentRef;
}
