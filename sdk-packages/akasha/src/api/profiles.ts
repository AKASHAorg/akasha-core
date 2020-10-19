import registerProfilesModule from '@akashaproject/sdk-profiles';
import { extractCallableServices } from '../utils';
import { PROFILE_STORE, PROFILE_LEGACY } from '@akashaproject/sdk-profiles/lib/constants';

export const profilesModule = registerProfilesModule();

/**
 *
 * @param channel
 * returns { profiles: { profileService: { store, getProfile }}}
 */
export default function profilesApi(channel) {
  const extractedServices = extractCallableServices(profilesModule, channel);
  return {
    [profilesModule.name]: {
      profileService: {
        getProfile: extractedServices[PROFILE_LEGACY]('getProfile'),
        getProfiles: extractedServices[PROFILE_LEGACY]('getProfiles'),
        getPost: extractedServices[PROFILE_LEGACY]('getPost'),
        getPosts: extractedServices[PROFILE_LEGACY]('getPosts'),
        store: extractedServices[PROFILE_STORE]('store'),
        // // @Todo: implement this on next sprint
        // deleteProfile: async function (profileID: string) {
        //   return Promise.resolve('deleted');
        // },
      },
    },
  };
}
