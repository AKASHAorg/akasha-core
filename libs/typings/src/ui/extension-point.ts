import { ParcelConfigObject } from 'single-spa';
import { ActivityFn } from './app-loader';

/**
 * Enum defining events related to loading and unloading of an extension point
 **/
export const enum ExtensionEvents {
  RegisterExtension = 'register-extension',
}

/**
 * Type defining configuration object for loading an extension point
 **/
export type ExtensionInterface = {
  mountsIn: string;
  activeWhen?: ActivityFn;
  loadingFn: () => Promise<ParcelConfigObject>;
};

/**
 * Type defining registration event of an extension point
 **/
export type ExtensionRegisterEvent = {
  event: ExtensionEvents.RegisterExtension;
  data?: (ExtensionInterface & { appName: string })[];
};

/**
 * Interface defining an extension point state store defined as a plugin
 **/
export interface IExtensionStorePlugin {
  getExtensions: () => ExtensionInterface[];
  getMatchingExtensions: (
    slotName: string,
    location: Location,
  ) => (ExtensionInterface & { appName: string })[];
}
