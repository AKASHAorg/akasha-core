import React, { useRef } from 'react';
import { useClickAway, useKey } from 'react-use';

export function useCloseActions(
  onClose: () => void,
  wrapperRef?: React.MutableRefObject<unknown>,
  // if set to false, it does not trigger the callback
  // when clicking away. Useful when you handle clickAway manually but still want to trigger on key press
  triggerOnClickAway = true,
) {
  const ref = useRef(null);
  const contentRef = wrapperRef ? wrapperRef : ref;

  const onClickAwayClose = () => {
    if (triggerOnClickAway) {
      onClose();
    }
  };

  useKey('Esc', onClose);
  useKey('Escape', onClose);
  useClickAway(contentRef, onClickAwayClose);
  return contentRef;
}
