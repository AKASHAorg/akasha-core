import type * as Types from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

import { useMutation, useQuery, useInfiniteQuery, type UseMutationOptions, type UseQueryOptions, type UseInfiniteQueryOptions } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';

function composeDbFetch<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
  const sdk = getSDK();
  const gqlOptions = Object.assign({}, { context: { source: sdk.services.gql.contextSources.composeDB }}, options);
  return async () => {
    return sdk.services.gql.requester<TData, TVariables>(query, variables, gqlOptions);
  };
}

export const BeamFragmentMFragmentDoc = /*#__PURE__*/ `
    fragment BeamFragmentM on AkashaBeam {
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
export const ContentBlockFragmentMFragmentDoc = /*#__PURE__*/ `
    fragment ContentBlockFragmentM on AkashaContentBlock {
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
export const ReflectFragmentMFragmentDoc = /*#__PURE__*/ `
    fragment ReflectFragmentM on AkashaReflect {
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
export const UserProfileFragmentMFragmentDoc = /*#__PURE__*/ `
    fragment UserProfileFragmentM on AkashaProfile {
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
export const AkashaAppFragmentMFragmentDoc = /*#__PURE__*/ `
    fragment AkashaAppFragmentM on AkashaApp {
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
      ...UserProfileFragmentM
    }
  }
  contributors {
    id
    isViewer
    akashaProfile {
      ...UserProfileFragmentM
    }
  }
}
    `;
export const AppReleaseFragmentMFragmentDoc = /*#__PURE__*/ `
    fragment AppReleaseFragmentM on AkashaAppRelease {
  application {
    ...AkashaAppFragmentM
  }
  applicationID
  id
  source
  version
  createdAt
}
    `;
export const CreateBeamDocument = /*#__PURE__*/ `
    mutation CreateBeam($i: CreateAkashaBeamInput!) {
  createAkashaBeam(input: $i) {
    document {
      ...BeamFragmentM
    }
    clientMutationId
  }
}
    ${BeamFragmentMFragmentDoc}`;
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
      ...BeamFragmentM
    }
    clientMutationId
  }
}
    ${BeamFragmentMFragmentDoc}`;
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
      ...ContentBlockFragmentM
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentMFragmentDoc}`;
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
      ...ContentBlockFragmentM
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentMFragmentDoc}`;
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
export const CreateReflectDocument = /*#__PURE__*/ `
    mutation CreateReflect($i: CreateAkashaReflectInput!) {
  createAkashaReflect(input: $i) {
    document {
      ...ReflectFragmentM
    }
    clientMutationId
  }
}
    ${ReflectFragmentMFragmentDoc}`;
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
      ...ReflectFragmentM
    }
    clientMutationId
  }
}
    ${ReflectFragmentMFragmentDoc}`;
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
export const CreateProfileDocument = /*#__PURE__*/ `
    mutation CreateProfile($i: CreateAkashaProfileInput!) {
  createAkashaProfile(input: $i) {
    document {
      ...UserProfileFragmentM
    }
    clientMutationId
  }
}
    ${UserProfileFragmentMFragmentDoc}`;
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
      ...UserProfileFragmentM
    }
    clientMutationId
  }
}
    ${UserProfileFragmentMFragmentDoc}`;
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
    mutation CreateFollow($i: SetAkashaFollowInput!) {
  setAkashaFollow(input: $i) {
    document {
      isFollowing
      profile {
        ...UserProfileFragmentM
      }
      did {
        id
      }
      id
    }
  }
}
    ${UserProfileFragmentMFragmentDoc}`;
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
        ...UserProfileFragmentM
      }
      did {
        id
      }
      id
    }
  }
}
    ${UserProfileFragmentMFragmentDoc}`;
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
export const GetMyProfileDocument = /*#__PURE__*/ `
    query GetMyProfile {
  viewer {
    akashaProfile {
      ...UserProfileFragmentM
    }
  }
}
    ${UserProfileFragmentMFragmentDoc}`;
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
export const GetFollowDocumentsByDidDocument = /*#__PURE__*/ `
    query GetFollowDocumentsByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaFollowSortingInput, $following: [String!]) {
  node(id: $id) {
    ... on CeramicAccount {
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
              ...UserProfileFragmentM
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
    ${UserProfileFragmentMFragmentDoc}`;
export const useGetFollowDocumentsByDidQuery = <
      TData = Types.GetFollowDocumentsByDidQuery,
      TError = unknown
    >(
      variables: Types.GetFollowDocumentsByDidQueryVariables,
      options?: UseQueryOptions<Types.GetFollowDocumentsByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetFollowDocumentsByDidQuery, TError, TData>(
      ['GetFollowDocumentsByDid', variables],
      composeDbFetch<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>(GetFollowDocumentsByDidDocument, variables),
      options
    );
useGetFollowDocumentsByDidQuery.document = GetFollowDocumentsByDidDocument;


useGetFollowDocumentsByDidQuery.getKey = (variables: Types.GetFollowDocumentsByDidQueryVariables) => ['GetFollowDocumentsByDid', variables];
;

export const useInfiniteGetFollowDocumentsByDidQuery = <
      TData = Types.GetFollowDocumentsByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetFollowDocumentsByDidQueryVariables,
      variables: Types.GetFollowDocumentsByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetFollowDocumentsByDidQuery, TError, TData>
    ) =>{
    
    return useInfiniteQuery<Types.GetFollowDocumentsByDidQuery, TError, TData>(
      ['GetFollowDocumentsByDid.infinite', variables],
      (metaData) => composeDbFetch<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>(GetFollowDocumentsByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    )};


useInfiniteGetFollowDocumentsByDidQuery.getKey = (variables: Types.GetFollowDocumentsByDidQueryVariables) => ['GetFollowDocumentsByDid.infinite', variables];
;

useGetFollowDocumentsByDidQuery.fetcher = (variables: Types.GetFollowDocumentsByDidQueryVariables, options?: RequestInit['headers']) => composeDbFetch<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>(GetFollowDocumentsByDidDocument, variables, options);
export const SetAppReleaseDocument = /*#__PURE__*/ `
    mutation SetAppRelease($i: SetAkashaAppReleaseInput!) {
  setAkashaAppRelease(input: $i) {
    document {
      ...AppReleaseFragmentM
    }
    clientMutationId
  }
}
    ${AppReleaseFragmentMFragmentDoc}
${AkashaAppFragmentMFragmentDoc}
${UserProfileFragmentMFragmentDoc}`;
export const useSetAppReleaseMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.SetAppReleaseMutation, TError, Types.SetAppReleaseMutationVariables, TContext>) =>
    useMutation<Types.SetAppReleaseMutation, TError, Types.SetAppReleaseMutationVariables, TContext>(
      ['SetAppRelease'],
      (variables?: Types.SetAppReleaseMutationVariables) => composeDbFetch<Types.SetAppReleaseMutation, Types.SetAppReleaseMutationVariables>(SetAppReleaseDocument, variables)(),
      options
    );
useSetAppReleaseMutation.getKey = () => ['SetAppRelease'];

useSetAppReleaseMutation.fetcher = (variables: Types.SetAppReleaseMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.SetAppReleaseMutation, Types.SetAppReleaseMutationVariables>(SetAppReleaseDocument, variables, options);
export const UpdateAppReleaseDocument = /*#__PURE__*/ `
    mutation UpdateAppRelease($i: UpdateAkashaAppReleaseInput!) {
  updateAkashaAppRelease(input: $i) {
    document {
      ...AppReleaseFragmentM
    }
    clientMutationId
  }
}
    ${AppReleaseFragmentMFragmentDoc}
${AkashaAppFragmentMFragmentDoc}
${UserProfileFragmentMFragmentDoc}`;
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
export const CreateAppDocument = /*#__PURE__*/ `
    mutation CreateApp($i: SetAkashaAppInput!) {
  setAkashaApp(input: $i) {
    document {
      ...AkashaAppFragmentM
    }
    clientMutationId
  }
}
    ${AkashaAppFragmentMFragmentDoc}
${UserProfileFragmentMFragmentDoc}`;
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
      ...AkashaAppFragmentM
    }
    clientMutationId
  }
}
    ${AkashaAppFragmentMFragmentDoc}
${UserProfileFragmentMFragmentDoc}`;
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