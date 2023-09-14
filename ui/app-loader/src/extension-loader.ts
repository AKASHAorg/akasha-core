import {
  ExtensionLoaderFn,
  RootExtensionProps,
  EventDataTypes,
  EventTypes,
} from '@akashaorg/typings/lib/ui';
import * as singleSpa from 'single-spa';

export const extensionLoader: ExtensionLoaderFn = loadingFn => {
  const parcels = new Map<string, singleSpa.Parcel>();
  return {
    async load(props: RootExtensionProps, parentName: string) {
      const { domElement, extensionData, logger } = props;
      if (!parcels.get(extensionData.name)) {
        const parcelProps = {
          ...props,
          extensionData,
        };
        if (!domElement) {
          logger.warn(`Not loading extension ${props.name}. domNode not found.`);
          return;
        }

        const rootNodeId = `${extensionData.name}_${parentName}`;
        const rootNode = document.createElement('div');

        if (!domElement.childElementCount || !domElement.children.namedItem(rootNodeId)) {
          rootNode.id = rootNodeId;
          domElement.appendChild(rootNode);
        }

        const parcel = singleSpa.mountRootParcel(loadingFn, {
          ...parcelProps,
          domElement: rootNode,
        });
        parcel.mountPromise.then(() => {
          parcels.set(extensionData.name, parcel);
        });
      }
    },
    async unmount(event: { event: EventTypes; data: EventDataTypes }, _parentName: string) {
      const { name } = event.data;
      if (!parcels.get(name)) return;
      const parcelStatus = await parcels.get(name).getStatus();
      if (parcelStatus === singleSpa.MOUNTED) {
        parcels.get(name).unmount();
        parcels.get(name).unmountPromise.then(async () => {
          parcels.delete(name);
        });
      }
    },
    async update(props: RootExtensionProps, _parentName: string) {
      const name = props.extensionData?.name;
      if (!parcels.get(name)) return;
      const parcelStatus = await parcels.get(name).getStatus();
      if (parcelStatus === singleSpa.MOUNTED) {
        if (typeof parcels.get(name).update === 'function') {
          await parcels.get(name).update(props);
        }
      }
    },
  };
};
