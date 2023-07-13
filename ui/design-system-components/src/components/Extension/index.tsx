import * as React from 'react';
import ExtensionSlot from './extension-slot';
import { EventTypes, RootComponentProps, EventDataTypes } from '@akashaorg/typings/ui';

type ExtensionProps = {
  name: string;
  uiEvents: RootComponentProps['uiEvents'];
  style?: React.CSSProperties;
  data?: Partial<Pick<EventDataTypes, 'itemId' | 'commentId' | 'itemType'>> & {
    [key in string]: unknown;
  };
  fullHeight?: boolean;
  fullWidth?: boolean;
  customStyle?: string;
};

const Extension: React.FC<ExtensionProps> = props => {
  const { name, uiEvents, style, fullHeight, data, customStyle } = props;
  const handleExtensionMount = (name: string, data?: Record<string, unknown>) => {
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
    <ExtensionSlot
      name={name}
      customStyle={`${customStyle} ${fullHeight ? 'h-full' : ''}`}
      onMount={handleExtensionMount}
      onUnmount={handleExtensionUnmount}
      style={style}
      data={data}
    />
  );
};

Extension.defaultProps = {
  customStyle: '',
};
export default Extension;
