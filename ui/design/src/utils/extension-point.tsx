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

  const nodeRef = React.useRef(null);
  const clickHandler = () => {
    if (props.onClick) {
      props.onClick();
    }
    if (props.onWrapperClick) {
      props.onWrapperClick();
    }
  };

  React.useEffect(() => {
    if (!mountOnRequest || (mountOnRequest && shouldMount)) {
      props.onMount(`${props.name}`);
      const node = document.querySelector(`#${props.name}`);
      if (node) {
        nodeRef.current = node;
        node.addEventListener('click', clickHandler);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mountOnRequest, props.shouldMount, props.name]);
  React.useEffect(() => {
    return () => {
      nodeRef.current.removeEventListener('click', clickHandler);
      props.onUnmount(`${props.name}`);
    };
  }, []);

  if (!mountOnRequest || (mountOnRequest && shouldMount)) {
    return <div id={props.name} className={props.className} style={props.style} />;
  }
  return null;
};

export default ExtensionPoint;
