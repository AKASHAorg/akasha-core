import React, { useRef } from 'react';
import { useClickAway, useKey } from 'react-use';

export function useCloseActions(onClose: () => void, wrapperRef?: React.MutableRefObject<unknown>) {
  const ref = useRef(null);
  const contentRef = wrapperRef ? wrapperRef : ref;
  useKey('Esc', onClose);
  useKey('Escape', onClose);
  useClickAway(contentRef, onClose); //Specifying event should be avoided as it has unpredictable results
  return contentRef;
}
