import type * as Types from '@akashaorg/typings/sdk/graphql-operation-types-new';

import { useQuery, useInfiniteQuery, useMutation, type UseQueryOptions, type UseInfiniteQueryOptions, type UseMutationOptions } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';
const sdk = getSDK();
export function fetcher<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
  return async (): Promise<TData> => {

    const result = await sdk.services.ceramic.getComposeClient().executeQuery(query, variables);
    if (!result.errors || !result.errors.length) {
        return result.data as TData;
    }
    throw result.errors;
  };
}

export const BeamFragmentDoc = /*#__PURE__*/ `
    fragment BeamFragment on Beam {
  id
  reflectionsCount
  rebeamsCount
  active
  author {
    id
  }
  content {
    property
    provider
    value
  }
  tags
  version
}
    `;
export const ReflectFragmentDoc = /*#__PURE__*/ `
    fragment ReflectFragment on Reflect {
  author {
    id
  }
  version
  active
  content {
    provider
    property
    value
  }
  isReply
  reflectionsCount
  beam {
    id
    author {
      id
    }
  }
}
    `;
export const UserProfileFragmentDoc = /*#__PURE__*/ `
    fragment UserProfileFragment on Profile {
  id
  did {
    id
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
  createdAt
}
    `;
export const GetBeamsDocument = /*#__PURE__*/ `
    query GetBeams($after: String, $before: String, $first: Int, $last: Int) {
  beamIndex(after: $after, before: $before, first: $first, last: $last) {
    edges {
      node {
        ...BeamFragment
      }
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
      fetcher<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, variables),
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
      (metaData) => fetcher<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBeamsQuery.getKey = (variables?: Types.GetBeamsQueryVariables) => variables === undefined ? ['GetBeams.infinite'] : ['GetBeams.infinite', variables];
;

useGetBeamsQuery.fetcher = (variables?: Types.GetBeamsQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, variables, options);
export const GetBeamsByAuthorDidDocument = /*#__PURE__*/ `
    query GetBeamsByAuthorDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      beamList(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            ...BeamFragment
          }
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
      fetcher<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, variables),
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
      (metaData) => fetcher<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBeamsByAuthorDidQuery.getKey = (variables: Types.GetBeamsByAuthorDidQueryVariables) => ['GetBeamsByAuthorDid.infinite', variables];
;

useGetBeamsByAuthorDidQuery.fetcher = (variables: Types.GetBeamsByAuthorDidQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, variables, options);
export const GetBeamByIdDocument = /*#__PURE__*/ `
    query GetBeamById($id: ID!) {
  node(id: $id) {
    ... on Beam {
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
      fetcher<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, variables),
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
      (metaData) => fetcher<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetBeamByIdQuery.getKey = (variables: Types.GetBeamByIdQueryVariables) => ['GetBeamById.infinite', variables];
;

useGetBeamByIdQuery.fetcher = (variables: Types.GetBeamByIdQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, variables, options);
export const GetRebeamsFromBeamDocument = /*#__PURE__*/ `
    query GetRebeamsFromBeam($id: ID!) {
  node(id: $id) {
    ... on Beam {
      rebeams(first: 5) {
        edges {
          node {
            quotedBeam {
              ...BeamFragment
            }
            beam {
              ...BeamFragment
            }
          }
        }
      }
    }
  }
}
    ${BeamFragmentDoc}`;
export const useGetRebeamsFromBeamQuery = <
      TData = Types.GetRebeamsFromBeamQuery,
      TError = unknown
    >(
      variables: Types.GetRebeamsFromBeamQueryVariables,
      options?: UseQueryOptions<Types.GetRebeamsFromBeamQuery, TError, TData>
    ) =>
    useQuery<Types.GetRebeamsFromBeamQuery, TError, TData>(
      ['GetRebeamsFromBeam', variables],
      fetcher<Types.GetRebeamsFromBeamQuery, Types.GetRebeamsFromBeamQueryVariables>(GetRebeamsFromBeamDocument, variables),
      options
    );
useGetRebeamsFromBeamQuery.document = GetRebeamsFromBeamDocument;


useGetRebeamsFromBeamQuery.getKey = (variables: Types.GetRebeamsFromBeamQueryVariables) => ['GetRebeamsFromBeam', variables];
;

export const useInfiniteGetRebeamsFromBeamQuery = <
      TData = Types.GetRebeamsFromBeamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetRebeamsFromBeamQueryVariables,
      variables: Types.GetRebeamsFromBeamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetRebeamsFromBeamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetRebeamsFromBeamQuery, TError, TData>(
      ['GetRebeamsFromBeam.infinite', variables],
      (metaData) => fetcher<Types.GetRebeamsFromBeamQuery, Types.GetRebeamsFromBeamQueryVariables>(GetRebeamsFromBeamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetRebeamsFromBeamQuery.getKey = (variables: Types.GetRebeamsFromBeamQueryVariables) => ['GetRebeamsFromBeam.infinite', variables];
;

useGetRebeamsFromBeamQuery.fetcher = (variables: Types.GetRebeamsFromBeamQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetRebeamsFromBeamQuery, Types.GetRebeamsFromBeamQueryVariables>(GetRebeamsFromBeamDocument, variables, options);
export const GetMentionsFromBeamDocument = /*#__PURE__*/ `
    query GetMentionsFromBeam($id: ID!) {
  node(id: $id) {
    ... on Beam {
      mentions(first: 10) {
        edges {
          node {
            profile {
              ...UserProfileFragment
            }
            beam {
              ...BeamFragment
            }
          }
        }
      }
    }
  }
}
    ${UserProfileFragmentDoc}
