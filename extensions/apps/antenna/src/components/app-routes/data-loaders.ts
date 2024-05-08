import getSDK from '@akashaorg/awf-sdk';
import {
  GetBeamByIdQuery,
  GetBeamStreamQuery,
  GetProfileByDidQuery,
  GetReflectionByIdQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { RouterContext } from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import {
  GetProfileByDidDocument,
  GetBeamByIdDocument,
  GetBeamStreamDocument,
  GetReflectionByIdDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export async function getAuthenticatedProfile({ authenticatedDID, apolloClient }: RouterContext) {
  if (!authenticatedDID) return null;
  const { data } = await apolloClient.query<GetProfileByDidQuery>({
    query: GetProfileByDidDocument,
    variables: {
      id: authenticatedDID,
    },
  });
  if (data?.node && hasOwn(data.node, 'akashaProfile')) return data.node?.akashaProfile;
}

export async function getBeamById({ apolloClient, beamId }: RouterContext & { beamId: string }) {
  const { data } = await apolloClient.query<GetBeamByIdQuery>({
    query: GetBeamByIdDocument,
    variables: { id: beamId },
    fetchPolicy: 'cache-first',
  });
  return data;
}

export async function getBeamStream({ apolloClient, beamId }: RouterContext & { beamId: string }) {
  const sdk = getSDK();
  const { data } = await apolloClient.query<GetBeamStreamQuery>({
    query: GetBeamStreamDocument,
    variables: {
      first: 1,
      indexer: sdk.services.gql.indexingDID,
      filters: { where: { beamID: { equalTo: beamId } } },
    },
    fetchPolicy: 'cache-first',
  });
  return data;
}

export async function getReflectionById({
  apolloClient,
  reflectionId,
}: RouterContext & { reflectionId: string }) {
  const { data } = await apolloClient.query<GetReflectionByIdQuery>({
    query: GetReflectionByIdDocument,
    variables: { id: reflectionId },
    fetchPolicy: 'cache-first',
  });
  return data;
}
