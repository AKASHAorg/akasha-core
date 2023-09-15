import React, { useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { tw } from '@twind/core';

export type ExtensionPointProps = {
  name: string;
  customStyle?: string;
  style?: CSSProperties;
  mountOnRequest?: boolean;
  shouldMount?: boolean;
  data?: Record<string, unknown>;
  onClick?: () => void;
  onWrapperClick?: () => void;
  onMount: (name: string, data?: Record<string, unknown>) => void;
  onUnmount: (name: string) => void;
  onUpdate: (name: string, data?: Record<string, unknown>) => void;
  children?: ReactNode;
};

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

  const isMounted = useRef(false);

  const onMount = useRef(props.onMount);
  const onUnmount = useRef(props.onUnmount);
  const onUpdate = useRef(props.onUpdate);

  const nodeRef = useRef(null);
  const clickHandler = useRef(() => {
    if (onClick) {
      props.onClick();
    }
    if (onWrapperClick) {
      props.onWrapperClick();
    }
  });

  useEffect(() => {
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

  useEffect(() => {
    if (isMounted.current) {
      onUpdate.current(`${name}`, data);
    }
  }, [name, data]);

  useEffect(() => {
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
      <div id={name} className={tw(customStyle)}>
        {children}
      </div>
    );
  }
  return null;
};
export default ExtensionSlot;
