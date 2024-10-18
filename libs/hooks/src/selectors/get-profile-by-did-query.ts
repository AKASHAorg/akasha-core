import { GetProfileByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { isNodeWithIsViewer } from './selector-utils';

export const selectProfileData = (data: GetProfileByDidQuery) => {
  if (isNodeWithIsViewer(data)) {
    return data.node.akashaProfile;
  }
};
