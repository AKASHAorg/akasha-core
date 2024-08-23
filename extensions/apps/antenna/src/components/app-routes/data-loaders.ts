import getSDK from '@akashaorg/core-sdk';
import {
  GetBeamByIdQuery,
  GetBeamStreamQuery,
  GetReflectionByIdQuery,
  GetReflectionStreamQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { IRouterContext } from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import {
  GetBeamByIdDocument,
  GetBeamStreamDocument,
  GetReflectionByIdDocument,
  GetReflectionStreamDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export async function getBeamById({ apolloClient, beamId }: IRouterContext & { beamId: string }) {
  const { data } = await apolloClient.query<GetBeamByIdQuery>({
    query: GetBeamByIdDocument,
    variables: { id: beamId },
    fetchPolicy: 'cache-first',
  });
  return data;
}

export async function getBeamStreamById({
  apolloClient,
  beamId,
}: IRouterContext & { beamId: string }) {
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
}: IRouterContext & { reflectionId: string }) {
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

export function getBeamActive(beamStream: GetBeamStreamQuery) {
  if (
    beamStream?.node &&
    hasOwn(beamStream.node, 'akashaBeamStreamList') &&
    beamStream.node.akashaBeamStreamList.edges?.[0]?.node &&
    hasOwn(beamStream.node.akashaBeamStreamList.edges[0].node, 'active')
  ) {
    return beamStream.node.akashaBeamStreamList.edges[0].node.active;
  }
  return null;
}

export function getBeamData(beamByIdQuery: GetBeamByIdQuery) {
  if (beamByIdQuery?.node && hasOwn(beamByIdQuery.node, 'id')) {
    return beamByIdQuery?.node;
  }
  return null;
}

export function getReflectionData(reflectionByIdQuery: GetReflectionByIdQuery) {
  if (
    reflectionByIdQuery &&
    hasOwn(reflectionByIdQuery, 'node') &&
    hasOwn(reflectionByIdQuery.node, 'id')
  ) {
    return reflectionByIdQuery.node;
  }
  return null;
}

export async function getReflectionStreamById({
  apolloClient,
  reflectionId,
}: IRouterContext & { reflectionId: string }) {
  const sdk = getSDK();
  const { data } = await apolloClient.query<GetReflectionStreamQuery>({
    query: GetReflectionStreamDocument,
    variables: {
      first: 1,
      indexer: sdk.services.gql.indexingDID,
      filters: { where: { reflectionID: { equalTo: reflectionId } } },
    },
    fetchPolicy: 'cache-first',
  });
  return data;
}

export function getReflectionActive(reflectionStream: GetReflectionStreamQuery) {
  if (
    reflectionStream?.node &&
    hasOwn(reflectionStream.node, 'akashaReflectStreamList') &&
    reflectionStream.node.akashaReflectStreamList.edges?.[0]?.node &&
    hasOwn(reflectionStream.node.akashaReflectStreamList.edges[0].node, 'active')
  ) {
    return reflectionStream.node.akashaReflectStreamList.edges[0].node.active;
  }
  return null;
}
