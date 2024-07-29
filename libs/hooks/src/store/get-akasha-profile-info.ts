import getSDK from '@akashaorg/awf-sdk';
import { GetProfileByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { GetProfileByDidDocument } from '../generated';
import { hasOwn } from '../utils/has-own';

//Fallback function that fetches AKASHA profile info if a profile plugin isn't available
export async function getAkashaProfileInfo({ profileDID }) {
  const profileQuery = await getSDK().services.gql.queryClient.query<GetProfileByDidQuery>({
    query: GetProfileByDidDocument,
    variables: {
      id: profileDID,
    },
    fetchPolicy: 'cache-first',
  });
  const error = JSON.stringify(profileQuery.errors?.map(error => error.message));
  const profileData =
    profileQuery.data?.node && hasOwn(profileQuery.data?.node, 'isViewer')
      ? profileQuery.data.node.akashaProfile
      : null;

  return { data: profileData, error };
}
