import * as React from 'react';
import ExtensionPoint from './extension-point';
import { EventTypes, RootComponentProps, EventDataTypes } from '@akashaorg/typings/ui';

type Props = {
  name: string;
  uiEvents: RootComponentProps['uiEvents'];
  style?: React.CSSProperties;
  data?: Partial<Pick<EventDataTypes, 'itemId' | 'commentId' | 'itemType'>> & {
    [key in string]: unknown;
  };
};

export function Extension({ name, uiEvents, style, data }: Props) {
  const handleExtensionMount = (name: string, data?: Record<string, unknown>) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: { name, ...data },
    });
  };

  const handleExtensionUnmount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: { name },
    });
  };

  return (
    <ExtensionPoint
      name={name}
      onMount={handleExtensionMount}
      onUnmount={handleExtensionUnmount}
      style={style}
      data={data}
    />
  );
}
