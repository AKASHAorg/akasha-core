import { UIEventData, ExtensionLoaderFn, RootExtensionProps } from '@akashaorg/typings/ui';
import * as singleSpa from 'single-spa';

export const extensionLoader: ExtensionLoaderFn = loadingFn => {
  const parcels: Record<string, singleSpa.Parcel> = {};
  const unmountingParcels = new Set<string>();
  return {
    load(props: RootExtensionProps, parentName: string) {
      const { domElement } = props;
      const parcelProps = {
        ...props,
        // @TODO: refactor this. App-loader should not alter extension data!
        extensionData: {
          ...props.extensionData,
          itemType:
            // Make sure that itemType coming from extensionData is the correct type `EntityTypes`
            // as it will be stringified when passed to the extension by navigateToModal
            props.extensionData.itemType === undefined ? undefined : +props.extensionData.itemType,
        },
      };
      if (!domElement) {
        props.logger.warn(`Not loading extension ${props.name}. domNode not found.`);
        return;
      }

      const rootNodeId = `${props.extensionData.name}_${parentName}`;
      const rootNode = document.createElement('div');

      if (!domElement.childElementCount || !domElement.children.namedItem(rootNodeId)) {
        rootNode.id = rootNodeId;
        domElement.appendChild(rootNode);
      }

      if (unmountingParcels.has(props.extensionData.name)) {
        // Parcel was marked for unmounting, unmount it now to avoid
        // weird behaviour
        parcels[props.extensionData.name].unmount();
        parcels[props.extensionData.name].unmountPromise.then(() => {
          parcels[props.extensionData.name].mount();
          unmountingParcels.delete(props.extensionData.name);
          return;
        });
      }
      const parcel = singleSpa.mountRootParcel(loadingFn, {
        ...parcelProps,
        domElement: rootNode,
      });
      parcel.mountPromise.then(() => {
        parcels[props.extensionData.name] = parcel;
      });
    },
    // the unload does not work properly
    // TODO: refactor the unloading logic
    async unload(event: UIEventData, _parentName: string) {
      const { name } = event.data;
      if (parcels[name] && parcels[name].getStatus() === singleSpa.MOUNTED) {
        unmountingParcels.add(name);
      }
    },
  };
};