${BeamFragmentDoc}`;
export const useGetMentionsFromBeamQuery = <
      TData = Types.GetMentionsFromBeamQuery,
      TError = unknown
    >(
      variables: Types.GetMentionsFromBeamQueryVariables,
      options?: UseQueryOptions<Types.GetMentionsFromBeamQuery, TError, TData>
    ) =>
    useQuery<Types.GetMentionsFromBeamQuery, TError, TData>(
      ['GetMentionsFromBeam', variables],
      fetcher<Types.GetMentionsFromBeamQuery, Types.GetMentionsFromBeamQueryVariables>(GetMentionsFromBeamDocument, variables),
      options
    );
useGetMentionsFromBeamQuery.document = GetMentionsFromBeamDocument;


useGetMentionsFromBeamQuery.getKey = (variables: Types.GetMentionsFromBeamQueryVariables) => ['GetMentionsFromBeam', variables];
;

export const useInfiniteGetMentionsFromBeamQuery = <
      TData = Types.GetMentionsFromBeamQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetMentionsFromBeamQueryVariables,
      variables: Types.GetMentionsFromBeamQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetMentionsFromBeamQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetMentionsFromBeamQuery, TError, TData>(
      ['GetMentionsFromBeam.infinite', variables],
      (metaData) => fetcher<Types.GetMentionsFromBeamQuery, Types.GetMentionsFromBeamQueryVariables>(GetMentionsFromBeamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetMentionsFromBeamQuery.getKey = (variables: Types.GetMentionsFromBeamQueryVariables) => ['GetMentionsFromBeam.infinite', variables];
;

useGetMentionsFromBeamQuery.fetcher = (variables: Types.GetMentionsFromBeamQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetMentionsFromBeamQuery, Types.GetMentionsFromBeamQueryVariables>(GetMentionsFromBeamDocument, variables, options);
export const CreateBeamDocument = /*#__PURE__*/ `
    mutation CreateBeam($i: CreateBeamInput!) {
  createBeam(input: $i) {
    document {
      ...BeamFragment
    }
  }
}
    ${BeamFragmentDoc}`;
export const useCreateBeamMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateBeamMutation, TError, Types.CreateBeamMutationVariables, TContext>) =>
    useMutation<Types.CreateBeamMutation, TError, Types.CreateBeamMutationVariables, TContext>(
      ['CreateBeam'],
      (variables?: Types.CreateBeamMutationVariables) => fetcher<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>(CreateBeamDocument, variables)(),
      options
    );
useCreateBeamMutation.getKey = () => ['CreateBeam'];

useCreateBeamMutation.fetcher = (variables: Types.CreateBeamMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>(CreateBeamDocument, variables, options);
export const UpdateBeamDocument = /*#__PURE__*/ `
    mutation UpdateBeam($i: UpdateBeamInput!) {
  updateBeam(input: $i) {
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
      (variables?: Types.UpdateBeamMutationVariables) => fetcher<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>(UpdateBeamDocument, variables)(),
      options
    );
useUpdateBeamMutation.getKey = () => ['UpdateBeam'];

useUpdateBeamMutation.fetcher = (variables: Types.UpdateBeamMutationVariables, options?: RequestInit['headers']) => fetcher<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>(UpdateBeamDocument, variables, options);
export const CreateRebeamDocument = /*#__PURE__*/ `
    mutation CreateRebeam($i: CreateRebeamInput!) {
  createRebeam(input: $i) {
    document {
      beam {
        ...BeamFragment
      }
      quotedBeam {
        ...BeamFragment
      }
      active
    }
    clientMutationId
  }
}
    ${BeamFragmentDoc}`;
export const useCreateRebeamMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateRebeamMutation, TError, Types.CreateRebeamMutationVariables, TContext>) =>
    useMutation<Types.CreateRebeamMutation, TError, Types.CreateRebeamMutationVariables, TContext>(
      ['CreateRebeam'],
      (variables?: Types.CreateRebeamMutationVariables) => fetcher<Types.CreateRebeamMutation, Types.CreateRebeamMutationVariables>(CreateRebeamDocument, variables)(),
      options
    );
