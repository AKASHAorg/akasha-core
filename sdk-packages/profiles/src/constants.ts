import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const PROFILE_STORE = 'PROFILE_STORE';
export interface LinkedProperty {
  provider: string;
  property: string;
  value: string;
}
export interface ProfileStore {
  avatar?: LinkedProperty;
  name?: LinkedProperty;
  description?: LinkedProperty;
  coverImage?: LinkedProperty;
  userName?: LinkedProperty;
  url?: LinkedProperty;
}
export interface LinkedProfileProp {
  field: keyof ProfileStore;
  data: LinkedProperty;
}
export const moduleName = 'profiles';
const servicePath = buildServicePath(moduleName);

const services: IAkashaModuleServices = {
  [PROFILE_STORE]: servicePath(PROFILE_STORE),
};

export default services;
