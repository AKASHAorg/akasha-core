import { GetWorldMetaInfoQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export const selectWorldMetaInfoData = (respData: GetWorldMetaInfoQuery) => {
  if (respData?.node !== undefined && 'akashaWorldMetaInfo' in respData.node) {
    return respData?.node?.akashaWorldMetaInfo;
  }
};