useCreateRebeamMutation.getKey = () => ['CreateRebeam'];

useCreateRebeamMutation.fetcher = (variables: Types.CreateRebeamMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateRebeamMutation, Types.CreateRebeamMutationVariables>(CreateRebeamDocument, variables, options);
export const CreateBeamProfileMentionDocument = /*#__PURE__*/ `
    mutation CreateBeamProfileMention($i: CreateProfileMentionInput!) {
  createProfileMention(input: $i) {
    document {
      beam {
        ...BeamFragment
      }
      profile {
        ...UserProfileFragment
      }
    }
  }
}
    ${BeamFragmentDoc}
${UserProfileFragmentDoc}`;
export const useCreateBeamProfileMentionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateBeamProfileMentionMutation, TError, Types.CreateBeamProfileMentionMutationVariables, TContext>) =>
    useMutation<Types.CreateBeamProfileMentionMutation, TError, Types.CreateBeamProfileMentionMutationVariables, TContext>(
      ['CreateBeamProfileMention'],
      (variables?: Types.CreateBeamProfileMentionMutationVariables) => fetcher<Types.CreateBeamProfileMentionMutation, Types.CreateBeamProfileMentionMutationVariables>(CreateBeamProfileMentionDocument, variables)(),
      options
    );
useCreateBeamProfileMentionMutation.getKey = () => ['CreateBeamProfileMention'];

