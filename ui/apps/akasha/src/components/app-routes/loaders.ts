import { GetProfileByDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { RouterContext } from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { GetProfileByDidDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export async function getAuthenticatedProfile({ authenticatedDID, apolloClient }: RouterContext) {
  if (!authenticatedDID) return null;
  const response = await apolloClient.query<GetProfileByDidQuery>({
    query: GetProfileByDidDocument,
    variables: {
      id: authenticatedDID,
    },
  });
  if (response.data?.node && hasOwn(response.data.node, 'akashaProfile'))
    return response.data.node?.akashaProfile;
}
