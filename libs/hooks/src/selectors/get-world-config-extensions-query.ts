import { GetWorldConfigExtensionsQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import {
  AkashaWorldConfigExtensionEdge,
  PageInfo,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

const isWorldConfigExtensionsEdgeNode = (
  data: GetWorldConfigExtensionsQuery,
): data is {
  akashaWorldConfigExtensionIndex: { edges: AkashaWorldConfigExtensionEdge[]; pageInfo: PageInfo };
} => {
  return (
    data &&
    'akashaWorldConfigExtensionIndex' in data &&
    typeof data['akashaWorldConfigExtensionIndex'] === 'object' &&
    'edges' in data.akashaWorldConfigExtensionIndex &&
    Array.isArray(data.akashaWorldConfigExtensionIndex.edges)
  );
};

export const selectWorldConfigExtensions = (respData: GetWorldConfigExtensionsQuery) => {
  if (isWorldConfigExtensionsEdgeNode(respData)) {
    return respData.akashaWorldConfigExtensionIndex.edges.map(edge => edge?.node);
  }
};
