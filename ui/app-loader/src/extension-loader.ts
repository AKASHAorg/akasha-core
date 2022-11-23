import {
  UIEventData,
  ExtensionLoaderFn,
  RootExtensionProps,
  EntityTypes,
} from '@akashaorg/typings/ui';
import * as singleSpa from 'single-spa';

export const extensionLoader: ExtensionLoaderFn = loadingFn => {
  const parcels: Record<string, singleSpa.Parcel> = {};
  return {
    load(props: RootExtensionProps, parentName: string) {
      const { domElement } = props;
      if (!domElement) {
        props.logger.warn(`Not loading extension ${props.name}. domNode not found.`);
        return;
      }
      const rootNodeId = `${props.extensionData.name}_${parentName}`;
      // TODO: can this fail?
      const rootNode = document.createElement('div');
      if (
        !domElement.children.length ||
        !Array.from(domElement.children).find(child => child.id === rootNodeId)
      ) {
        rootNode.id = rootNodeId;
        try {
          domElement.appendChild(rootNode);
          const parcel = singleSpa.mountRootParcel(loadingFn, {
            ...{
              ...props,
              extensionData: {
                ...props.extensionData,
                itemType:
                  // Make sure that itemType coming from extensionData is the correct type `EntityTypes`
                  // as it will be stringified when passed to the extension by navigateToModal
                  props.extensionData.itemType === undefined
                    ? undefined
                    : +props.extensionData.itemType,
              },
            },
            domElement: rootNode,
          });
          parcels[props.extensionData.name] = parcel;
        } catch (err) {
          props.logger.error(
            `Failed to mount extension of app: ${props.extensionData.name} Error: ${err}`,
          );
        }
      }
    },
    async unload(event: UIEventData, parentName: string) {
      if (parcels[event.data.name]) {
        // do not wait for unmount
        await parcels[event.data.name].unmount();
        delete parcels[event.data.name];
        const rootNode = document.getElementById(`${event.data.name}_${parentName}`);
        if (rootNode) {
          rootNode.remove();
        }
      }
    },
  };
};
