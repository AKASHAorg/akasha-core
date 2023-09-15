import React from 'react';
import ExtensionSlot from './extension-slot';
import { EventTypes, RootComponentProps, type EventDataTypes } from '@akashaorg/typings/lib/ui';

type ExtensionProps = {
  name: string;
  uiEvents: RootComponentProps['uiEvents'];
  style?: React.CSSProperties;
  data?: Omit<EventDataTypes, 'name'>;
  fullHeight?: boolean;
  fullWidth?: boolean;
  customStyle?: string;
};

const Extension: React.FC<ExtensionProps> = props => {
  const { name, uiEvents, style, fullHeight, data, customStyle = '' } = props;
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

  const handleExtensionUpdate = (name: string, data: Omit<EventDataTypes, 'name'>) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointUpdate,
      data: { name, ...data },
    });
  };

  return (
    <ExtensionSlot
      name={name}
      customStyle={`${customStyle} ${fullHeight ? 'h-full' : ''}`}
      onMount={handleExtensionMount}
      onUnmount={handleExtensionUnmount}
      onUpdate={handleExtensionUpdate}
      style={style}
      data={data}
    />
  );
};

export default Extension;
