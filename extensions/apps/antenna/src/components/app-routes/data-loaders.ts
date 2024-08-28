import getSDK from '@akashaorg/core-sdk';
import { ApolloError } from '@apollo/client';
import {
  GetBeamByIdQuery,
  GetBeamStreamQuery,
  GetReflectionByIdQuery,
  GetReflectionStreamQuery,
} from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { IRouterContext } from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import {
  GetBeamByIdDocument,
  GetBeamStreamDocument,
  GetReflectionByIdDocument,
  GetReflectionStreamDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

/**
 * Gets beam data by specifying its id in the query's variable
 * @param param0 - an object containing the apolloClient and beamId
 * @returns an object containing the data and error values from the query
 * @example
 * ```typescript
 * const { data, error } = getBeamById({ apolloClient: context.apolloClient, beamId: params.beamId }
 * ```
 */
export async function getBeamById({
  apolloClient,
  beamId,
}: IRouterContext & { beamId: string }): Promise<{ data: GetBeamByIdQuery; error: ApolloError }> {
  const { data, error } = await apolloClient.query<GetBeamByIdQuery>({
    query: GetBeamByIdDocument,
    variables: { id: beamId },
    fetchPolicy: 'cache-first',
  });
  return { data, error };
}

/**
 * Gets specific beam data from beam stream
 * @param param0 - an object containing the apolloClient and beamId
 * @returns an object containing the data and error values from the query
 * ```typescript
 * const { data, error } = getBeamStreamById({ apolloClient: context.apolloClient, beamId: params.beamId }
 * ```
 */
export async function getBeamStreamById({
  apolloClient,
  beamId,
}: IRouterContext & { beamId: string }): Promise<{ data: GetBeamStreamQuery; error: ApolloError }> {
  const sdk = getSDK();
  const { data, error } = await apolloClient.query<GetBeamStreamQuery>({
    query: GetBeamStreamDocument,
    variables: {
      first: 1,
      indexer: sdk.services.gql.indexingDID,
      filters: { where: { beamID: { equalTo: beamId } } },
    },
    fetchPolicy: 'cache-first',
  });
  return { data, error };
}

/**
 * Extracts beam data from the returned query result
 * @param beamByIdQuery - query response data
 * @returns an object containing the beam
 * @example
 * ```typescript
 * const beamData:GetBeamByIdQuery = useGetBeamByIdQuery(...variables)
 * const beamNode:GetBeamByIdQuery['node'] = selectBeamNode(beamData)
 * ```
 */
export function selectBeamNode(beamByIdQuery: GetBeamByIdQuery) {
  if (beamByIdQuery?.node && hasOwn(beamByIdQuery.node, 'id')) {
    return beamByIdQuery?.node;
  }
}

/**
 * Extracts the moderation status of a beam from a beam stream list
 * @param beamStream - query response data
 * @returns boolean value of the status
 * @example
 * ```typescript
 * const beamStream:GetBeamStreamQuery = useGetBeamStreamQuery(...variables)
 * const beamStatus: AkashaBeamStreamModerationStatus = selectBeamStatusField(beamStream)
 * ```
 */
export function selectBeamStatusField(
  beamStream: GetBeamStreamQuery,
): AkashaBeamStreamModerationStatus {
  if (
    beamStream?.node &&
    hasOwn(beamStream.node, 'akashaBeamStreamList') &&
    beamStream.node.akashaBeamStreamList.edges?.[0]?.node &&
    hasOwn(beamStream.node.akashaBeamStreamList.edges[0].node, 'status')
  ) {
    return beamStream.node.akashaBeamStreamList.edges[0].node.status;
  }
}

/**
 * Extracts the active status of a beam from a beam stream list
 * @param streamData - query response data
 * @returns boolean value of the status
 * @example
 * ```typescript
 * const beamStream:GetBeamStreamQuery = useGetBeamStreamQuery(...variables)
 * const beamActive: boolean = selectBeamActiveField(beamStream)
 * ```
 */
export function selectBeamActiveField(streamData: GetBeamStreamQuery) {
  return (
    streamData?.node &&
    hasOwn(streamData.node, 'akashaBeamStreamList') &&
    streamData.node.akashaBeamStreamList.edges?.[0]?.node?.active
  );
}

/**
 * Gets reflection data by specifying its id in the query's variable
 * @param param0 - an object containing the apolloClient and reflectionId
 * @returns an object containing the data and error values from the query
 * @example
 * ```typescript
 * const { data, error} = getReflectionById({ apolloClient: context.apolloClient, reflectionId: params.reflectionId }
 * ```
 */
export async function getReflectionById({
  apolloClient,
  reflectionId,
}: IRouterContext & { reflectionId: string }): Promise<{
  data: GetReflectionByIdQuery;
  error: ApolloError;
}> {
  const { data, error } = await apolloClient.query<GetReflectionByIdQuery>({
    query: GetReflectionByIdDocument,
    variables: { id: reflectionId },
    fetchPolicy: 'cache-first',
  });
  return { data, error };
}

/**
 * Gets specific reflection data from reflection stream
 * @param param0 - an object containing the apolloClient and reflectionId
 * @returns an object containing the data and error values from the query
 * ```typescript
 * const { data, error } = getReflectionStreamById({ apolloClient: context.apolloClient, reflectionId: params.reflectionId }
 * ```
 */
export async function getReflectionStreamById({
  apolloClient,
  reflectionId,
}: IRouterContext & { reflectionId: string }): Promise<{
  data: GetReflectionStreamQuery;
  error: ApolloError;
}> {
  const sdk = getSDK();
  const { data, error } = await apolloClient.query<GetReflectionStreamQuery>({
    query: GetReflectionStreamDocument,
    variables: {
      first: 1,
      indexer: sdk.services.gql.indexingDID,
      filters: { where: { reflectionID: { equalTo: reflectionId } } },
    },
    fetchPolicy: 'cache-first',
  });
  return { data, error };
}

/**
 * Extracts reflection data from the returned query result
 * @param reflectionByIdQuery - query response data
 * @returns an object containing the reflection
 * @example
 * ```typescript
 * const reflectionData:GetReflectionByIdQuery = useGetReflectionByIdQuery(...variables)
 * const reflectionNode:GetReflectionByIdQuery['node'] = selectReflectionNode(reflectionData)
 * ```
 */
export function selectReflectionNode(reflectionByIdQuery: GetReflectionByIdQuery) {
  if (
    reflectionByIdQuery &&
    hasOwn(reflectionByIdQuery, 'node') &&
    hasOwn(reflectionByIdQuery.node, 'id')
  ) {
    return reflectionByIdQuery.node;
  }
}

/**
 * Extracts the active status of a reflection from a reflection stream list
 * @param streamData - query response data
 * @returns boolean value of the status
 * @example
 * ```typescript
 * const reflectionStream:GetReflectionStreamQuery = useGetReflectionStreamQuery(...variables)
 * const reflectionActive: boolean = selectReflectionActiveField(reflectionStream)
 * ```
 */
export function selectReflectionActiveField(streamData: GetReflectionStreamQuery) {
  return (
    streamData?.node &&
    hasOwn(streamData.node, 'akashaReflectStreamList') &&
    streamData.node.akashaReflectStreamList?.edges?.[0].node?.active
  );
}
