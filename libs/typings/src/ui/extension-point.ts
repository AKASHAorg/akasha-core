import { ParcelConfigObject } from 'single-spa';
import { ExtensionActivity } from './app-loader';

/**
 * Type defining configuration object for loading an extension point
 **/
export type ExtensionPointInterface = {
  mountsIn: string;
  activeWhen?: ExtensionActivity;
  loadingFn: () => Promise<ParcelConfigObject>;
};

/**
 * Interface defining an extension point state store defined as a plugin
 **/
export interface IExtensionPointStorePlugin {
  getExtensionPoints: () => ExtensionPointInterface[];
  getMatchingExtensions: (
    slotName: string,
    location: Location,
  ) => (ExtensionPointInterface & { appName: string })[];
}
