import getSdk from '@akashaorg/core-sdk';
import { GetAppsDocument } from '@akashaorg/ui-awf-hooks/lib/generated';
import { GetAppsQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export const getExtensionById = async (decodedExtName: string) => {
  const { apolloClient } = getSdk().services.gql;
  const result = await apolloClient.query<GetAppsQuery>({
    query: GetAppsDocument,
    variables: {
      first: 1,
      filters: { where: { name: { equalTo: decodedExtName } } },
    },
  });
  return result.data;
};
