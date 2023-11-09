import type * as Types from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

import { useQuery, useInfiniteQuery, useMutation, type UseQueryOptions, type UseInfiniteQueryOptions, type UseMutationOptions } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';

export function composeDbFetch<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
  const sdk = getSDK();
  return async () => {
   return sdk.services.gql.requester<TData, TVariables>(query, variables, options);
  };
}

export const BeamFragmentDoc = /*#__PURE__*/ `
    fragment BeamFragment on AkashaBeam {
  id
  reflectionsCount
  active
  embeddedBeam {
    label
    embeddedID
  }
  author {
    id
    isViewer
  }
  content {
    blockID
    order
  }
  tags
  version
  createdAt
  nsfw
  reflections(last: 1) {
    edges {
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
    `;
export const ContentBlockFragmentDoc = /*#__PURE__*/ `
    fragment ContentBlockFragment on AkashaContentBlock {
  id
  content {
    propertyType
    value
    label
  }
  active
  appVersion {
    application {
      name
      displayName
      id
    }
    applicationID
    id
    version
  }
  appVersionID
  createdAt
  kind
  author {
    id
    isViewer
  }
  version
  nsfw
}
    `;
export const BlockStorageFragmentDoc = /*#__PURE__*/ `
    fragment BlockStorageFragment on AkashaBlockStorage {
  id
  appVersionID
  appVersion {
    application {
      name
      displayName
      id
    }
    applicationID
    id
    version
  }
  createdAt
  active
  version
  content {
    propertyType
    label
    value
  }
  author {
    id
    isViewer
  }
  blockID
  block {
    id
    active
    author {
      id
      isViewer
    }
  }
}
    `;
export const IndexedBeamFragmentDoc = /*#__PURE__*/ `
    fragment IndexedBeamFragment on IndexBeamPayloadDocument {
  id
  createdAt
  beamID
}
    `;
export const ReflectFragmentDoc = /*#__PURE__*/ `
    fragment ReflectFragment on AkashaReflect {
  id
  author {
    id
    isViewer
  }
  version
  active
  content {
    label
    propertyType
    value
  }
  isReply
  reflection
  createdAt
  beam {
    id
    author {
      id
      isViewer
    }
  }
  nsfw
}
    `;
export const UserProfileFragmentDoc = /*#__PURE__*/ `
    fragment UserProfileFragment on AkashaProfile {
  id
  did {
    id
    isViewer
  }
  name
  links {
    href
    label
  }
  background {
    alternatives {
      src
      width
      height
    }
    default {
      src
      width
      height
    }
  }
  description
  avatar {
    default {
      src
      width
      height
    }
    alternatives {
      src
      width
      height
    }
  }
  followers(last: 5) {
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
  }
  createdAt
  nsfw
}
    `;
export const AkashaAppFragmentDoc = /*#__PURE__*/ `
    fragment AkashaAppFragment on AkashaApp {
  id
  applicationType
  description
  licence
  name
  displayName
  keywords
  releases(last: 5) {
    edges {
      node {
        id
        createdAt
        source
        version
      }
      cursor
    }
  }
  releasesCount
  author {
    id
    isViewer
    akashaProfile {
      ...UserProfileFragment
    }
  }
  contributors {
    id
    isViewer
    akashaProfile {
      ...UserProfileFragment
    }
  }
}
    `;
export const AppReleaseFragmentDoc = /*#__PURE__*/ `
    fragment AppReleaseFragment on AkashaAppRelease {
  application {
    ...AkashaAppFragment
  }
  applicationID
  id
  source
  version
  createdAt
}
    `;
export const GetBeamStreamDocument = /*#__PURE__*/ `
    query GetBeamStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaBeamStreamFiltersInput, $sorting: AkashaBeamStreamSortingInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaBeamStreamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
            beamID
            createdAt
            active
            status
            moderationID
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
      }
      isViewer
    }
  }
}
    `;
