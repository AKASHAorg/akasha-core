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
  fullHeight?: boolean;
  fullWidth?: boolean;
};

export function Extension({ name, uiEvents, style, fullHeight, data }: Props) {
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
      className={fullHeight ? 'h-full' : undefined}
      onMount={handleExtensionMount}
      onUnmount={handleExtensionUnmount}
      style={style}
      data={data}
    />
  );
}
