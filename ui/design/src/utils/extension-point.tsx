import * as React from 'react';
export interface ExtensionPointProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  mountOnRequest?: boolean;
  shouldMount?: boolean;
  onClick?: () => void;
  onWrapperClick?: () => void;
  onMount: (name: string) => void;
  onUnmount: (name: string) => void;
}

const ExtensionPoint: React.FC<ExtensionPointProps> = props => {
  const { mountOnRequest = false, shouldMount = true } = props;

  const isMounted = React.useRef(false);

  const onMount = React.useRef(props.onMount);
  const onUnmount = React.useRef(props.onUnmount);

  const nodeRef = React.useRef(null);
  const clickHandler = React.useRef(() => {
    if (props.onClick) {
      props.onClick();
    }
    if (props.onWrapperClick) {
      props.onWrapperClick();
    }
  });
  React.useEffect(() => {
    if (!mountOnRequest || (mountOnRequest && shouldMount)) {
      if (!isMounted.current) {
        onMount.current(`${props.name}`);
        isMounted.current = true;
      }
      const node = document.querySelector(`#${props.name}`);
      if (node) {
        nodeRef.current = node;
        node.addEventListener('click', clickHandler.current);
      }
    }
  }, [mountOnRequest, shouldMount, props.name]);
  React.useEffect(() => {
    const onClick = clickHandler.current;
    const unmount = onUnmount.current;
    return () => {
      nodeRef.current.removeEventListener('click', onClick);
      unmount(`${props.name}`);
    };
  }, [props.name]);

  if (!mountOnRequest || (mountOnRequest && shouldMount)) {
    return (
      <div id={props.name} className={props.className} style={props.style}>
        {props.children}
      </div>
    );
  }
  return null;
};

export default ExtensionPoint;
