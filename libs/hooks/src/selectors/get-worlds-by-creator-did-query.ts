import { GetWorldsByCreatorDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { AkashaWorldEdge } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { isNodeObject } from './selector-utils';

const isEdgeList = (
  resp: GetWorldsByCreatorDidQuery,
): resp is { node: { akashaWorldList: { edges: AkashaWorldEdge[] } } } => {
  return (
    resp?.node !== undefined &&
    'akashaWorldList' in resp.node &&
    resp?.node.akashaWorldList.edges !== undefined &&
    Array.isArray(resp?.node.akashaWorldList.edges)
  );
};

export const selectWorlds = (respData: GetWorldsByCreatorDidQuery) => {
  if (isEdgeList(respData)) {
    return respData.node.akashaWorldList.edges.map(edge => edge?.node);
  }
};

export const selectWorldData = (respData: GetWorldsByCreatorDidQuery) => {
  if (isEdgeList(respData)) {
    return respData.node.akashaWorldList.edges[0]?.node;
  }
};
