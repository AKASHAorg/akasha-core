import * as React from 'react';
import { apply } from '@twind/core';

export interface ExtensionPointProps {
  name: string;
  customStyle?: string;
  style?: React.CSSProperties;
  mountOnRequest?: boolean;
  shouldMount?: boolean;
  data?: Record<string, unknown>;
  onClick?: () => void;
  onWrapperClick?: () => void;
  onMount: (name: string, data?: Record<string, unknown>) => void;
  onUnmount: (name: string) => void;
  children?: React.ReactNode;
}

const ExtensionSlot: React.FC<ExtensionPointProps> = props => {
  const {
    children,
    customStyle,
    mountOnRequest = false,
    shouldMount = true,
    onClick,
    onWrapperClick,
    data,
    name,
  } = props;

  const isMounted = React.useRef(false);

  const onMount = React.useRef(props.onMount);
  const onUnmount = React.useRef(props.onUnmount);

  const nodeRef = React.useRef(null);
  const clickHandler = React.useRef(() => {
    if (onClick) {
      props.onClick();
    }
    if (onWrapperClick) {
      props.onWrapperClick();
    }
  });

  React.useEffect(() => {
    if (!mountOnRequest || (mountOnRequest && shouldMount)) {
      if (!isMounted.current) {
        onMount.current(`${name}`, data);
        isMounted.current = true;
      }
      const node = document.querySelector(`#${name}`);
      if (node) {
        nodeRef.current = node;
        node.addEventListener('click', clickHandler.current);
      }
    }
  }, [mountOnRequest, shouldMount, name, data]);

  React.useEffect(() => {
    const onClick = clickHandler.current;
    const unmount = onUnmount.current;
    return () => {
      if (nodeRef.current) {
        nodeRef.current.removeEventListener('click', onClick);
      }
      unmount(`${name}`);
      isMounted.current = false;
    };
  }, [name]);

  if (!mountOnRequest || (mountOnRequest && shouldMount)) {
    return (
      <div id={name} className={apply(customStyle)}>
        {children}
      </div>
    );
  }
  return null;
};
export default ExtensionSlot;
