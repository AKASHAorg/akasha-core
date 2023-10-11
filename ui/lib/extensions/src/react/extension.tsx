import * as React from 'react';
import { useRoutingEvents } from './use-routing-events';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ExtensionInterface, ExtensionStorePlugin } from '@akashaorg/typings/lib/ui';
import Parcel from 'single-spa-react/parcel';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type ExtensionComponentProps<D> = {
  name: string;
  loadingIndicator?: React.ReactNode;
  emptyIndicator?: React.ReactNode;
  onError?: (extension: ExtensionInterface & { appName: string }, message?: string) => void;
  customStyle?: string;
  extensionData?: D;
};

export const Extension = <D,>(props: ExtensionComponentProps<D>) => {
  const { name, loadingIndicator, emptyIndicator, onError, customStyle, extensionData } = props;
  const { getExtensionsPlugin, getContext } = useRootComponentProps();
  const extensionStore = React.useRef<ExtensionStorePlugin>(getExtensionsPlugin().extensionStore);
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
    return exts;
  }, [location, name]);

  React.useEffect(() => {
    const loadConfigs = async () => {
      for (const extension of extensions) {
        if (parcelConfigs.find(parcel => parcel.extension.appName === extension.appName)) return;
        try {
          const conf = await extension.loadingFn();
          setParcelConfigs(prev => [...prev, { config: conf, extension }]);
        } catch (err) {
          console.error(extension, `Failed to load extension. ${err.message}`);
        }
      }
    };
    loadConfigs().catch();
  }, [extensions, parcelConfigs]);

  const isLoading = extensions.length > parcelConfigs.length && !isEmpty;

  return (
    <Stack customStyle={customStyle} id={name}>
      {isLoading && loadingIndicator}
      {isEmpty && emptyIndicator}
      {parcelConfigs.map(parcel => (
        <Parcel
          config={parcel.config}
          {...getContext()}
          extensionData={extensionData}
          handleError={err => onError(parcel.extension, `Failed to mount. ${err.message}`)}
        />
      ))}
    </Stack>
  );
};
