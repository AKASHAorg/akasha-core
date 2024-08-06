import { ParcelConfigObject } from 'single-spa';
import { ExtensionActivity } from './app-loader';

/**
 * Enum defining events related to loading and unloading of an extension point
 **/
export const enum ExtensionPointEvents {
  RegisterExtensionPoint = 'register-extension-point',
}

/**
 * Type defining configuration object for loading an extension point
 **/
export type ExtensionPointInterface = {
  mountsIn: string;
  activeWhen?: ExtensionActivity;
  loadingFn: () => Promise<ParcelConfigObject>;
};

/**
 * Type defining registration event of an extension point
 **/
export type ExtensionPointRegisterEvent = {
  event: ExtensionPointEvents.RegisterExtensionPoint;
  data?: (ExtensionPointInterface & { appName: string })[];
};

/**
 * Interface defining an extension point state store defined as a plugin
 **/
export interface IExtensionPointStorePlugin {
  getExtensionPoints: () => ExtensionPointInterface[];
  getMatchingExtensionPoints: (
    slotName: string,
    location: Location,
  ) => (ExtensionPointInterface & { appName: string })[];
}