export const useGetBeamStreamQuery = <
      TData = Types.GetBeamStreamQuery,
      TError = unknown
    >(
      variables: Types.GetBeamStreamQueryVariables,
      options?: UseQueryOptions<Types.GetBeamStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetBeamStreamQuery, TError, TData>(
      ['GetBeamStream', variables],
      composeDbFetch<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>(GetBeamStreamDocument, variables),
      options
    );
useGetBeamStreamQuery.document = GetBeamStreamDocument;


useGetBeamStreamQuery.getKey = (variables: Types.GetBeamStreamQueryVariables) => ['GetBeamStream', variables];
;

export const useInfiniteGetBeamStreamQuery = <
      TData = Types.GetBeamStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetBeamStreamQueryVariables,
      variables: Types.GetBeamStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetBeamStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetBeamStreamQuery, TError, TData>(
      ['GetBeamStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>(GetBeamStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBeamStreamQuery.getKey = (variables: Types.GetBeamStreamQueryVariables) => ['GetBeamStream.infinite', variables];
;

useGetBeamStreamQuery.fetcher = (variables: Types.GetBeamStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>(GetBeamStreamDocument, variables, options);
export const GetBeamsDocument = /*#__PURE__*/ `
    query GetBeams($after: String, $before: String, $first: Int, $last: Int, $filters: AkashaBeamFiltersInput, $sorting: AkashaBeamSortingInput) {
  akashaBeamIndex(
    after: $after
    before: $before
    first: $first
    last: $last
    filters: $filters
    sorting: $sorting
  ) {
    edges {
      node {
        ...BeamFragment
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${BeamFragmentDoc}`;
export const useGetBeamsQuery = <
      TData = Types.GetBeamsQuery,
      TError = unknown
    >(
      variables?: Types.GetBeamsQueryVariables,
      options?: UseQueryOptions<Types.GetBeamsQuery, TError, TData>
    ) =>
    useQuery<Types.GetBeamsQuery, TError, TData>(
      variables === undefined ? ['GetBeams'] : ['GetBeams', variables],
      composeDbFetch<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, variables),
      options
    );
useGetBeamsQuery.document = GetBeamsDocument;


useGetBeamsQuery.getKey = (variables?: Types.GetBeamsQueryVariables) => variables === undefined ? ['GetBeams'] : ['GetBeams', variables];
;

export const useInfiniteGetBeamsQuery = <
      TData = Types.GetBeamsQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetBeamsQueryVariables,
      variables?: Types.GetBeamsQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetBeamsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetBeamsQuery, TError, TData>(
      variables === undefined ? ['GetBeams.infinite'] : ['GetBeams.infinite', variables],
      (metaData) => composeDbFetch<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBeamsQuery.getKey = (variables?: Types.GetBeamsQueryVariables) => variables === undefined ? ['GetBeams.infinite'] : ['GetBeams.infinite', variables];
;

useGetBeamsQuery.fetcher = (variables?: Types.GetBeamsQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, variables, options);
export const GetBeamsByAuthorDidDocument = /*#__PURE__*/ `
    query GetBeamsByAuthorDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaBeamFiltersInput, $sorting: AkashaBeamSortingInput) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaBeamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
            ...BeamFragment
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      isViewer
    }
  }
}
    ${BeamFragmentDoc}`;
export const useGetBeamsByAuthorDidQuery = <
      TData = Types.GetBeamsByAuthorDidQuery,
      TError = unknown
    >(
      variables: Types.GetBeamsByAuthorDidQueryVariables,
      options?: UseQueryOptions<Types.GetBeamsByAuthorDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetBeamsByAuthorDidQuery, TError, TData>(
      ['GetBeamsByAuthorDid', variables],
      composeDbFetch<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, variables),
      options
    );
useGetBeamsByAuthorDidQuery.document = GetBeamsByAuthorDidDocument;


useGetBeamsByAuthorDidQuery.getKey = (variables: Types.GetBeamsByAuthorDidQueryVariables) => ['GetBeamsByAuthorDid', variables];
;

export const useInfiniteGetBeamsByAuthorDidQuery = <
      TData = Types.GetBeamsByAuthorDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetBeamsByAuthorDidQueryVariables,
      variables: Types.GetBeamsByAuthorDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetBeamsByAuthorDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetBeamsByAuthorDidQuery, TError, TData>(
      ['GetBeamsByAuthorDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBeamsByAuthorDidQuery.getKey = (variables: Types.GetBeamsByAuthorDidQueryVariables) => ['GetBeamsByAuthorDid.infinite', variables];
;

useGetBeamsByAuthorDidQuery.fetcher = (variables: Types.GetBeamsByAuthorDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, variables, options);
export const GetBeamByIdDocument = /*#__PURE__*/ `
    query GetBeamById($id: ID!) {
  node(id: $id) {
    ... on AkashaBeam {
      ...BeamFragment
    }
  }
}
    ${BeamFragmentDoc}`;
export const useGetBeamByIdQuery = <
      TData = Types.GetBeamByIdQuery,
      TError = unknown
    >(
      variables: Types.GetBeamByIdQueryVariables,
      options?: UseQueryOptions<Types.GetBeamByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetBeamByIdQuery, TError, TData>(
      ['GetBeamById', variables],
      composeDbFetch<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, variables),
      options
    );
useGetBeamByIdQuery.document = GetBeamByIdDocument;


useGetBeamByIdQuery.getKey = (variables: Types.GetBeamByIdQueryVariables) => ['GetBeamById', variables];
;

export const useInfiniteGetBeamByIdQuery = <
      TData = Types.GetBeamByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetBeamByIdQueryVariables,
      variables: Types.GetBeamByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetBeamByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetBeamByIdQuery, TError, TData>(
      ['GetBeamById.infinite', variables],
      (metaData) => composeDbFetch<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBeamByIdQuery.getKey = (variables: Types.GetBeamByIdQueryVariables) => ['GetBeamById.infinite', variables];
;

useGetBeamByIdQuery.fetcher = (variables: Types.GetBeamByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, variables, options);
export const GetContentBlockStreamDocument = /*#__PURE__*/ `
    query GetContentBlockStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $beamID: String!) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaContentBlockStreamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: {where: {beamID: {equalTo: $beamID}}}
      ) {
        edges {
          node {
            beamID
            createdAt
            active
            status
            blockID
            moderationID
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
      }
      isViewer
    }
  }
}
    `;
export const useGetContentBlockStreamQuery = <
      TData = Types.GetContentBlockStreamQuery,
      TError = unknown
    >(
      variables: Types.GetContentBlockStreamQueryVariables,
      options?: UseQueryOptions<Types.GetContentBlockStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetContentBlockStreamQuery, TError, TData>(
      ['GetContentBlockStream', variables],
      composeDbFetch<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>(GetContentBlockStreamDocument, variables),
      options
    );
useGetContentBlockStreamQuery.document = GetContentBlockStreamDocument;


useGetContentBlockStreamQuery.getKey = (variables: Types.GetContentBlockStreamQueryVariables) => ['GetContentBlockStream', variables];
;

export const useInfiniteGetContentBlockStreamQuery = <
      TData = Types.GetContentBlockStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetContentBlockStreamQueryVariables,
      variables: Types.GetContentBlockStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetContentBlockStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetContentBlockStreamQuery, TError, TData>(
      ['GetContentBlockStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>(GetContentBlockStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetContentBlockStreamQuery.getKey = (variables: Types.GetContentBlockStreamQueryVariables) => ['GetContentBlockStream.infinite', variables];
;

useGetContentBlockStreamQuery.fetcher = (variables: Types.GetContentBlockStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>(GetContentBlockStreamDocument, variables, options);
export const GetContentBlockByIdDocument = /*#__PURE__*/ `
    query GetContentBlockById($id: ID!) {
  node(id: $id) {
    ... on AkashaContentBlock {
      ...ContentBlockFragment
    }
  }
}
    ${ContentBlockFragmentDoc}`;
export const useGetContentBlockByIdQuery = <
      TData = Types.GetContentBlockByIdQuery,
      TError = unknown
    >(
      variables: Types.GetContentBlockByIdQueryVariables,
      options?: UseQueryOptions<Types.GetContentBlockByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetContentBlockByIdQuery, TError, TData>(
      ['GetContentBlockById', variables],
      composeDbFetch<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>(GetContentBlockByIdDocument, variables),
      options
    );
useGetContentBlockByIdQuery.document = GetContentBlockByIdDocument;


useGetContentBlockByIdQuery.getKey = (variables: Types.GetContentBlockByIdQueryVariables) => ['GetContentBlockById', variables];
;

export const useInfiniteGetContentBlockByIdQuery = <
      TData = Types.GetContentBlockByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetContentBlockByIdQueryVariables,
      variables: Types.GetContentBlockByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetContentBlockByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetContentBlockByIdQuery, TError, TData>(
      ['GetContentBlockById.infinite', variables],
      (metaData) => composeDbFetch<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>(GetContentBlockByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetContentBlockByIdQuery.getKey = (variables: Types.GetContentBlockByIdQueryVariables) => ['GetContentBlockById.infinite', variables];
;

useGetContentBlockByIdQuery.fetcher = (variables: Types.GetContentBlockByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>(GetContentBlockByIdDocument, variables, options);
export const GetBlockStorageByIdDocument = /*#__PURE__*/ `
    query GetBlockStorageById($id: ID!) {
  node(id: $id) {
    ... on AkashaBlockStorage {
      ...BlockStorageFragment
    }
  }
}
    ${BlockStorageFragmentDoc}`;
export const useGetBlockStorageByIdQuery = <
      TData = Types.GetBlockStorageByIdQuery,
      TError = unknown
    >(
      variables: Types.GetBlockStorageByIdQueryVariables,
      options?: UseQueryOptions<Types.GetBlockStorageByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetBlockStorageByIdQuery, TError, TData>(
      ['GetBlockStorageById', variables],
      composeDbFetch<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>(GetBlockStorageByIdDocument, variables),
      options
    );
useGetBlockStorageByIdQuery.document = GetBlockStorageByIdDocument;


useGetBlockStorageByIdQuery.getKey = (variables: Types.GetBlockStorageByIdQueryVariables) => ['GetBlockStorageById', variables];
;

export const useInfiniteGetBlockStorageByIdQuery = <
      TData = Types.GetBlockStorageByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetBlockStorageByIdQueryVariables,
      variables: Types.GetBlockStorageByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetBlockStorageByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetBlockStorageByIdQuery, TError, TData>(
      ['GetBlockStorageById.infinite', variables],
      (metaData) => composeDbFetch<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>(GetBlockStorageByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBlockStorageByIdQuery.getKey = (variables: Types.GetBlockStorageByIdQueryVariables) => ['GetBlockStorageById.infinite', variables];
;

useGetBlockStorageByIdQuery.fetcher = (variables: Types.GetBlockStorageByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>(GetBlockStorageByIdDocument, variables, options);
export const CreateBeamDocument = /*#__PURE__*/ `
    mutation CreateBeam($i: CreateAkashaBeamInput!) {
  createAkashaBeam(input: $i) {
    document {
      ...BeamFragment
    }
    clientMutationId
  }
}
    ${BeamFragmentDoc}`;
export const useCreateBeamMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateBeamMutation, TError, Types.CreateBeamMutationVariables, TContext>) =>
    useMutation<Types.CreateBeamMutation, TError, Types.CreateBeamMutationVariables, TContext>(
      ['CreateBeam'],
      (variables?: Types.CreateBeamMutationVariables) => composeDbFetch<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>(CreateBeamDocument, variables)(),
      options
    );
useCreateBeamMutation.getKey = () => ['CreateBeam'];

useCreateBeamMutation.fetcher = (variables: Types.CreateBeamMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>(CreateBeamDocument, variables, options);
export const UpdateBeamDocument = /*#__PURE__*/ `
    mutation UpdateBeam($i: UpdateAkashaBeamInput!) {
  updateAkashaBeam(input: $i) {
    document {
      ...BeamFragment
    }
    clientMutationId
  }
}
    ${BeamFragmentDoc}`;
export const useUpdateBeamMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateBeamMutation, TError, Types.UpdateBeamMutationVariables, TContext>) =>
    useMutation<Types.UpdateBeamMutation, TError, Types.UpdateBeamMutationVariables, TContext>(
      ['UpdateBeam'],
      (variables?: Types.UpdateBeamMutationVariables) => composeDbFetch<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>(UpdateBeamDocument, variables)(),
      options
    );
useUpdateBeamMutation.getKey = () => ['UpdateBeam'];

useUpdateBeamMutation.fetcher = (variables: Types.UpdateBeamMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>(UpdateBeamDocument, variables, options);
export const CreateContentBlockDocument = /*#__PURE__*/ `
    mutation CreateContentBlock($i: CreateAkashaContentBlockInput!) {
  createAkashaContentBlock(input: $i) {
    document {
      ...ContentBlockFragment
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentDoc}`;
export const useCreateContentBlockMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateContentBlockMutation, TError, Types.CreateContentBlockMutationVariables, TContext>) =>
    useMutation<Types.CreateContentBlockMutation, TError, Types.CreateContentBlockMutationVariables, TContext>(
      ['CreateContentBlock'],
      (variables?: Types.CreateContentBlockMutationVariables) => composeDbFetch<Types.CreateContentBlockMutation, Types.CreateContentBlockMutationVariables>(CreateContentBlockDocument, variables)(),
      options
    );
useCreateContentBlockMutation.getKey = () => ['CreateContentBlock'];

useCreateContentBlockMutation.fetcher = (variables: Types.CreateContentBlockMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateContentBlockMutation, Types.CreateContentBlockMutationVariables>(CreateContentBlockDocument, variables, options);
export const UpdateContentBlockDocument = /*#__PURE__*/ `
    mutation UpdateContentBlock($i: UpdateAkashaContentBlockInput!) {
  updateAkashaContentBlock(input: $i) {
    document {
      ...ContentBlockFragment
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentDoc}`;
export const useUpdateContentBlockMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateContentBlockMutation, TError, Types.UpdateContentBlockMutationVariables, TContext>) =>
    useMutation<Types.UpdateContentBlockMutation, TError, Types.UpdateContentBlockMutationVariables, TContext>(
      ['UpdateContentBlock'],
      (variables?: Types.UpdateContentBlockMutationVariables) => composeDbFetch<Types.UpdateContentBlockMutation, Types.UpdateContentBlockMutationVariables>(UpdateContentBlockDocument, variables)(),
      options
    );
useUpdateContentBlockMutation.getKey = () => ['UpdateContentBlock'];

useUpdateContentBlockMutation.fetcher = (variables: Types.UpdateContentBlockMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateContentBlockMutation, Types.UpdateContentBlockMutationVariables>(UpdateContentBlockDocument, variables, options);
export const IndexBeamDocument = /*#__PURE__*/ `
    mutation IndexBeam($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexBeam(jws: $jws, capability: $capability) {
    document {
      ...IndexedBeamFragment
    }
  }
}
    ${IndexedBeamFragmentDoc}`;
export const useIndexBeamMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.IndexBeamMutation, TError, Types.IndexBeamMutationVariables, TContext>) =>
    useMutation<Types.IndexBeamMutation, TError, Types.IndexBeamMutationVariables, TContext>(
      ['IndexBeam'],
      (variables?: Types.IndexBeamMutationVariables) => composeDbFetch<Types.IndexBeamMutation, Types.IndexBeamMutationVariables>(IndexBeamDocument, variables)(),
      options
    );
useIndexBeamMutation.getKey = () => ['IndexBeam'];

useIndexBeamMutation.fetcher = (variables?: Types.IndexBeamMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.IndexBeamMutation, Types.IndexBeamMutationVariables>(IndexBeamDocument, variables, options);
export const GetReflectionsFromBeamDocument = /*#__PURE__*/ `
    query GetReflectionsFromBeam($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaReflectSortingInput, $filters: AkashaReflectFiltersInput) {
  node(id: $id) {
    ... on AkashaBeam {
      reflections(
        after: $after
        before: $before
        first: $first
        last: $last
        sorting: $sorting
        filters: $filters
      ) {
        edges {
          node {
            ...ReflectFragment
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    ${ReflectFragmentDoc}`;
export const useGetReflectionsFromBeamQuery = <
      TData = Types.GetReflectionsFromBeamQuery,
      TError = unknown
    >(
      variables: Types.GetReflectionsFromBeamQueryVariables,
      options?: UseQueryOptions<Types.GetReflectionsFromBeamQuery, TError, TData>
    ) =>
    useQuery<Types.GetReflectionsFromBeamQuery, TError, TData>(
      ['GetReflectionsFromBeam', variables],
      composeDbFetch<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, variables),
      options
    );
useGetReflectionsFromBeamQuery.document = GetReflectionsFromBeamDocument;


useGetReflectionsFromBeamQuery.getKey = (variables: Types.GetReflectionsFromBeamQueryVariables) => ['GetReflectionsFromBeam', variables];
;

export const useInfiniteGetReflectionsFromBeamQuery = <
      TData = Types.GetReflectionsFromBeamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetReflectionsFromBeamQueryVariables,
      variables: Types.GetReflectionsFromBeamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetReflectionsFromBeamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetReflectionsFromBeamQuery, TError, TData>(
      ['GetReflectionsFromBeam.infinite', variables],
      (metaData) => composeDbFetch<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectionsFromBeamQuery.getKey = (variables: Types.GetReflectionsFromBeamQueryVariables) => ['GetReflectionsFromBeam.infinite', variables];
;

useGetReflectionsFromBeamQuery.fetcher = (variables: Types.GetReflectionsFromBeamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, variables, options);
export const GetReflectionsByAuthorDidDocument = /*#__PURE__*/ `
    query GetReflectionsByAuthorDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaReflectFiltersInput, $sorting: AkashaReflectSortingInput) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaReflectList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
            ...ReflectFragment
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      isViewer
    }
  }
}
    ${ReflectFragmentDoc}`;
export const useGetReflectionsByAuthorDidQuery = <
      TData = Types.GetReflectionsByAuthorDidQuery,
      TError = unknown
    >(
      variables: Types.GetReflectionsByAuthorDidQueryVariables,
      options?: UseQueryOptions<Types.GetReflectionsByAuthorDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetReflectionsByAuthorDidQuery, TError, TData>(
      ['GetReflectionsByAuthorDid', variables],
      composeDbFetch<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, variables),
      options
    );
useGetReflectionsByAuthorDidQuery.document = GetReflectionsByAuthorDidDocument;


useGetReflectionsByAuthorDidQuery.getKey = (variables: Types.GetReflectionsByAuthorDidQueryVariables) => ['GetReflectionsByAuthorDid', variables];
;

export const useInfiniteGetReflectionsByAuthorDidQuery = <
      TData = Types.GetReflectionsByAuthorDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetReflectionsByAuthorDidQueryVariables,
      variables: Types.GetReflectionsByAuthorDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetReflectionsByAuthorDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetReflectionsByAuthorDidQuery, TError, TData>(
      ['GetReflectionsByAuthorDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectionsByAuthorDidQuery.getKey = (variables: Types.GetReflectionsByAuthorDidQueryVariables) => ['GetReflectionsByAuthorDid.infinite', variables];
;

useGetReflectionsByAuthorDidQuery.fetcher = (variables: Types.GetReflectionsByAuthorDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, variables, options);
export const GetReflectionStreamDocument = /*#__PURE__*/ `
    query GetReflectionStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaReflectStreamFiltersInput, $sorting: AkashaReflectStreamSortingInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaReflectStreamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
            reflectionID
            moderationID
            beamID
            active
            status
            createdAt
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      isViewer
    }
  }
}
    `;
export const useGetReflectionStreamQuery = <
      TData = Types.GetReflectionStreamQuery,
      TError = unknown
    >(
      variables: Types.GetReflectionStreamQueryVariables,
      options?: UseQueryOptions<Types.GetReflectionStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetReflectionStreamQuery, TError, TData>(
      ['GetReflectionStream', variables],
      composeDbFetch<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>(GetReflectionStreamDocument, variables),
      options
    );
useGetReflectionStreamQuery.document = GetReflectionStreamDocument;


useGetReflectionStreamQuery.getKey = (variables: Types.GetReflectionStreamQueryVariables) => ['GetReflectionStream', variables];
;

export const useInfiniteGetReflectionStreamQuery = <
      TData = Types.GetReflectionStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetReflectionStreamQueryVariables,
      variables: Types.GetReflectionStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetReflectionStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetReflectionStreamQuery, TError, TData>(
      ['GetReflectionStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>(GetReflectionStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectionStreamQuery.getKey = (variables: Types.GetReflectionStreamQueryVariables) => ['GetReflectionStream.infinite', variables];
;

useGetReflectionStreamQuery.fetcher = (variables: Types.GetReflectionStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>(GetReflectionStreamDocument, variables, options);
export const GetReflectionByIdDocument = /*#__PURE__*/ `
    query GetReflectionById($id: ID!) {
  node(id: $id) {
    ... on AkashaReflect {
      ...ReflectFragment
    }
  }
}
    ${ReflectFragmentDoc}`;
export const useGetReflectionByIdQuery = <
      TData = Types.GetReflectionByIdQuery,
      TError = unknown
    >(
      variables: Types.GetReflectionByIdQueryVariables,
      options?: UseQueryOptions<Types.GetReflectionByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetReflectionByIdQuery, TError, TData>(
      ['GetReflectionById', variables],
      composeDbFetch<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>(GetReflectionByIdDocument, variables),
      options
    );
useGetReflectionByIdQuery.document = GetReflectionByIdDocument;


useGetReflectionByIdQuery.getKey = (variables: Types.GetReflectionByIdQueryVariables) => ['GetReflectionById', variables];
;

export const useInfiniteGetReflectionByIdQuery = <
      TData = Types.GetReflectionByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetReflectionByIdQueryVariables,
      variables: Types.GetReflectionByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetReflectionByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetReflectionByIdQuery, TError, TData>(
      ['GetReflectionById.infinite', variables],
      (metaData) => composeDbFetch<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>(GetReflectionByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectionByIdQuery.getKey = (variables: Types.GetReflectionByIdQueryVariables) => ['GetReflectionById.infinite', variables];
;

useGetReflectionByIdQuery.fetcher = (variables: Types.GetReflectionByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>(GetReflectionByIdDocument, variables, options);
export const GetReflectReflectionsDocument = /*#__PURE__*/ `
    query GetReflectReflections($id: String!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaReflectSortingInput) {
  akashaReflectIndex(
    after: $after
    before: $before
    first: $first
    last: $last
    filters: {and: [{where: {reflection: {equalTo: $id}}}, {where: {active: {equalTo: true}}}]}
    sorting: $sorting
  ) {
    edges {
      node {
        ...ReflectFragment
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${ReflectFragmentDoc}`;
export const useGetReflectReflectionsQuery = <
      TData = Types.GetReflectReflectionsQuery,
      TError = unknown
    >(
      variables: Types.GetReflectReflectionsQueryVariables,
      options?: UseQueryOptions<Types.GetReflectReflectionsQuery, TError, TData>
    ) =>
    useQuery<Types.GetReflectReflectionsQuery, TError, TData>(
      ['GetReflectReflections', variables],
      composeDbFetch<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, variables),
      options
    );
useGetReflectReflectionsQuery.document = GetReflectReflectionsDocument;


useGetReflectReflectionsQuery.getKey = (variables: Types.GetReflectReflectionsQueryVariables) => ['GetReflectReflections', variables];
;

export const useInfiniteGetReflectReflectionsQuery = <
      TData = Types.GetReflectReflectionsQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetReflectReflectionsQueryVariables,
      variables: Types.GetReflectReflectionsQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetReflectReflectionsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetReflectReflectionsQuery, TError, TData>(
      ['GetReflectReflections.infinite', variables],
      (metaData) => composeDbFetch<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectReflectionsQuery.getKey = (variables: Types.GetReflectReflectionsQueryVariables) => ['GetReflectReflections.infinite', variables];
;

useGetReflectReflectionsQuery.fetcher = (variables: Types.GetReflectReflectionsQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, variables, options);
export const CreateReflectDocument = /*#__PURE__*/ `
    mutation CreateReflect($i: CreateAkashaReflectInput!) {
  createAkashaReflect(input: $i) {
    document {
      ...ReflectFragment
    }
    clientMutationId
  }
}
    ${ReflectFragmentDoc}`;
export const useCreateReflectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateReflectMutation, TError, Types.CreateReflectMutationVariables, TContext>) =>
    useMutation<Types.CreateReflectMutation, TError, Types.CreateReflectMutationVariables, TContext>(
      ['CreateReflect'],
      (variables?: Types.CreateReflectMutationVariables) => composeDbFetch<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>(CreateReflectDocument, variables)(),
      options
    );
useCreateReflectMutation.getKey = () => ['CreateReflect'];

useCreateReflectMutation.fetcher = (variables: Types.CreateReflectMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>(CreateReflectDocument, variables, options);
export const UpdateAkashaReflectDocument = /*#__PURE__*/ `
    mutation UpdateAkashaReflect($i: UpdateAkashaReflectInput!) {
  updateAkashaReflect(input: $i) {
    document {
      ...ReflectFragment
    }
    clientMutationId
  }
}
    ${ReflectFragmentDoc}`;
export const useUpdateAkashaReflectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateAkashaReflectMutation, TError, Types.UpdateAkashaReflectMutationVariables, TContext>) =>
    useMutation<Types.UpdateAkashaReflectMutation, TError, Types.UpdateAkashaReflectMutationVariables, TContext>(
      ['UpdateAkashaReflect'],
      (variables?: Types.UpdateAkashaReflectMutationVariables) => composeDbFetch<Types.UpdateAkashaReflectMutation, Types.UpdateAkashaReflectMutationVariables>(UpdateAkashaReflectDocument, variables)(),
      options
    );
useUpdateAkashaReflectMutation.getKey = () => ['UpdateAkashaReflect'];

useUpdateAkashaReflectMutation.fetcher = (variables: Types.UpdateAkashaReflectMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateAkashaReflectMutation, Types.UpdateAkashaReflectMutationVariables>(UpdateAkashaReflectDocument, variables, options);
export const GetProfileByIdDocument = /*#__PURE__*/ `
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on AkashaProfile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetProfileByIdQuery = <
      TData = Types.GetProfileByIdQuery,
      TError = unknown
    >(
      variables: Types.GetProfileByIdQueryVariables,
      options?: UseQueryOptions<Types.GetProfileByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfileByIdQuery, TError, TData>(
      ['GetProfileByID', variables],
      composeDbFetch<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables),
      options
    );
useGetProfileByIdQuery.document = GetProfileByIdDocument;


useGetProfileByIdQuery.getKey = (variables: Types.GetProfileByIdQueryVariables) => ['GetProfileByID', variables];
;

export const useInfiniteGetProfileByIdQuery = <
      TData = Types.GetProfileByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfileByIdQueryVariables,
      variables: Types.GetProfileByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfileByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetProfileByIdQuery, TError, TData>(
      ['GetProfileByID.infinite', variables],
      (metaData) => composeDbFetch<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfileByIdQuery.getKey = (variables: Types.GetProfileByIdQueryVariables) => ['GetProfileByID.infinite', variables];
;

useGetProfileByIdQuery.fetcher = (variables: Types.GetProfileByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables, options);
export const GetProfileByDidDocument = /*#__PURE__*/ `
    query GetProfileByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaProfile {
        ...UserProfileFragment
      }
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetProfileByDidQuery = <
      TData = Types.GetProfileByDidQuery,
      TError = unknown
    >(
      variables: Types.GetProfileByDidQueryVariables,
      options?: UseQueryOptions<Types.GetProfileByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfileByDidQuery, TError, TData>(
      ['GetProfileByDid', variables],
      composeDbFetch<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables),
      options
    );
useGetProfileByDidQuery.document = GetProfileByDidDocument;


useGetProfileByDidQuery.getKey = (variables: Types.GetProfileByDidQueryVariables) => ['GetProfileByDid', variables];
;

export const useInfiniteGetProfileByDidQuery = <
      TData = Types.GetProfileByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfileByDidQueryVariables,
      variables: Types.GetProfileByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfileByDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetProfileByDidQuery, TError, TData>(
      ['GetProfileByDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfileByDidQuery.getKey = (variables: Types.GetProfileByDidQueryVariables) => ['GetProfileByDid.infinite', variables];
;

useGetProfileByDidQuery.fetcher = (variables: Types.GetProfileByDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables, options);
export const GetProfileStatsByDidDocument = /*#__PURE__*/ `
    query GetProfileStatsByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaProfile {
        ...UserProfileFragment
        followersCount(filters: {where: {isFollowing: {equalTo: true}}}, account: $id)
      }
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetProfileStatsByDidQuery = <
      TData = Types.GetProfileStatsByDidQuery,
      TError = unknown
    >(
      variables: Types.GetProfileStatsByDidQueryVariables,
      options?: UseQueryOptions<Types.GetProfileStatsByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfileStatsByDidQuery, TError, TData>(
      ['GetProfileStatsByDid', variables],
      composeDbFetch<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>(GetProfileStatsByDidDocument, variables),
      options
    );
useGetProfileStatsByDidQuery.document = GetProfileStatsByDidDocument;


useGetProfileStatsByDidQuery.getKey = (variables: Types.GetProfileStatsByDidQueryVariables) => ['GetProfileStatsByDid', variables];
;

export const useInfiniteGetProfileStatsByDidQuery = <
      TData = Types.GetProfileStatsByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfileStatsByDidQueryVariables,
      variables: Types.GetProfileStatsByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfileStatsByDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetProfileStatsByDidQuery, TError, TData>(
      ['GetProfileStatsByDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>(GetProfileStatsByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfileStatsByDidQuery.getKey = (variables: Types.GetProfileStatsByDidQueryVariables) => ['GetProfileStatsByDid.infinite', variables];
;

useGetProfileStatsByDidQuery.fetcher = (variables: Types.GetProfileStatsByDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>(GetProfileStatsByDidDocument, variables, options);
export const GetProfilesDocument = /*#__PURE__*/ `
    query GetProfiles($after: String, $before: String, $first: Int, $last: Int, $filters: AkashaProfileFiltersInput, $sorting: AkashaProfileSortingInput) {
  akashaProfileIndex(
    after: $after
    before: $before
    first: $first
    last: $last
    filters: $filters
    sorting: $sorting
  ) {
    edges {
      node {
        ...UserProfileFragment
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetProfilesQuery = <
      TData = Types.GetProfilesQuery,
      TError = unknown
    >(
      variables?: Types.GetProfilesQueryVariables,
      options?: UseQueryOptions<Types.GetProfilesQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfilesQuery, TError, TData>(
      variables === undefined ? ['GetProfiles'] : ['GetProfiles', variables],
      composeDbFetch<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables),
      options
    );
useGetProfilesQuery.document = GetProfilesDocument;


useGetProfilesQuery.getKey = (variables?: Types.GetProfilesQueryVariables) => variables === undefined ? ['GetProfiles'] : ['GetProfiles', variables];
;

export const useInfiniteGetProfilesQuery = <
      TData = Types.GetProfilesQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfilesQueryVariables,
      variables?: Types.GetProfilesQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfilesQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetProfilesQuery, TError, TData>(
      variables === undefined ? ['GetProfiles.infinite'] : ['GetProfiles.infinite', variables],
      (metaData) => composeDbFetch<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfilesQuery.getKey = (variables?: Types.GetProfilesQueryVariables) => variables === undefined ? ['GetProfiles.infinite'] : ['GetProfiles.infinite', variables];
;

useGetProfilesQuery.fetcher = (variables?: Types.GetProfilesQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables, options);
export const GetProfileStreamDocument = /*#__PURE__*/ `
    query GetProfileStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaProfileStreamFiltersInput, $sorting: AkashaProfileStreamSortingInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaProfileStreamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
            profileID
            active
            createdAt
            moderationID
            status
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    `;
export const useGetProfileStreamQuery = <
      TData = Types.GetProfileStreamQuery,
      TError = unknown
    >(
      variables: Types.GetProfileStreamQueryVariables,
      options?: UseQueryOptions<Types.GetProfileStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfileStreamQuery, TError, TData>(
      ['GetProfileStream', variables],
      composeDbFetch<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>(GetProfileStreamDocument, variables),
      options
    );
useGetProfileStreamQuery.document = GetProfileStreamDocument;


useGetProfileStreamQuery.getKey = (variables: Types.GetProfileStreamQueryVariables) => ['GetProfileStream', variables];
;

export const useInfiniteGetProfileStreamQuery = <
      TData = Types.GetProfileStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfileStreamQueryVariables,
      variables: Types.GetProfileStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfileStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetProfileStreamQuery, TError, TData>(
      ['GetProfileStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>(GetProfileStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfileStreamQuery.getKey = (variables: Types.GetProfileStreamQueryVariables) => ['GetProfileStream.infinite', variables];
;

useGetProfileStreamQuery.fetcher = (variables: Types.GetProfileStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>(GetProfileStreamDocument, variables, options);
export const GetInterestsDocument = /*#__PURE__*/ `
    query GetInterests($after: String, $before: String, $first: Int, $last: Int) {
  akashaProfileInterestsIndex(
    after: $after
    before: $before
    first: $first
    last: $last
  ) {
    edges {
      node {
        topics {
          value
          labelType
        }
        did {
          id
        }
        id
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;
export const useGetInterestsQuery = <
      TData = Types.GetInterestsQuery,
      TError = unknown
    >(
      variables?: Types.GetInterestsQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsQuery, TError, TData>(
      variables === undefined ? ['GetInterests'] : ['GetInterests', variables],
      composeDbFetch<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables),
      options
    );
useGetInterestsQuery.document = GetInterestsDocument;


useGetInterestsQuery.getKey = (variables?: Types.GetInterestsQueryVariables) => variables === undefined ? ['GetInterests'] : ['GetInterests', variables];
;

export const useInfiniteGetInterestsQuery = <
      TData = Types.GetInterestsQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsQueryVariables,
      variables?: Types.GetInterestsQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetInterestsQuery, TError, TData>(
      variables === undefined ? ['GetInterests.infinite'] : ['GetInterests.infinite', variables],
      (metaData) => composeDbFetch<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsQuery.getKey = (variables?: Types.GetInterestsQueryVariables) => variables === undefined ? ['GetInterests.infinite'] : ['GetInterests.infinite', variables];
;

useGetInterestsQuery.fetcher = (variables?: Types.GetInterestsQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables, options);
export const GetInterestsStreamDocument = /*#__PURE__*/ `
    query GetInterestsStream($after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaInterestsStreamSortingInput, $filters: AkashaInterestsStreamFiltersInput) {
  akashaInterestsStreamIndex(
    after: $after
    before: $before
    first: $first
    last: $last
    sorting: $sorting
    filters: $filters
  ) {
    edges {
      node {
        labelType
        value
        active
        createdAt
        id
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;
export const useGetInterestsStreamQuery = <
      TData = Types.GetInterestsStreamQuery,
      TError = unknown
    >(
      variables?: Types.GetInterestsStreamQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsStreamQuery, TError, TData>(
      variables === undefined ? ['GetInterestsStream'] : ['GetInterestsStream', variables],
      composeDbFetch<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, variables),
      options
    );
useGetInterestsStreamQuery.document = GetInterestsStreamDocument;


useGetInterestsStreamQuery.getKey = (variables?: Types.GetInterestsStreamQueryVariables) => variables === undefined ? ['GetInterestsStream'] : ['GetInterestsStream', variables];
;

export const useInfiniteGetInterestsStreamQuery = <
      TData = Types.GetInterestsStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsStreamQueryVariables,
      variables?: Types.GetInterestsStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetInterestsStreamQuery, TError, TData>(
      variables === undefined ? ['GetInterestsStream.infinite'] : ['GetInterestsStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsStreamQuery.getKey = (variables?: Types.GetInterestsStreamQueryVariables) => variables === undefined ? ['GetInterestsStream.infinite'] : ['GetInterestsStream.infinite', variables];
;

useGetInterestsStreamQuery.fetcher = (variables?: Types.GetInterestsStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, variables, options);
export const GetInterestsByDidDocument = /*#__PURE__*/ `
    query GetInterestsByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaProfileInterests {
        topics {
          value
          labelType
        }
        did {
          id
        }
        id
      }
      isViewer
    }
  }
}
    `;
export const useGetInterestsByDidQuery = <
      TData = Types.GetInterestsByDidQuery,
      TError = unknown
    >(
      variables: Types.GetInterestsByDidQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsByDidQuery, TError, TData>(
      ['GetInterestsByDid', variables],
      composeDbFetch<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables),
      options
    );
useGetInterestsByDidQuery.document = GetInterestsByDidDocument;


useGetInterestsByDidQuery.getKey = (variables: Types.GetInterestsByDidQueryVariables) => ['GetInterestsByDid', variables];
;

export const useInfiniteGetInterestsByDidQuery = <
      TData = Types.GetInterestsByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsByDidQueryVariables,
      variables: Types.GetInterestsByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsByDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetInterestsByDidQuery, TError, TData>(
      ['GetInterestsByDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsByDidQuery.getKey = (variables: Types.GetInterestsByDidQueryVariables) => ['GetInterestsByDid.infinite', variables];
;

useGetInterestsByDidQuery.fetcher = (variables: Types.GetInterestsByDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables, options);
export const GetInterestsByIdDocument = /*#__PURE__*/ `
    query GetInterestsById($id: ID!) {
  node(id: $id) {
    ... on AkashaProfileInterests {
      topics {
        value
        labelType
      }
      did {
        id
      }
      id
    }
  }
}
    `;
export const useGetInterestsByIdQuery = <
      TData = Types.GetInterestsByIdQuery,
      TError = unknown
    >(
      variables: Types.GetInterestsByIdQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsByIdQuery, TError, TData>(
      ['GetInterestsById', variables],
      composeDbFetch<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables),
      options
    );
useGetInterestsByIdQuery.document = GetInterestsByIdDocument;


useGetInterestsByIdQuery.getKey = (variables: Types.GetInterestsByIdQueryVariables) => ['GetInterestsById', variables];
;

export const useInfiniteGetInterestsByIdQuery = <
      TData = Types.GetInterestsByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsByIdQueryVariables,
      variables: Types.GetInterestsByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetInterestsByIdQuery, TError, TData>(
      ['GetInterestsById.infinite', variables],
      (metaData) => composeDbFetch<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsByIdQuery.getKey = (variables: Types.GetInterestsByIdQueryVariables) => ['GetInterestsById.infinite', variables];
;

useGetInterestsByIdQuery.fetcher = (variables: Types.GetInterestsByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables, options);
export const GetFollowingListByDidDocument = /*#__PURE__*/ `
    query GetFollowingListByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaFollowSortingInput) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaFollowList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: {where: {isFollowing: {equalTo: true}}}
        sorting: $sorting
      ) {
        edges {
          node {
            id
            isFollowing
            profileID
            profile {
              ...UserProfileFragment
            }
            did {
              id
            }
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetFollowingListByDidQuery = <
      TData = Types.GetFollowingListByDidQuery,
      TError = unknown
    >(
      variables: Types.GetFollowingListByDidQueryVariables,
      options?: UseQueryOptions<Types.GetFollowingListByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetFollowingListByDidQuery, TError, TData>(
      ['GetFollowingListByDid', variables],
      composeDbFetch<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables),
      options
    );
useGetFollowingListByDidQuery.document = GetFollowingListByDidDocument;


useGetFollowingListByDidQuery.getKey = (variables: Types.GetFollowingListByDidQueryVariables) => ['GetFollowingListByDid', variables];
;

export const useInfiniteGetFollowingListByDidQuery = <
      TData = Types.GetFollowingListByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetFollowingListByDidQueryVariables,
      variables: Types.GetFollowingListByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetFollowingListByDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetFollowingListByDidQuery, TError, TData>(
      ['GetFollowingListByDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetFollowingListByDidQuery.getKey = (variables: Types.GetFollowingListByDidQueryVariables) => ['GetFollowingListByDid.infinite', variables];
;

useGetFollowingListByDidQuery.fetcher = (variables: Types.GetFollowingListByDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables, options);
export const GetFollowersListByDidDocument = /*#__PURE__*/ `
    query GetFollowersListByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaFollowSortingInput) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaProfile {
        followers(
          after: $after
          before: $before
          first: $first
          last: $last
          filters: {where: {isFollowing: {equalTo: true}}}
          sorting: $sorting
        ) {
          edges {
            node {
              id
              isFollowing
              profileID
              profile {
                ...UserProfileFragment
              }
              did {
                akashaProfile {
                  ...UserProfileFragment
                }
              }
            }
            cursor
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetFollowersListByDidQuery = <
      TData = Types.GetFollowersListByDidQuery,
      TError = unknown
    >(
      variables: Types.GetFollowersListByDidQueryVariables,
      options?: UseQueryOptions<Types.GetFollowersListByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetFollowersListByDidQuery, TError, TData>(
      ['GetFollowersListByDid', variables],
      composeDbFetch<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables),
      options
    );
useGetFollowersListByDidQuery.document = GetFollowersListByDidDocument;


useGetFollowersListByDidQuery.getKey = (variables: Types.GetFollowersListByDidQueryVariables) => ['GetFollowersListByDid', variables];
;

export const useInfiniteGetFollowersListByDidQuery = <
      TData = Types.GetFollowersListByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetFollowersListByDidQueryVariables,
      variables: Types.GetFollowersListByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetFollowersListByDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetFollowersListByDidQuery, TError, TData>(
      ['GetFollowersListByDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetFollowersListByDidQuery.getKey = (variables: Types.GetFollowersListByDidQueryVariables) => ['GetFollowersListByDid.infinite', variables];
;

useGetFollowersListByDidQuery.fetcher = (variables: Types.GetFollowersListByDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables, options);
export const GetMyProfileDocument = /*#__PURE__*/ `
    query GetMyProfile {
  viewer {
    akashaProfile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetMyProfileQuery = <
      TData = Types.GetMyProfileQuery,
      TError = unknown
    >(
      variables?: Types.GetMyProfileQueryVariables,
      options?: UseQueryOptions<Types.GetMyProfileQuery, TError, TData>
    ) =>
    useQuery<Types.GetMyProfileQuery, TError, TData>(
      variables === undefined ? ['GetMyProfile'] : ['GetMyProfile', variables],
      composeDbFetch<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables),
      options
    );
useGetMyProfileQuery.document = GetMyProfileDocument;


useGetMyProfileQuery.getKey = (variables?: Types.GetMyProfileQueryVariables) => variables === undefined ? ['GetMyProfile'] : ['GetMyProfile', variables];
;

export const useInfiniteGetMyProfileQuery = <
      TData = Types.GetMyProfileQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetMyProfileQueryVariables,
      variables?: Types.GetMyProfileQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetMyProfileQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetMyProfileQuery, TError, TData>(
      variables === undefined ? ['GetMyProfile.infinite'] : ['GetMyProfile.infinite', variables],
      (metaData) => composeDbFetch<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetMyProfileQuery.getKey = (variables?: Types.GetMyProfileQueryVariables) => variables === undefined ? ['GetMyProfile.infinite'] : ['GetMyProfile.infinite', variables];
;

useGetMyProfileQuery.fetcher = (variables?: Types.GetMyProfileQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables, options);
export const GetFollowDocumentsDocument = /*#__PURE__*/ `
    query GetFollowDocuments($after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaFollowSortingInput, $following: [String!]) {
  viewer {
    akashaFollowList(
      after: $after
      before: $before
      first: $first
      last: $last
      filters: {where: {profileID: {in: $following}}}
      sorting: $sorting
    ) {
      edges {
        node {
          id
          isFollowing
          profileID
          profile {
            ...UserProfileFragment
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
    isViewer
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetFollowDocumentsQuery = <
      TData = Types.GetFollowDocumentsQuery,
      TError = unknown
    >(
      variables?: Types.GetFollowDocumentsQueryVariables,
      options?: UseQueryOptions<Types.GetFollowDocumentsQuery, TError, TData>
    ) =>
    useQuery<Types.GetFollowDocumentsQuery, TError, TData>(
      variables === undefined ? ['GetFollowDocuments'] : ['GetFollowDocuments', variables],
      composeDbFetch<Types.GetFollowDocumentsQuery, Types.GetFollowDocumentsQueryVariables>(GetFollowDocumentsDocument, variables),
      options
    );
useGetFollowDocumentsQuery.document = GetFollowDocumentsDocument;


useGetFollowDocumentsQuery.getKey = (variables?: Types.GetFollowDocumentsQueryVariables) => variables === undefined ? ['GetFollowDocuments'] : ['GetFollowDocuments', variables];
;

export const useInfiniteGetFollowDocumentsQuery = <
      TData = Types.GetFollowDocumentsQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetFollowDocumentsQueryVariables,
      variables?: Types.GetFollowDocumentsQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetFollowDocumentsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetFollowDocumentsQuery, TError, TData>(
      variables === undefined ? ['GetFollowDocuments.infinite'] : ['GetFollowDocuments.infinite', variables],
      (metaData) => composeDbFetch<Types.GetFollowDocumentsQuery, Types.GetFollowDocumentsQueryVariables>(GetFollowDocumentsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetFollowDocumentsQuery.getKey = (variables?: Types.GetFollowDocumentsQueryVariables) => variables === undefined ? ['GetFollowDocuments.infinite'] : ['GetFollowDocuments.infinite', variables];
;

useGetFollowDocumentsQuery.fetcher = (variables?: Types.GetFollowDocumentsQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetFollowDocumentsQuery, Types.GetFollowDocumentsQueryVariables>(GetFollowDocumentsDocument, variables, options);
export const CreateProfileDocument = /*#__PURE__*/ `
    mutation CreateProfile($i: CreateAkashaProfileInput!) {
  createAkashaProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const useCreateProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateProfileMutation, TError, Types.CreateProfileMutationVariables, TContext>) =>
    useMutation<Types.CreateProfileMutation, TError, Types.CreateProfileMutationVariables, TContext>(
      ['CreateProfile'],
      (variables?: Types.CreateProfileMutationVariables) => composeDbFetch<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables)(),
      options
    );
useCreateProfileMutation.getKey = () => ['CreateProfile'];

useCreateProfileMutation.fetcher = (variables: Types.CreateProfileMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables, options);
export const UpdateProfileDocument = /*#__PURE__*/ `
    mutation UpdateProfile($i: UpdateAkashaProfileInput!) {
  updateAkashaProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const useUpdateProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateProfileMutation, TError, Types.UpdateProfileMutationVariables, TContext>) =>
    useMutation<Types.UpdateProfileMutation, TError, Types.UpdateProfileMutationVariables, TContext>(
      ['UpdateProfile'],
      (variables?: Types.UpdateProfileMutationVariables) => composeDbFetch<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables)(),
      options
    );
useUpdateProfileMutation.getKey = () => ['UpdateProfile'];

useUpdateProfileMutation.fetcher = (variables: Types.UpdateProfileMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables, options);
export const CreateInterestsDocument = /*#__PURE__*/ `
    mutation CreateInterests($i: CreateAkashaProfileInterestsInput!) {
  createAkashaProfileInterests(input: $i) {
    document {
      topics {
        value
        labelType
      }
      did {
        id
      }
      id
    }
    clientMutationId
  }
}
    `;
export const useCreateInterestsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateInterestsMutation, TError, Types.CreateInterestsMutationVariables, TContext>) =>
    useMutation<Types.CreateInterestsMutation, TError, Types.CreateInterestsMutationVariables, TContext>(
      ['CreateInterests'],
      (variables?: Types.CreateInterestsMutationVariables) => composeDbFetch<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables)(),
      options
    );
useCreateInterestsMutation.getKey = () => ['CreateInterests'];

useCreateInterestsMutation.fetcher = (variables: Types.CreateInterestsMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables, options);
export const UpdateInterestsDocument = /*#__PURE__*/ `
    mutation UpdateInterests($i: UpdateAkashaProfileInterestsInput!) {
  updateAkashaProfileInterests(input: $i) {
    document {
      topics {
        value
        labelType
      }
      did {
        id
      }
      id
    }
    clientMutationId
  }
}
    `;
export const useUpdateInterestsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateInterestsMutation, TError, Types.UpdateInterestsMutationVariables, TContext>) =>
    useMutation<Types.UpdateInterestsMutation, TError, Types.UpdateInterestsMutationVariables, TContext>(
      ['UpdateInterests'],
      (variables?: Types.UpdateInterestsMutationVariables) => composeDbFetch<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables)(),
      options
    );
useUpdateInterestsMutation.getKey = () => ['UpdateInterests'];

useUpdateInterestsMutation.fetcher = (variables: Types.UpdateInterestsMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables, options);
export const CreateFollowDocument = /*#__PURE__*/ `
    mutation CreateFollow($i: CreateAkashaFollowInput!) {
  createAkashaFollow(input: $i) {
    document {
      isFollowing
      profile {
        ...UserProfileFragment
      }
      did {
        id
      }
      id
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useCreateFollowMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateFollowMutation, TError, Types.CreateFollowMutationVariables, TContext>) =>
    useMutation<Types.CreateFollowMutation, TError, Types.CreateFollowMutationVariables, TContext>(
      ['CreateFollow'],
      (variables?: Types.CreateFollowMutationVariables) => composeDbFetch<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables)(),
      options
    );
useCreateFollowMutation.getKey = () => ['CreateFollow'];

useCreateFollowMutation.fetcher = (variables: Types.CreateFollowMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables, options);
export const UpdateFollowDocument = /*#__PURE__*/ `
    mutation UpdateFollow($i: UpdateAkashaFollowInput!) {
  updateAkashaFollow(input: $i) {
    document {
      isFollowing
      profile {
        ...UserProfileFragment
      }
      did {
        id
      }
      id
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useUpdateFollowMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateFollowMutation, TError, Types.UpdateFollowMutationVariables, TContext>) =>
    useMutation<Types.UpdateFollowMutation, TError, Types.UpdateFollowMutationVariables, TContext>(
      ['UpdateFollow'],
      (variables?: Types.UpdateFollowMutationVariables) => composeDbFetch<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables)(),
      options
    );
useUpdateFollowMutation.getKey = () => ['UpdateFollow'];

useUpdateFollowMutation.fetcher = (variables: Types.UpdateFollowMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables, options);
export const CreateAppDocument = /*#__PURE__*/ `
    mutation CreateApp($i: CreateAkashaAppInput!) {
  createAkashaApp(input: $i) {
    document {
      ...AkashaAppFragment
    }
    clientMutationId
  }
}
    ${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useCreateAppMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateAppMutation, TError, Types.CreateAppMutationVariables, TContext>) =>
    useMutation<Types.CreateAppMutation, TError, Types.CreateAppMutationVariables, TContext>(
      ['CreateApp'],
      (variables?: Types.CreateAppMutationVariables) => composeDbFetch<Types.CreateAppMutation, Types.CreateAppMutationVariables>(CreateAppDocument, variables)(),
      options
    );
useCreateAppMutation.getKey = () => ['CreateApp'];

useCreateAppMutation.fetcher = (variables: Types.CreateAppMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateAppMutation, Types.CreateAppMutationVariables>(CreateAppDocument, variables, options);
export const UpdateAppDocument = /*#__PURE__*/ `
    mutation UpdateApp($i: UpdateAkashaAppInput!) {
  updateAkashaApp(input: $i) {
    document {
      ...AkashaAppFragment
    }
    clientMutationId
  }
}
    ${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useUpdateAppMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateAppMutation, TError, Types.UpdateAppMutationVariables, TContext>) =>
    useMutation<Types.UpdateAppMutation, TError, Types.UpdateAppMutationVariables, TContext>(
      ['UpdateApp'],
      (variables?: Types.UpdateAppMutationVariables) => composeDbFetch<Types.UpdateAppMutation, Types.UpdateAppMutationVariables>(UpdateAppDocument, variables)(),
      options
    );
useUpdateAppMutation.getKey = () => ['UpdateApp'];

useUpdateAppMutation.fetcher = (variables: Types.UpdateAppMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateAppMutation, Types.UpdateAppMutationVariables>(UpdateAppDocument, variables, options);
export const GetAppsDocument = /*#__PURE__*/ `
    query GetApps($after: String, $before: String, $first: Int, $last: Int, $filters: AkashaAppFiltersInput, $sorting: AkashaAppSortingInput) {
  akashaAppIndex(
    after: $after
    before: $before
    first: $first
    last: $last
    filters: $filters
    sorting: $sorting
  ) {
    edges {
      node {
        ...AkashaAppFragment
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useGetAppsQuery = <
      TData = Types.GetAppsQuery,
      TError = unknown
    >(
      variables?: Types.GetAppsQueryVariables,
      options?: UseQueryOptions<Types.GetAppsQuery, TError, TData>
    ) =>
    useQuery<Types.GetAppsQuery, TError, TData>(
      variables === undefined ? ['GetApps'] : ['GetApps', variables],
      composeDbFetch<Types.GetAppsQuery, Types.GetAppsQueryVariables>(GetAppsDocument, variables),
      options
    );
useGetAppsQuery.document = GetAppsDocument;


useGetAppsQuery.getKey = (variables?: Types.GetAppsQueryVariables) => variables === undefined ? ['GetApps'] : ['GetApps', variables];
;

export const useInfiniteGetAppsQuery = <
      TData = Types.GetAppsQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetAppsQueryVariables,
      variables?: Types.GetAppsQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetAppsQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetAppsQuery, TError, TData>(
      variables === undefined ? ['GetApps.infinite'] : ['GetApps.infinite', variables],
      (metaData) => composeDbFetch<Types.GetAppsQuery, Types.GetAppsQueryVariables>(GetAppsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppsQuery.getKey = (variables?: Types.GetAppsQueryVariables) => variables === undefined ? ['GetApps.infinite'] : ['GetApps.infinite', variables];
;

useGetAppsQuery.fetcher = (variables?: Types.GetAppsQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetAppsQuery, Types.GetAppsQueryVariables>(GetAppsDocument, variables, options);
export const GetAppsStreamDocument = /*#__PURE__*/ `
    query GetAppsStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaAppsStreamFiltersInput, $sorting: AkashaAppsStreamSortingInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaAppsStreamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
            moderationID
            active
            applicationID
            status
            createdAt
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    `;
export const useGetAppsStreamQuery = <
      TData = Types.GetAppsStreamQuery,
      TError = unknown
    >(
      variables: Types.GetAppsStreamQueryVariables,
      options?: UseQueryOptions<Types.GetAppsStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetAppsStreamQuery, TError, TData>(
      ['GetAppsStream', variables],
      composeDbFetch<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>(GetAppsStreamDocument, variables),
      options
    );
useGetAppsStreamQuery.document = GetAppsStreamDocument;


useGetAppsStreamQuery.getKey = (variables: Types.GetAppsStreamQueryVariables) => ['GetAppsStream', variables];
;

export const useInfiniteGetAppsStreamQuery = <
      TData = Types.GetAppsStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetAppsStreamQueryVariables,
      variables: Types.GetAppsStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetAppsStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetAppsStreamQuery, TError, TData>(
      ['GetAppsStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>(GetAppsStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppsStreamQuery.getKey = (variables: Types.GetAppsStreamQueryVariables) => ['GetAppsStream.infinite', variables];
;

useGetAppsStreamQuery.fetcher = (variables: Types.GetAppsStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>(GetAppsStreamDocument, variables, options);
export const GetAppsByIdDocument = /*#__PURE__*/ `
    query GetAppsByID($id: ID!) {
  node(id: $id) {
    ... on AkashaApp {
      ...AkashaAppFragment
    }
  }
}
    ${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useGetAppsByIdQuery = <
      TData = Types.GetAppsByIdQuery,
      TError = unknown
    >(
      variables: Types.GetAppsByIdQueryVariables,
      options?: UseQueryOptions<Types.GetAppsByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetAppsByIdQuery, TError, TData>(
      ['GetAppsByID', variables],
      composeDbFetch<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>(GetAppsByIdDocument, variables),
      options
    );
useGetAppsByIdQuery.document = GetAppsByIdDocument;


useGetAppsByIdQuery.getKey = (variables: Types.GetAppsByIdQueryVariables) => ['GetAppsByID', variables];
;

export const useInfiniteGetAppsByIdQuery = <
      TData = Types.GetAppsByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetAppsByIdQueryVariables,
      variables: Types.GetAppsByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetAppsByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetAppsByIdQuery, TError, TData>(
      ['GetAppsByID.infinite', variables],
      (metaData) => composeDbFetch<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>(GetAppsByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppsByIdQuery.getKey = (variables: Types.GetAppsByIdQueryVariables) => ['GetAppsByID.infinite', variables];
;

useGetAppsByIdQuery.fetcher = (variables: Types.GetAppsByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>(GetAppsByIdDocument, variables, options);
export const CreateAppReleaseDocument = /*#__PURE__*/ `
    mutation CreateAppRelease($i: CreateAkashaAppReleaseInput!) {
  createAkashaAppRelease(input: $i) {
    document {
      ...AppReleaseFragment
    }
    clientMutationId
  }
}
    ${AppReleaseFragmentDoc}
${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useCreateAppReleaseMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateAppReleaseMutation, TError, Types.CreateAppReleaseMutationVariables, TContext>) =>
    useMutation<Types.CreateAppReleaseMutation, TError, Types.CreateAppReleaseMutationVariables, TContext>(
      ['CreateAppRelease'],
      (variables?: Types.CreateAppReleaseMutationVariables) => composeDbFetch<Types.CreateAppReleaseMutation, Types.CreateAppReleaseMutationVariables>(CreateAppReleaseDocument, variables)(),
      options
    );
useCreateAppReleaseMutation.getKey = () => ['CreateAppRelease'];

useCreateAppReleaseMutation.fetcher = (variables: Types.CreateAppReleaseMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.CreateAppReleaseMutation, Types.CreateAppReleaseMutationVariables>(CreateAppReleaseDocument, variables, options);
export const UpdateAppReleaseDocument = /*#__PURE__*/ `
    mutation UpdateAppRelease($i: UpdateAkashaAppReleaseInput!) {
  updateAkashaAppRelease(input: $i) {
    document {
      ...AppReleaseFragment
    }
    clientMutationId
  }
}
    ${AppReleaseFragmentDoc}
${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useUpdateAppReleaseMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateAppReleaseMutation, TError, Types.UpdateAppReleaseMutationVariables, TContext>) =>
    useMutation<Types.UpdateAppReleaseMutation, TError, Types.UpdateAppReleaseMutationVariables, TContext>(
      ['UpdateAppRelease'],
      (variables?: Types.UpdateAppReleaseMutationVariables) => composeDbFetch<Types.UpdateAppReleaseMutation, Types.UpdateAppReleaseMutationVariables>(UpdateAppReleaseDocument, variables)(),
      options
    );
useUpdateAppReleaseMutation.getKey = () => ['UpdateAppRelease'];

useUpdateAppReleaseMutation.fetcher = (variables: Types.UpdateAppReleaseMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.UpdateAppReleaseMutation, Types.UpdateAppReleaseMutationVariables>(UpdateAppReleaseDocument, variables, options);
export const GetAppsReleasesDocument = /*#__PURE__*/ `
    query GetAppsReleases($after: String, $before: String, $first: Int, $last: Int, $filters: AkashaAppReleaseFiltersInput, $sorting: AkashaAppReleaseSortingInput) {
  akashaAppReleaseIndex(
    after: $after
    before: $before
    first: $first
    last: $last
    filters: $filters
    sorting: $sorting
  ) {
    edges {
      node {
        ...AppReleaseFragment
      }
      cursor
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${AppReleaseFragmentDoc}
${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useGetAppsReleasesQuery = <
      TData = Types.GetAppsReleasesQuery,
      TError = unknown
    >(
      variables?: Types.GetAppsReleasesQueryVariables,
      options?: UseQueryOptions<Types.GetAppsReleasesQuery, TError, TData>
    ) =>
    useQuery<Types.GetAppsReleasesQuery, TError, TData>(
      variables === undefined ? ['GetAppsReleases'] : ['GetAppsReleases', variables],
      composeDbFetch<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>(GetAppsReleasesDocument, variables),
      options
    );
useGetAppsReleasesQuery.document = GetAppsReleasesDocument;


useGetAppsReleasesQuery.getKey = (variables?: Types.GetAppsReleasesQueryVariables) => variables === undefined ? ['GetAppsReleases'] : ['GetAppsReleases', variables];
;

export const useInfiniteGetAppsReleasesQuery = <
      TData = Types.GetAppsReleasesQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetAppsReleasesQueryVariables,
      variables?: Types.GetAppsReleasesQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetAppsReleasesQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetAppsReleasesQuery, TError, TData>(
      variables === undefined ? ['GetAppsReleases.infinite'] : ['GetAppsReleases.infinite', variables],
      (metaData) => composeDbFetch<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>(GetAppsReleasesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppsReleasesQuery.getKey = (variables?: Types.GetAppsReleasesQueryVariables) => variables === undefined ? ['GetAppsReleases.infinite'] : ['GetAppsReleases.infinite', variables];
;

useGetAppsReleasesQuery.fetcher = (variables?: Types.GetAppsReleasesQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>(GetAppsReleasesDocument, variables, options);
export const GetAppReleaseByIdDocument = /*#__PURE__*/ `
    query GetAppReleaseByID($id: ID!) {
  node(id: $id) {
    ... on AkashaAppRelease {
      ...AppReleaseFragment
    }
  }
}
    ${AppReleaseFragmentDoc}
${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useGetAppReleaseByIdQuery = <
      TData = Types.GetAppReleaseByIdQuery,
      TError = unknown
    >(
      variables: Types.GetAppReleaseByIdQueryVariables,
      options?: UseQueryOptions<Types.GetAppReleaseByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetAppReleaseByIdQuery, TError, TData>(
      ['GetAppReleaseByID', variables],
      composeDbFetch<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>(GetAppReleaseByIdDocument, variables),
      options
    );
useGetAppReleaseByIdQuery.document = GetAppReleaseByIdDocument;


useGetAppReleaseByIdQuery.getKey = (variables: Types.GetAppReleaseByIdQueryVariables) => ['GetAppReleaseByID', variables];
;

export const useInfiniteGetAppReleaseByIdQuery = <
      TData = Types.GetAppReleaseByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetAppReleaseByIdQueryVariables,
      variables: Types.GetAppReleaseByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetAppReleaseByIdQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetAppReleaseByIdQuery, TError, TData>(
      ['GetAppReleaseByID.infinite', variables],
      (metaData) => composeDbFetch<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>(GetAppReleaseByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppReleaseByIdQuery.getKey = (variables: Types.GetAppReleaseByIdQueryVariables) => ['GetAppReleaseByID.infinite', variables];
;

useGetAppReleaseByIdQuery.fetcher = (variables: Types.GetAppReleaseByIdQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>(GetAppReleaseByIdDocument, variables, options);