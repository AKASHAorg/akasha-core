import { GetProfileByDidQueryResult } from '../generated';
import { hasOwn } from '../utils/has-own';

export const selectProfileData = (profileDataReq: GetProfileByDidQueryResult) => {
  if (profileDataReq.data?.node && hasOwn(profileDataReq.data.node, 'akashaProfile')) {
    return profileDataReq.data.node.akashaProfile;
  }
};
