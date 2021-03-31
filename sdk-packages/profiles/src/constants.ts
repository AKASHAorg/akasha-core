import { IAkashaModuleServices } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { buildServicePath } from '@akashaproject/sdk-core/lib/utils';

export const PROFILE_STORE = 'PROFILE_STORE';
export const PROFILE_LEGACY = 'PROFILE_LEGACY';
const suffix = process.env.NODE_ENV === 'development' ? '-dev' : '-prod';
const bucketVersion = process.env.BUCKET_VERSION;
export const PROFILE_MEDIA_FILES = `awf-media-upload${suffix}${bucketVersion}`;
export const BUCKET_THREAD_NAME = `ewa-bucket${suffix}${bucketVersion}`;
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
  [PROFILE_LEGACY]: servicePath(PROFILE_LEGACY),
};

export default services;
