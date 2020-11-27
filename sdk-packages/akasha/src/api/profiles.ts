import registerProfilesModule from '@akashaproject/sdk-profiles';
import { extractCallableServices } from '../utils';
import { PROFILE_STORE, PROFILE_LEGACY } from '@akashaproject/sdk-profiles/lib/constants';

export const profilesModule = registerProfilesModule();

export default function profilesApi(channel) {
  const extractedServices = extractCallableServices(profilesModule, channel);
  return {
    [profilesModule.name]: {
      profileService: {
        getProfileLegacy: extractedServices[PROFILE_LEGACY]('getProfile'),
        getProfilesLegacy: extractedServices[PROFILE_LEGACY]('getProfiles'),
        getPostLegacy: extractedServices[PROFILE_LEGACY]('getPost'),
        getPosts: extractedServices[PROFILE_LEGACY]('getPosts'),
        getProfile: extractedServices[PROFILE_STORE]('getProfile'),
        registerUserName: extractedServices[PROFILE_STORE]('registerUserName'),
        addProfileProvider: extractedServices[PROFILE_STORE]('addProfileProvider'),
        saveMediaFile: extractedServices[PROFILE_STORE]('saveMediaFile'),
        makeDefaultProvider: extractedServices[PROFILE_STORE]('makeDefaultProvider'),
        follow: extractedServices[PROFILE_STORE]('follow'),
        unFollow: extractedServices[PROFILE_STORE]('unFollow'),
        isFollowing: extractedServices[PROFILE_STORE]('isFollowing'),
      },
    },
  };
}
