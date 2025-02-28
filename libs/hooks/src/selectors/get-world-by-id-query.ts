import { GetWorldByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { isNodeWithId } from './selector-utils';

export const selectWorldData = (respData: GetWorldByIdQuery) => {
  if (isNodeWithId(respData)) {
    return respData.node;
  }
};
