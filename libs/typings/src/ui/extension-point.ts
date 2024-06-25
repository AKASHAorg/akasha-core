import { Profile } from './profile';
import { ParcelConfigObject } from 'single-spa';
import { ActivityFn } from './app-loader';

/**
 * Type defining info about developer of an extension
 */
export type Developer = {
  profileId: Profile['did']['id'];
} & Pick<Profile, 'avatar' | 'name'>;

/**
 * Enum defining events related to loading and unloading of an extension point
 **/
export const enum ExtensionEvents {
  RegisterExtension = 'register-extension',
}

/**
 * Type defining an extension point loading configuration object
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
export interface ExtensionStorePlugin {
  getExtensions: () => ExtensionInterface[];
  getMatchingExtensions: (
    slotName: string,
    location: Location,
  ) => (ExtensionInterface & { appName: string })[];
}
