import getSDK from '@akashaorg/awf-sdk';
import { hasOwn, UserStore } from '@akashaorg/ui-awf-hooks';
import { GetProfileByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { GetProfileByDidDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ApolloClient } from '@apollo/client';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';
import { IGetUserInfo } from '@akashaorg/typings/lib/ui/store';

export class ProfilePlugin {
  #apolloClient: ApolloClient<object>;
  constructor() {
    this.#apolloClient = getSDK().services.gql.queryClient;
  }

  /**
   * Fetch AKASHA profile info
   */
  #getProfileInfo = async ({ profileDid }: IGetUserInfo) => {
    try {
      const profileQuery = await this.#apolloClient.query<GetProfileByDidQuery>({
        query: GetProfileByDidDocument,
        variables: {
          id: profileDid,
        },
      });

      if (profileQuery?.errors) {
        throw new Error(JSON.stringify(profileQuery.errors?.map(error => error.message)));
      }

      const profileData =
        profileQuery.data?.node && hasOwn(profileQuery.data?.node, 'isViewer')
          ? profileQuery.data.node.akashaProfile
          : null;

      return profileData;
    } catch (error) {
      throw new Error((error as unknown as Error).message);
    }
  };

  /**
   * Get the user store for AKASHA profile app
   */
  get userStore() {
    return UserStore.getInstance<AkashaProfile>(this.#getProfileInfo);
  }
}
