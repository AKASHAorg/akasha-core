import React, { ReactPortal } from 'react';
import ReactDOM from 'react-dom';

interface IPortal {
  children: React.ReactNode;
  targetNode?: HTMLElement;
}

export const Portal = (props: IPortal): ReactPortal | null => {
  const { children, targetNode } = props as IPortal;

  if (targetNode) {
    return ReactDOM.createPortal(children, targetNode);
  }
  return ReactDOM.createPortal(children, document.body);
};
