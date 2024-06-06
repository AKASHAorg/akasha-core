import getSDK from '@akashaorg/awf-sdk';
import {
  GetBeamByIdQuery,
  GetBeamStreamQuery,
  GetReflectionByIdQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { RouterContext } from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import {
  GetBeamByIdDocument,
  GetBeamStreamDocument,
  GetReflectionByIdDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export async function getBeamById({ apolloClient, beamId }: RouterContext & { beamId: string }) {
  const { data } = await apolloClient.query<GetBeamByIdQuery>({
    query: GetBeamByIdDocument,
    variables: { id: beamId },
    fetchPolicy: 'cache-first',
  });
  return data;
}

export async function getBeamStreamId({
  apolloClient,
  beamId,
}: RouterContext & { beamId: string }) {
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

export function getBeamStatus(beamStream: GetBeamStreamQuery) {
  if (
    beamStream?.node &&
    hasOwn(beamStream.node, 'akashaBeamStreamList') &&
    beamStream.node.akashaBeamStreamList.edges?.[0]?.node &&
    hasOwn(beamStream.node.akashaBeamStreamList.edges[0].node, 'status')
  ) {
    return beamStream.node.akashaBeamStreamList.edges[0].node.status;
  }
  return null;
}

export function getBeamData(beamById: GetBeamByIdQuery) {
  if (beamById?.node && hasOwn(beamById.node, 'id')) {
    return beamById?.node;
  }
  return null;
}
