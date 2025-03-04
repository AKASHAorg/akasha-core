import { GetWorldFullInfoQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export const selectWorldConfigData = (respData: GetWorldFullInfoQuery) => {
  if (respData?.node !== undefined && 'configInfo' in respData.node) {
    return respData?.node?.configInfo?.edges[0]?.node;
  }
};

export const selectWorldMetaInfoData = (respData: GetWorldFullInfoQuery) => {
  if (respData?.node !== undefined && 'metaInfo' in respData.node) {
    return respData?.node?.metaInfo?.edges[0]?.node;
  }
};
