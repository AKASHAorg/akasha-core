import * as React from 'react';
import { useRoutingEvents } from './use-routing-events';
import { useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { ExtensionPointInterface, IExtensionPointStorePlugin } from '@akashaorg/typings/lib/ui';
import { RootParcel } from './root-parcel';
import { createLifecycles } from '../utils/create-lifecycles';

export type ExtensionComponentProps<D> = {
  name: string;
  loadingIndicator?: React.ReactNode;
  emptyIndicator?: React.ReactNode;
  onError?: (extension: ExtensionPointInterface & { appName: string }, message?: string) => void;
  customStyle?: string;
  extensionData?: D;
};

export const ExtensionRoot = <D,>(props: ExtensionComponentProps<D>) => {
  const {
    name,
    loadingIndicator,
    emptyIndicator,
    onError,
    customStyle = '',
    extensionData,
  } = props;
  const { getCorePlugins, getContext, logger } = useRootComponentProps();
  const extensionStore = React.useRef<IExtensionPointStorePlugin>(
    getCorePlugins().extensionPointStore,
  );
  const [parcelConfigs, setParcelConfigs] = React.useState([]);
  const [isEmpty, setIsEmpty] = React.useState(false);

  const location = useRoutingEvents();
  const extensions = React.useMemo(() => {
    if (!extensionStore.current) return [];
    const exts = extensionStore.current.getMatchingExtensions(name, location);
    if (!exts.length) {
      setIsEmpty(true);
      return [];
    }
    return [...exts];
  }, [location, name]);

  React.useEffect(() => {
    const loadConfigs = async () => {
      const newExtensions = [];

      for (const extension of extensions) {
        if (newExtensions.find(parcel => parcel.extension.appName === extension.appName)) continue;

        try {
          const lifecycles = await createLifecycles(extension.rootComponent, undefined, {
            logger,
            onModuleError: () => {},
            onRenderError: () => {},
            onScriptError: () => {},
          });
          newExtensions.push({ config: lifecycles, extension });
        } catch (err) {
          logger.error(`Failed to load extension ${extension}: ${err.message}`);
          onError?.(extension);
        }
      }

      setParcelConfigs(newExtensions);
    };

    loadConfigs().catch();
  }, [extensions, logger, onError]);

  const handleParcelError = React.useCallback(
    (extension: ExtensionPointInterface & { appName: string }) => (err: Error) => {
      if (logger) logger.error(`Error in ${extension.appName}_${name}: ${err}`);
      onError?.(extension, `Failed to mount. ${err.message}`);
    },
    [logger, name, onError],
  );

  const isLoading = extensions.length > parcelConfigs.length && !isEmpty;

  return (
    <div className={`flex flex-col ${customStyle}`} id={name}>
      {isLoading && loadingIndicator}
      {isEmpty && emptyIndicator}
      {parcelConfigs.map(parcel => (
        <RootParcel
          key={parcel.extension.appName}
          config={{ ...parcel.config, name: `${parcel.extension.appName}_${name}` }}
          {...getContext()}
          extensionData={extensionData}
          handleError={handleParcelError(parcel.extension)}
        />
      ))}
    </div>
  );
};

export class Extension<T> extends React.PureComponent<ExtensionComponentProps<T>> {
  render() {
    return <ExtensionRoot {...this.props} />;
  }
}
