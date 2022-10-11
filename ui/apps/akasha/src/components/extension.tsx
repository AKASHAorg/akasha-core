import * as React from 'react';
import DS from '@akashaorg/design-system';
import { EventTypes, RootComponentProps } from '@akashaorg/typings/ui';

const { ExtensionPoint } = DS;

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
