import getSDK from '@akashaorg/awf-sdk';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { GetProfileByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { GetProfileByDidDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ApolloClient } from '@apollo/client';

export class ProfilePlugin {
  private apolloClient: ApolloClient<object>;
  constructor() {
    this.apolloClient = getSDK().services.gql.queryClient;
  }
  getProfileInfo = async (profileDid: string) => {
    const profileQuery = await this.apolloClient.query<GetProfileByDidQuery>({
      query: GetProfileByDidDocument,
      variables: {
        id: profileDid,
      },
    });
    const profileData =
      profileQuery.data?.node && hasOwn(profileQuery.data?.node, 'isViewer')
        ? profileQuery.data.node.akashaProfile
        : null;
    return profileData;
  };
}
