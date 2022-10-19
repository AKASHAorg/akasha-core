import * as React from 'react';
import ExtensionPoint from './extension-point';
import { EventTypes, RootComponentProps } from '@akashaorg/typings/ui';

type Props = {
  name: string;
  uiEvents: RootComponentProps['uiEvents'];
  data: Record<string, unknown>;
  style?: React.CSSProperties;
};

export function Extension({ name, data, uiEvents, style }: Props) {
  const handleExtensionMount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: { name, ...data },
    });
  };

  const handleExtensionUnmount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: { name, ...data },
    });
  };

  return (
    <ExtensionPoint
      name={name}
      onMount={handleExtensionMount}
      onUnmount={handleExtensionUnmount}
      style={style}
    />
  );
}
