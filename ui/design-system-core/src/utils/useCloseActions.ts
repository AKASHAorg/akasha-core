import { useRef } from 'react';
import { useClickAway, useKey } from 'react-use';

export function useCloseActions(onClose: () => void) {
  const contentRef = useRef(null);
  useClickAway(contentRef, onClose, ['click']);
  useKey('Esc', onClose);
  useKey('Escape', onClose);
  return contentRef;
}
