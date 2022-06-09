import { RootExtensionProps } from '@akashaorg/ui-awf-typings';
import { UIEventData, ExtensionLoaderFn } from '@akashaorg/ui-awf-typings/lib/app-loader';
import * as singleSpa from 'single-spa';

export const extensionLoader: ExtensionLoaderFn = loadingFn => {
  const parcels: Record<string, singleSpa.Parcel> = {};
  return {
    load(props: RootExtensionProps) {
      const { domElement } = props;
      if (!domElement) {
        props.logger.warn(`Not loading extension ${props.name}. domNode not found.`);
        return;
      }

      const parcel = singleSpa.mountRootParcel(loadingFn, props);
      parcels[props.extensionData.name] = parcel;
    },
    async unload(event: UIEventData) {
      if (parcels[event.data.name]) {
        // do not wait for unmount
        await parcels[event.data.name].unmount();
        delete parcels[event.data.name];
      }
    },
  };
};
