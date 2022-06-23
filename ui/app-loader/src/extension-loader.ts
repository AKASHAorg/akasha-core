import { RootExtensionProps } from '@akashaorg/ui-awf-typings';
import { UIEventData, ExtensionLoaderFn } from '@akashaorg/ui-awf-typings/lib/app-loader';
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
      const rootNode = document.createElement('div');
      if (
        !domElement.children.length ||
        !Array.from(domElement.children).find(child => child.id === rootNodeId)
      ) {
        rootNode.id = rootNodeId;
        domElement.appendChild(rootNode);
        const parcel = singleSpa.mountRootParcel(loadingFn, {
          ...props,
          domElement: rootNode,
        });
        parcels[props.extensionData.name] = parcel;
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