useCreateBeamProfileMentionMutation.fetcher = (variables: Types.CreateBeamProfileMentionMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateBeamProfileMentionMutation, Types.CreateBeamProfileMentionMutationVariables>(CreateBeamProfileMentionDocument, variables, options);
export const GetReflectionsFromBeamDocument = /*#__PURE__*/ `
    query GetReflectionsFromBeam($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on Beam {
      reflections(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            ...ReflectFragment
          }
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
      fetcher<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, variables),
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
      (metaData) => fetcher<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectionsFromBeamQuery.getKey = (variables: Types.GetReflectionsFromBeamQueryVariables) => ['GetReflectionsFromBeam.infinite', variables];
;

useGetReflectionsFromBeamQuery.fetcher = (variables: Types.GetReflectionsFromBeamQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, variables, options);
export const GetReflectionsByAuthorDidDocument = /*#__PURE__*/ `
    query GetReflectionsByAuthorDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      reflectList(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            ...ReflectFragment
          }
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
export const useGetReflectionsByAuthorDidQuery = <
      TData = Types.GetReflectionsByAuthorDidQuery,
      TError = unknown
    >(
      variables: Types.GetReflectionsByAuthorDidQueryVariables,
      options?: UseQueryOptions<Types.GetReflectionsByAuthorDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetReflectionsByAuthorDidQuery, TError, TData>(
      ['GetReflectionsByAuthorDid', variables],
      fetcher<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, variables),
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
      (metaData) => fetcher<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectionsByAuthorDidQuery.getKey = (variables: Types.GetReflectionsByAuthorDidQueryVariables) => ['GetReflectionsByAuthorDid.infinite', variables];
;

useGetReflectionsByAuthorDidQuery.fetcher = (variables: Types.GetReflectionsByAuthorDidQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, variables, options);
export const GetReflectReflectionsDocument = /*#__PURE__*/ `
    query GetReflectReflections($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on Reflect {
      reflections(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            reflect {
              ...ReflectFragment
            }
          }
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
export const useGetReflectReflectionsQuery = <
      TData = Types.GetReflectReflectionsQuery,
      TError = unknown
    >(
      variables: Types.GetReflectReflectionsQueryVariables,
      options?: UseQueryOptions<Types.GetReflectReflectionsQuery, TError, TData>
    ) =>
    useQuery<Types.GetReflectReflectionsQuery, TError, TData>(
      ['GetReflectReflections', variables],
      fetcher<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, variables),
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
      (metaData) => fetcher<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetReflectReflectionsQuery.getKey = (variables: Types.GetReflectReflectionsQueryVariables) => ['GetReflectReflections.infinite', variables];
;

useGetReflectReflectionsQuery.fetcher = (variables: Types.GetReflectReflectionsQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, variables, options);
export const CreateReflectDocument = /*#__PURE__*/ `
    mutation CreateReflect($i: CreateReflectInput!) {
  createReflect(input: $i) {
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
      (variables?: Types.CreateReflectMutationVariables) => fetcher<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>(CreateReflectDocument, variables)(),
      options
    );
useCreateReflectMutation.getKey = () => ['CreateReflect'];

useCreateReflectMutation.fetcher = (variables: Types.CreateReflectMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>(CreateReflectDocument, variables, options);
export const UpdateReflectDocument = /*#__PURE__*/ `
    mutation UpdateReflect($i: UpdateReflectInput!) {
  updateReflect(input: $i) {
    document {
      ...ReflectFragment
    }
    clientMutationId
  }
}
    ${ReflectFragmentDoc}`;
export const useUpdateReflectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateReflectMutation, TError, Types.UpdateReflectMutationVariables, TContext>) =>
    useMutation<Types.UpdateReflectMutation, TError, Types.UpdateReflectMutationVariables, TContext>(
      ['UpdateReflect'],
      (variables?: Types.UpdateReflectMutationVariables) => fetcher<Types.UpdateReflectMutation, Types.UpdateReflectMutationVariables>(UpdateReflectDocument, variables)(),
      options
    );
useUpdateReflectMutation.getKey = () => ['UpdateReflect'];

useUpdateReflectMutation.fetcher = (variables: Types.UpdateReflectMutationVariables, options?: RequestInit['headers']) => fetcher<Types.UpdateReflectMutation, Types.UpdateReflectMutationVariables>(UpdateReflectDocument, variables, options);
export const CreateReflectReflectionDocument = /*#__PURE__*/ `
    mutation CreateReflectReflection($i: CreateReflectionInput!) {
  createReflection(input: $i) {
    document {
      active
      reflect {
        ...ReflectFragment
      }
      reflection {
        ...ReflectFragment
      }
    }
  }
}
    ${ReflectFragmentDoc}`;
export const useCreateReflectReflectionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateReflectReflectionMutation, TError, Types.CreateReflectReflectionMutationVariables, TContext>) =>
    useMutation<Types.CreateReflectReflectionMutation, TError, Types.CreateReflectReflectionMutationVariables, TContext>(
      ['CreateReflectReflection'],
      (variables?: Types.CreateReflectReflectionMutationVariables) => fetcher<Types.CreateReflectReflectionMutation, Types.CreateReflectReflectionMutationVariables>(CreateReflectReflectionDocument, variables)(),
      options
    );
useCreateReflectReflectionMutation.getKey = () => ['CreateReflectReflection'];

useCreateReflectReflectionMutation.fetcher = (variables: Types.CreateReflectReflectionMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateReflectReflectionMutation, Types.CreateReflectReflectionMutationVariables>(CreateReflectReflectionDocument, variables, options);
export const UpdateReflectReflectionDocument = /*#__PURE__*/ `
    mutation UpdateReflectReflection($i: UpdateReflectionInput!) {
  updateReflection(input: $i) {
    document {
      active
      reflect {
        ...ReflectFragment
      }
      reflection {
        ...ReflectFragment
      }
    }
  }
}
    ${ReflectFragmentDoc}`;
export const useUpdateReflectReflectionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateReflectReflectionMutation, TError, Types.UpdateReflectReflectionMutationVariables, TContext>) =>
    useMutation<Types.UpdateReflectReflectionMutation, TError, Types.UpdateReflectReflectionMutationVariables, TContext>(
      ['UpdateReflectReflection'],
      (variables?: Types.UpdateReflectReflectionMutationVariables) => fetcher<Types.UpdateReflectReflectionMutation, Types.UpdateReflectReflectionMutationVariables>(UpdateReflectReflectionDocument, variables)(),
      options
    );
useUpdateReflectReflectionMutation.getKey = () => ['UpdateReflectReflection'];

useUpdateReflectReflectionMutation.fetcher = (variables: Types.UpdateReflectReflectionMutationVariables, options?: RequestInit['headers']) => fetcher<Types.UpdateReflectReflectionMutation, Types.UpdateReflectReflectionMutationVariables>(UpdateReflectReflectionDocument, variables, options);
export const GetProfileByIdDocument = /*#__PURE__*/ `
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on Profile {
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
      fetcher<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables),
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
      (metaData) => fetcher<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfileByIdQuery.getKey = (variables: Types.GetProfileByIdQueryVariables) => ['GetProfileByID.infinite', variables];
;

useGetProfileByIdQuery.fetcher = (variables: Types.GetProfileByIdQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables, options);
export const GetProfileByDidDocument = /*#__PURE__*/ `
    query GetProfileByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      profile {
        ...UserProfileFragment
      }
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
      fetcher<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables),
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
      (metaData) => fetcher<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfileByDidQuery.getKey = (variables: Types.GetProfileByDidQueryVariables) => ['GetProfileByDid.infinite', variables];
;

useGetProfileByDidQuery.fetcher = (variables: Types.GetProfileByDidQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables, options);
export const GetProfilesDocument = /*#__PURE__*/ `
    query GetProfiles($after: String, $before: String, $first: Int, $last: Int) {
  profileIndex(after: $after, before: $before, first: $first, last: $last) {
    edges {
      node {
        ...UserProfileFragment
      }
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
      fetcher<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables),
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
      (metaData) => fetcher<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetProfilesQuery.getKey = (variables?: Types.GetProfilesQueryVariables) => variables === undefined ? ['GetProfiles.infinite'] : ['GetProfiles.infinite', variables];
;

useGetProfilesQuery.fetcher = (variables?: Types.GetProfilesQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables, options);
export const GetInterestsDocument = /*#__PURE__*/ `
    query GetInterests($after: String, $before: String, $first: Int, $last: Int) {
  interestsIndex(after: $after, before: $before, first: $first, last: $last) {
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
      fetcher<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables),
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
      (metaData) => fetcher<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsQuery.getKey = (variables?: Types.GetInterestsQueryVariables) => variables === undefined ? ['GetInterests.infinite'] : ['GetInterests.infinite', variables];
;

useGetInterestsQuery.fetcher = (variables?: Types.GetInterestsQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables, options);
export const GetInterestsByDidDocument = /*#__PURE__*/ `
    query GetInterestsByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      interests {
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
      fetcher<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables),
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
      (metaData) => fetcher<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsByDidQuery.getKey = (variables: Types.GetInterestsByDidQueryVariables) => ['GetInterestsByDid.infinite', variables];
;

useGetInterestsByDidQuery.fetcher = (variables: Types.GetInterestsByDidQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables, options);
export const GetInterestsByIdDocument = /*#__PURE__*/ `
    query GetInterestsById($id: ID!) {
  node(id: $id) {
    ... on Interests {
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
      fetcher<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables),
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
      (metaData) => fetcher<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetInterestsByIdQuery.getKey = (variables: Types.GetInterestsByIdQueryVariables) => ['GetInterestsById.infinite', variables];
;

useGetInterestsByIdQuery.fetcher = (variables: Types.GetInterestsByIdQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables, options);
export const GetFollowingListByDidDocument = /*#__PURE__*/ `
    query GetFollowingListByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      followList(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            isFollowing
            profile {
              ...UserProfileFragment
            }
          }
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
      fetcher<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables),
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
      (metaData) => fetcher<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetFollowingListByDidQuery.getKey = (variables: Types.GetFollowingListByDidQueryVariables) => ['GetFollowingListByDid.infinite', variables];
;

useGetFollowingListByDidQuery.fetcher = (variables: Types.GetFollowingListByDidQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables, options);
export const GetFollowersListByDidDocument = /*#__PURE__*/ `
    query GetFollowersListByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      profile {
        followers(after: $after, before: $before, first: $first, last: $last) {
          edges {
            node {
              isFollowing
              profile {
                ...UserProfileFragment
              }
            }
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
      fetcher<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables),
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
      (metaData) => fetcher<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetFollowersListByDidQuery.getKey = (variables: Types.GetFollowersListByDidQueryVariables) => ['GetFollowersListByDid.infinite', variables];
;

useGetFollowersListByDidQuery.fetcher = (variables: Types.GetFollowersListByDidQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables, options);
export const GetMyProfileDocument = /*#__PURE__*/ `
    query GetMyProfile {
  viewer {
    profile {
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
      fetcher<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables),
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
      (metaData) => fetcher<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetMyProfileQuery.getKey = (variables?: Types.GetMyProfileQueryVariables) => variables === undefined ? ['GetMyProfile.infinite'] : ['GetMyProfile.infinite', variables];
;

useGetMyProfileQuery.fetcher = (variables?: Types.GetMyProfileQueryVariables, options?: RequestInit['headers']) => fetcher<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables, options);
export const CreateProfileDocument = /*#__PURE__*/ `
    mutation CreateProfile($i: CreateProfileInput!) {
  createProfile(input: $i) {
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
      (variables?: Types.CreateProfileMutationVariables) => fetcher<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables)(),
      options
    );
useCreateProfileMutation.getKey = () => ['CreateProfile'];

useCreateProfileMutation.fetcher = (variables: Types.CreateProfileMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables, options);
export const UpdateProfileDocument = /*#__PURE__*/ `
    mutation UpdateProfile($i: UpdateProfileInput!) {
  updateProfile(input: $i) {
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
      (variables?: Types.UpdateProfileMutationVariables) => fetcher<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables)(),
      options
    );
useUpdateProfileMutation.getKey = () => ['UpdateProfile'];

useUpdateProfileMutation.fetcher = (variables: Types.UpdateProfileMutationVariables, options?: RequestInit['headers']) => fetcher<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables, options);
export const CreateInterestsDocument = /*#__PURE__*/ `
    mutation CreateInterests($i: CreateInterestsInput!) {
  createInterests(input: $i) {
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
      (variables?: Types.CreateInterestsMutationVariables) => fetcher<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables)(),
      options
    );
useCreateInterestsMutation.getKey = () => ['CreateInterests'];

useCreateInterestsMutation.fetcher = (variables: Types.CreateInterestsMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables, options);
export const UpdateInterestsDocument = /*#__PURE__*/ `
    mutation UpdateInterests($i: UpdateInterestsInput!) {
  updateInterests(input: $i) {
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
      (variables?: Types.UpdateInterestsMutationVariables) => fetcher<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables)(),
      options
    );
useUpdateInterestsMutation.getKey = () => ['UpdateInterests'];

useUpdateInterestsMutation.fetcher = (variables: Types.UpdateInterestsMutationVariables, options?: RequestInit['headers']) => fetcher<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables, options);
export const CreateFollowDocument = /*#__PURE__*/ `
    mutation CreateFollow($i: CreateFollowInput!) {
  createFollow(input: $i) {
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
      (variables?: Types.CreateFollowMutationVariables) => fetcher<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables)(),
      options
    );
useCreateFollowMutation.getKey = () => ['CreateFollow'];

useCreateFollowMutation.fetcher = (variables: Types.CreateFollowMutationVariables, options?: RequestInit['headers']) => fetcher<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables, options);
export const UpdateFollowDocument = /*#__PURE__*/ `
    mutation UpdateFollow($i: UpdateFollowInput!) {
  updateFollow(input: $i) {
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
      (variables?: Types.UpdateFollowMutationVariables) => fetcher<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables)(),
      options
    );
useUpdateFollowMutation.getKey = () => ['UpdateFollow'];

useUpdateFollowMutation.fetcher = (variables: Types.UpdateFollowMutationVariables, options?: RequestInit['headers']) => fetcher<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables, options);