import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useRoutingEvents } from './use-routing-events';
import { WidgetInterface, WidgetStorePlugin } from '@akashaorg/typings/lib/ui';
import Parcel from 'single-spa-react/parcel';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type WidgetExtensionProps = {
  name: string;
  loadingIndicator?: React.ReactNode;
  onError?: (widget: WidgetInterface & { appName: string }, message?: string) => void;
  customStyle?: string;
  fullHeight?: boolean;
};

export const Widget: React.FC<WidgetExtensionProps> = props => {
  const { name, loadingIndicator, onError, customStyle = '', fullHeight } = props;
  const { getExtensionsPlugin, getContext } = useRootComponentProps();
  const widgetStore = React.useRef<WidgetStorePlugin>(getExtensionsPlugin().widgetStore);
  const [parcelConfigs, setParcelConfigs] = React.useState([]);
  const location = useRoutingEvents();

  const [isParcelMounted, setIsParcelMounted] = React.useState(false);

  const widgets = React.useMemo(() => {
    if (!widgetStore.current) return [];
    return widgetStore.current.getMatchingWidgets(name, location);
  }, [location, name]);

  console.log(widgets, parcelConfigs, location);

  React.useEffect(() => {
    const resolveConfigs = async () => {
      for (const widget of widgets) {
        if (parcelConfigs.find(p => p.widget.appName === widget.appName)) return;
        try {
          const config = await widget.loadingFn();
          setParcelConfigs(prev => [...prev, { config, widget }]);
        } catch (err) {
          console.error('error getting widget config', widget.appName);
          onError?.(widget);
        }
      }
    };
    resolveConfigs().catch();
  }, [widgets, parcelConfigs]);

  const loadingConfiguredParcel = parcelConfigs.length > 0 ? !isParcelMounted : false;
  const isLoading = widgets.length > parcelConfigs.length || loadingConfiguredParcel;

  return (
    <Stack customStyle={`${customStyle} ${fullHeight ? 'h-full' : ''}`} id={name}>
      {isLoading && loadingIndicator}
      {parcelConfigs.map(parcelConf => (
        <Parcel
          wrapStyle={{
            display: isLoading ? 'none' : undefined,
          }}
          parcelDidMount={() => {
            setIsParcelMounted(true);
          }}
          key={parcelConf.widget.appName}
          config={parcelConf.config}
          {...getContext()}
          handleError={err => onError(parcelConf.widget, `Failed to mount: ${err.message}`)}
        />
      ))}
    </Stack>
  );
};
