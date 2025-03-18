import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { useRoutingEvents } from './use-routing-events';
import { WidgetInterface, IWidgetStorePlugin } from '@akashaorg/typings/lib/ui';
import Parcel from 'single-spa-react/parcel';
import { createLifecycles } from '../utils/create-lifecycles';

export type WidgetExtensionProps = {
  name: string;
  loadingIndicator?: React.ReactNode;
  onError?: (widget: WidgetInterface & { appName: string }, message?: string) => void;
  customStyle?: string;
  fullHeight?: boolean;
};

const WidgetComponent: React.FC<WidgetExtensionProps> = props => {
  const { name, loadingIndicator, onError, customStyle = '', fullHeight } = props;
  const { getCorePlugins, getContext, logger } = useRootComponentProps();
  const widgetStore = React.useRef<IWidgetStorePlugin>(getCorePlugins().widgetStore);
  const [parcelConfigs, setParcelConfigs] = React.useState<
    {
      config: {
        name: string;
        bootstrap: () => Promise<never>;
        mount: () => Promise<never>;
        unmount: () => Promise<never>;
        update: () => Promise<never>;
      };
      widget: WidgetInterface & { appName: string };
    }[]
  >([]);
  const location = useRoutingEvents();

  const [isParcelMounted, setIsParcelMounted] = React.useState(false);

  const widgets = React.useMemo(() => {
    if (!widgetStore.current) return [];
    return widgetStore.current.getMatchingWidgets(name, location);
  }, [location, name]);

  React.useEffect(() => {
    for (const parcelConf of widgets) {
      widgetStore.current.onWidgetUnload(parcelConf.appName, () => {
        setParcelConfigs(prev =>
          prev.filter(parcel => parcel.widget.appName !== parcelConf.appName),
        );
        setIsParcelMounted(false);
      });
    }
  }, [widgets]);

  React.useEffect(() => {
    const resolveConfigs = async () => {
      const newWidgets = [];

      for (const [idx, widget] of widgets.entries()) {
        if (newWidgets.find(p => p.widget.appName === widget.appName)) continue;
        try {
          const lifecycles = await createLifecycles(widget.rootComponent, widget.UILib, {
            logger: logger,
            onModuleError: () => {
              onError?.(widget, 'Failed to load module.');
            },
            onRenderError: () => {
              onError?.(widget, 'Failed to render.');
            },
            onScriptError: () => {
              onError?.(widget, 'An unknown error occurred.');
            },
          });
          newWidgets.push({
            config: {
              ...lifecycles,
              name: `${widget.appName}_${idx}`,
            },
            widget,
          });
        } catch (err) {
          logger.error(`error getting widget config, ${widget.appName}`);
          onError?.(widget);
        }
      }

      setParcelConfigs(newWidgets);
    };

    resolveConfigs().catch(err => onError(undefined, err.message));
  }, [widgets, onError, logger]);

  const handleParcelError = React.useCallback(
    (widget: WidgetInterface & { appName: string }, index: number) => (err: Error) => {
      onError?.(widget, `Failed to mount: ${err.message}`);
      if (logger) logger.error(`Failed to mount parcel: ${widget.appName}_${index}`);
    },
    [logger, onError],
  );

  const loadingConfiguredParcel = parcelConfigs.length > 0 ? !isParcelMounted : false;
  const isLoading = widgets.length > parcelConfigs.length || loadingConfiguredParcel;

  return (
    <div className={`flex ${customStyle} ${fullHeight ? 'h-full' : ''}`} id={name}>
      {isLoading && loadingIndicator}
      {parcelConfigs.map((parcelConf, index) => (
        <Parcel
          wrapStyle={{
            display: isLoading ? 'none' : undefined,
          }}
          parcelDidMount={() => {
            setIsParcelMounted(true);
          }}
          {...getContext()}
          key={parcelConf.widget.appName}
          config={parcelConf.config}
          handleError={handleParcelError(parcelConf.widget, index)}
        />
      ))}
    </div>
  );
};

export class Widget extends React.PureComponent<WidgetExtensionProps> {
  render() {
    return <WidgetComponent {...this.props} />;
  }
}
