import * as React from 'react';
export interface ExtensionPointProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  mountOnRequest?: boolean;
  shouldMount?: boolean;
  onMount: (name: string) => void;
  onUnmount: (name: string) => void;
}

const ExtensionPoint: React.FC<ExtensionPointProps> = props => {
  const { mountOnRequest = false, shouldMount = true } = props;
  React.useEffect(() => {
    if (!mountOnRequest || (mountOnRequest && shouldMount)) {
      props.onMount(`${props.name}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mountOnRequest, props.shouldMount, props.name]);
  React.useEffect(() => {
    return () => props.onUnmount(`${props.name}`);
  }, []);

  if (!mountOnRequest || (mountOnRequest && shouldMount)) {
    return <div id={props.name} className={props.className} style={props.style} />;
  }
  return null;
};

export default ExtensionPoint;
