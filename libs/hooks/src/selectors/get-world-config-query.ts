import { GetWorldConfigQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { AkashaWorldConfigEdge, PageInfo } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const isWorldConfigEdgeNode = (
  data: GetWorldConfigQuery,
): data is { akashaWorldConfigIndex: { edges: AkashaWorldConfigEdge[]; pageInfo: PageInfo } } => {
  return (
    data &&
    'akashaWorldConfigIndex' in data &&
    typeof data['akashaWorldConfigIndex'] === 'object' &&
    'edges' in data.akashaWorldConfigIndex &&
    Array.isArray(data.akashaWorldConfigIndex.edges)
  );
};

export const selectWorldConfigData = (respData: GetWorldConfigQuery) => {
  if (isWorldConfigEdgeNode(respData)) {
    return respData.akashaWorldConfigIndex.edges[0]?.node;
  }
};
