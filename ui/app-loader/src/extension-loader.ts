import { RootExtensionProps } from '@akashaorg/ui-awf-typings';
import { UIEventData } from '@akashaorg/ui-awf-typings/lib/app-loader';
import * as singleSpa from 'single-spa';

export const extensionLoader = (loadingFn: singleSpa.ParcelConfig) => {
  const parcels: Record<string, singleSpa.Parcel> = {};
  return {
    load(props: RootExtensionProps) {
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
