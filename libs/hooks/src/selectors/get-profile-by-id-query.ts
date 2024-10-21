import { GetProfileByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { isNodeWithId } from './selector-utils';

export const selectProfileData = (data: GetProfileByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node;
  }
};
