import {
  ExtensionLoaderFn,
  RootExtensionProps,
  EventDataTypes,
  EventTypes,
} from '@akashaorg/typings/lib/ui';
import * as singleSpa from 'single-spa';

export const extensionLoader: ExtensionLoaderFn = loadingFn => {
  const parcels: Record<string, singleSpa.Parcel> = {};
  const unmountingParcels = new Set<string>();
  return {
    load(props: RootExtensionProps, parentName: string) {
      const { domElement, extensionData, logger } = props;
      const parcelProps = {
        ...props,
        // @TODO: refactor this. App-loader should not alter extension data!
        extensionData: {
          ...extensionData,
          itemType:
            // Make sure that itemType coming from extensionData is the correct type `EntityTypes`
            // as it will be stringified when passed to the extension by navigateToModal
            extensionData.itemType === undefined ? undefined : +extensionData.itemType,
        },
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

      if (unmountingParcels.has(extensionData.name)) {
        // Parcel was marked for unmounting, unmount it now to avoid
        // weird behaviour
        parcels[extensionData.name].unmount();
        parcels[extensionData.name].unmountPromise.then(() => {
          parcels[extensionData.name].mount();
          unmountingParcels.delete(extensionData.name);
          return;
        });
      }
      const parcel = singleSpa.mountRootParcel(loadingFn, {
        ...parcelProps,
        domElement: rootNode,
      });
      parcel.mountPromise.then(() => {
        parcels[extensionData.name] = parcel;
      });
    },
    // the unload does not work properly
    // TODO: refactor the unloading logic
    async unload(event: { event: EventTypes; data: EventDataTypes }, _parentName: string) {
      const { name } = event.data;
      if (parcels[name] && parcels[name].getStatus() === singleSpa.MOUNTED) {
        unmountingParcels.add(name);
      }
    },
  };
};
