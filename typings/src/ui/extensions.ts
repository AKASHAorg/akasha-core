import { Profile } from './profile';
import { ParcelConfigObject } from 'single-spa';
import { ActivityFn } from './app-loader';

export type Developer = {
  profileId: Profile['did']['id'];
} & Pick<Profile, 'avatar' | 'name'>;

export const enum ExtensionEvents {
  RegisterExtension = 'register-extension',
}

export type ExtensionInterface = {
  mountsIn: string;
  activeWhen?: ActivityFn;
  loadingFn: () => Promise<ParcelConfigObject>;
};

export type ExtensionRegisterEvent = {
  event: ExtensionEvents.RegisterExtension;
  data?: (ExtensionInterface & { appName: string })[];
};

export interface ExtensionStorePlugin {
  getExtensions: () => ExtensionInterface[];
  getMatchingExtensions: (
    slotName: string,
    location: Location,
  ) => (ExtensionInterface & { appName: string })[];
}
