import type * as Types from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

import { useQuery, useInfiniteQuery, type UseQueryOptions, type UseInfiniteQueryOptions } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';

function composeDbFetch<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
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
  embeddedStream {
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
  tags {
    labelType
    value
  }
  mentions {
    id
  }
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
  license
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
      akashaBeamListCount(filters: $filters)
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
    query GetContentBlockStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaContentBlockStreamFiltersInput, $sorting: AkashaContentBlockStreamSortingInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaContentBlockStreamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
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
      akashaContentBlockStreamListCount(filters: $filters)
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
export const GetIndexedStreamDocument = /*#__PURE__*/ `
    query GetIndexedStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaIndexedStreamFiltersInput, $sorting: AkashaIndexedStreamSortingInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaIndexedStreamList(
        after: $after
        before: $before
        first: $first
        last: $last
        filters: $filters
        sorting: $sorting
      ) {
        edges {
          node {
            createdAt
            active
            status
            indexValue
            indexType
            stream
            streamType
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
      akashaIndexedStreamListCount(filters: $filters)
      isViewer
    }
  }
}
    `;
export const useGetIndexedStreamQuery = <
      TData = Types.GetIndexedStreamQuery,
      TError = unknown
    >(
      variables: Types.GetIndexedStreamQueryVariables,
      options?: UseQueryOptions<Types.GetIndexedStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetIndexedStreamQuery, TError, TData>(
      ['GetIndexedStream', variables],
      composeDbFetch<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>(GetIndexedStreamDocument, variables),
      options
    );
useGetIndexedStreamQuery.document = GetIndexedStreamDocument;


useGetIndexedStreamQuery.getKey = (variables: Types.GetIndexedStreamQueryVariables) => ['GetIndexedStream', variables];
;

export const useInfiniteGetIndexedStreamQuery = <
      TData = Types.GetIndexedStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetIndexedStreamQueryVariables,
      variables: Types.GetIndexedStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetIndexedStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetIndexedStreamQuery, TError, TData>(
      ['GetIndexedStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>(GetIndexedStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetIndexedStreamQuery.getKey = (variables: Types.GetIndexedStreamQueryVariables) => ['GetIndexedStream.infinite', variables];
;

useGetIndexedStreamQuery.fetcher = (variables: Types.GetIndexedStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>(GetIndexedStreamDocument, variables, options);
export const GetIndexedStreamCountDocument = /*#__PURE__*/ `
    query GetIndexedStreamCount($indexer: ID!, $filters: AkashaIndexedStreamFiltersInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaIndexedStreamListCount(filters: $filters)
      isViewer
    }
  }
}
    `;
export const useGetIndexedStreamCountQuery = <
      TData = Types.GetIndexedStreamCountQuery,
      TError = unknown
    >(
      variables: Types.GetIndexedStreamCountQueryVariables,
      options?: UseQueryOptions<Types.GetIndexedStreamCountQuery, TError, TData>
    ) =>
    useQuery<Types.GetIndexedStreamCountQuery, TError, TData>(
      ['GetIndexedStreamCount', variables],
      composeDbFetch<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>(GetIndexedStreamCountDocument, variables),
      options
    );
useGetIndexedStreamCountQuery.document = GetIndexedStreamCountDocument;


useGetIndexedStreamCountQuery.getKey = (variables: Types.GetIndexedStreamCountQueryVariables) => ['GetIndexedStreamCount', variables];
;

export const useInfiniteGetIndexedStreamCountQuery = <
      TData = Types.GetIndexedStreamCountQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetIndexedStreamCountQueryVariables,
      variables: Types.GetIndexedStreamCountQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetIndexedStreamCountQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetIndexedStreamCountQuery, TError, TData>(
      ['GetIndexedStreamCount.infinite', variables],
      (metaData) => composeDbFetch<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>(GetIndexedStreamCountDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetIndexedStreamCountQuery.getKey = (variables: Types.GetIndexedStreamCountQueryVariables) => ['GetIndexedStreamCount.infinite', variables];
;

useGetIndexedStreamCountQuery.fetcher = (variables: Types.GetIndexedStreamCountQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>(GetIndexedStreamCountDocument, variables, options);
export const GetReflectionsFromBeamDocument = /*#__PURE__*/ `
    query GetReflectionsFromBeam($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaReflectInterfaceSortingInput, $filters: AkashaReflectInterfaceFiltersInput) {
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
      reflectionsCount(filters: $filters)
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
            isReply
            replyTo
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
    query GetInterestsStream($indexer: ID!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaInterestsStreamSortingInput, $filters: AkashaInterestsStreamFiltersInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaInterestsStreamList(
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
  }
}
    `;
export const useGetInterestsStreamQuery = <
      TData = Types.GetInterestsStreamQuery,
      TError = unknown
    >(
      variables: Types.GetInterestsStreamQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsStreamQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsStreamQuery, TError, TData>(
      ['GetInterestsStream', variables],
      composeDbFetch<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, variables),
      options
    );
useGetInterestsStreamQuery.document = GetInterestsStreamDocument;


useGetInterestsStreamQuery.getKey = (variables: Types.GetInterestsStreamQueryVariables) => ['GetInterestsStream', variables];
;

export const useInfiniteGetInterestsStreamQuery = <
      TData = Types.GetInterestsStreamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsStreamQueryVariables,
      variables: Types.GetInterestsStreamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsStreamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetInterestsStreamQuery, TError, TData>(
      ['GetInterestsStream.infinite', variables],
      (metaData) => composeDbFetch<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsStreamQuery.getKey = (variables: Types.GetInterestsStreamQueryVariables) => ['GetInterestsStream.infinite', variables];
;

useGetInterestsStreamQuery.fetcher = (variables: Types.GetInterestsStreamQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, variables, options);
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
    query GetFollowersListByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaFollowInterfaceSortingInput) {
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
export const GetProfileStatsByDidDocument = /*#__PURE__*/ `
    query GetProfileStatsByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaFollowListCount(filters: {where: {isFollowing: {equalTo: true}}})
      akashaBeamListCount(filters: {where: {active: {equalTo: true}}})
      akashaReflectListCount(filters: {where: {active: {equalTo: true}}})
      akashaProfile {
        ...UserProfileFragment
        followersCount(filters: {where: {isFollowing: {equalTo: true}}})
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
export const GetAppsByPublisherDidDocument = /*#__PURE__*/ `
    query GetAppsByPublisherDID($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaAppFiltersInput, $sorting: AkashaAppSortingInput) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaAppList(
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
        }
      }
    }
  }
}
    ${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useGetAppsByPublisherDidQuery = <
      TData = Types.GetAppsByPublisherDidQuery,
      TError = unknown
    >(
      variables: Types.GetAppsByPublisherDidQueryVariables,
      options?: UseQueryOptions<Types.GetAppsByPublisherDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetAppsByPublisherDidQuery, TError, TData>(
      ['GetAppsByPublisherDID', variables],
      composeDbFetch<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>(GetAppsByPublisherDidDocument, variables),
      options
    );
useGetAppsByPublisherDidQuery.document = GetAppsByPublisherDidDocument;


useGetAppsByPublisherDidQuery.getKey = (variables: Types.GetAppsByPublisherDidQueryVariables) => ['GetAppsByPublisherDID', variables];
;

export const useInfiniteGetAppsByPublisherDidQuery = <
      TData = Types.GetAppsByPublisherDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetAppsByPublisherDidQueryVariables,
      variables: Types.GetAppsByPublisherDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetAppsByPublisherDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetAppsByPublisherDidQuery, TError, TData>(
      ['GetAppsByPublisherDID.infinite', variables],
      (metaData) => composeDbFetch<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>(GetAppsByPublisherDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppsByPublisherDidQuery.getKey = (variables: Types.GetAppsByPublisherDidQueryVariables) => ['GetAppsByPublisherDID.infinite', variables];
;

useGetAppsByPublisherDidQuery.fetcher = (variables: Types.GetAppsByPublisherDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>(GetAppsByPublisherDidDocument, variables, options);
export const GetAppsReleasesByPublisherDidDocument = /*#__PURE__*/ `
    query GetAppsReleasesByPublisherDID($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $filters: AkashaAppReleaseFiltersInput, $sorting: AkashaAppReleaseSortingInput) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaAppReleaseList(
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
        }
      }
    }
  }
}
    ${AppReleaseFragmentDoc}
${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;
export const useGetAppsReleasesByPublisherDidQuery = <
      TData = Types.GetAppsReleasesByPublisherDidQuery,
      TError = unknown
    >(
      variables: Types.GetAppsReleasesByPublisherDidQueryVariables,
      options?: UseQueryOptions<Types.GetAppsReleasesByPublisherDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetAppsReleasesByPublisherDidQuery, TError, TData>(
      ['GetAppsReleasesByPublisherDID', variables],
      composeDbFetch<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>(GetAppsReleasesByPublisherDidDocument, variables),
      options
    );
useGetAppsReleasesByPublisherDidQuery.document = GetAppsReleasesByPublisherDidDocument;


useGetAppsReleasesByPublisherDidQuery.getKey = (variables: Types.GetAppsReleasesByPublisherDidQueryVariables) => ['GetAppsReleasesByPublisherDID', variables];
;

export const useInfiniteGetAppsReleasesByPublisherDidQuery = <
      TData = Types.GetAppsReleasesByPublisherDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetAppsReleasesByPublisherDidQueryVariables,
      variables: Types.GetAppsReleasesByPublisherDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetAppsReleasesByPublisherDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetAppsReleasesByPublisherDidQuery, TError, TData>(
      ['GetAppsReleasesByPublisherDID.infinite', variables],
      (metaData) => composeDbFetch<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>(GetAppsReleasesByPublisherDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetAppsReleasesByPublisherDidQuery.getKey = (variables: Types.GetAppsReleasesByPublisherDidQueryVariables) => ['GetAppsReleasesByPublisherDID.infinite', variables];
;

useGetAppsReleasesByPublisherDidQuery.fetcher = (variables: Types.GetAppsReleasesByPublisherDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>(GetAppsReleasesByPublisherDidDocument, variables, options);
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