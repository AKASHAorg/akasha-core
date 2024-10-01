import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { isNodeWithId } from './selector-utils';

export const selectBlockData = (data: GetContentBlockByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node;
  }
};

export const selectBlockApp = (data: GetContentBlockByIdQuery) => {
  if (isNodeWithId(data)) {
    return data.node.appVersion.application;
  }
};
