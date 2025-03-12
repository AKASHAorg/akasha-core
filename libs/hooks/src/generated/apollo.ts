import type * as Types from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const IndexedBeamFragmentDoc = /*#__PURE__*/ gql`
    fragment IndexedBeamFragment on IndexBeamPayloadDocument {
  beamID
}
    `;
export const IndexedContentBlockFragmentDoc = /*#__PURE__*/ gql`
    fragment IndexedContentBlockFragment on IndexContentBlockPayloadDocument {
  blockID
}
    `;
export const BeamFragmentMFragmentDoc = /*#__PURE__*/ gql`
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
  appID
  appVersionID
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
export const ContentBlockFragmentMFragmentDoc = /*#__PURE__*/ gql`
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
export const BeamFragmentDoc = /*#__PURE__*/ gql`
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
  appVersionID
  appID
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
export const ContentBlockFragmentDoc = /*#__PURE__*/ gql`
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
export const BlockStorageFragmentDoc = /*#__PURE__*/ gql`
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
export const IndexedReflectFragmentDoc = /*#__PURE__*/ gql`
    fragment IndexedReflectFragment on IndexReflectPayloadDocument {
  reflectionID
}
    `;
export const ReflectFragmentMFragmentDoc = /*#__PURE__*/ gql`
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
export const ReflectFragmentDoc = /*#__PURE__*/ gql`
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
export const IndexedProfileFragmentDoc = /*#__PURE__*/ gql`
    fragment IndexedProfileFragment on IndexProfilePayloadDocument {
  profileID
}
    `;
export const UserProfileFragmentMFragmentDoc = /*#__PURE__*/ gql`
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
  appID
  appVersionID
  createdAt
  nsfw
}
    `;
export const AkashaAppFragmentMFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaAppFragmentM on AkashaApp {
  id
  applicationType
  description
  license
  name
  displayName
  keywords
  releases(first: 5, sorting: {createdAt: DESC}) {
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
export const AppReleaseFragmentMFragmentDoc = /*#__PURE__*/ gql`
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
export const AkashaWorldFragmentMFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldFragmentM on AkashaWorld {
  id
  icon {
    default {
      sizes
      src
      width
      height
    }
  }
  active
  name
  instanceURL
  createdAt
  creator {
    id
  }
  extensionPublishers {
    id
    akashaProfile {
      name
      id
      avatar {
        default {
          src
          width
          height
        }
      }
    }
  }
}
    `;
export const AkashaWorldConfigMFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldConfigM on AkashaWorldConfig {
  id
  worldID
  creator {
    id
  }
  active
  createdAt
  homepageExtension
  registryExtension
  layoutExtension
}
    `;
export const AkashaWorldConfigExtensionMFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldConfigExtensionM on AkashaWorldConfigExtension {
  id
  active
  createdAt
  worldConfigID
  extensionID
  extension {
    name
    displayName
    author {
      id
    }
    logoImage {
      src
      width
      height
    }
  }
  creator {
    id
  }
}
    `;
export const AkashaWorldMetaInfoMFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldMetaInfoM on AkashaWorldMetaInfo {
  id
  socialLinks {
    name
    href
  }
  worldID
  keywords
  description
  guidelinesUrl
}
    `;
export const UserProfileFragmentDoc = /*#__PURE__*/ gql`
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
  appVersionID
  appID
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
export const AkashaAppFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaAppFragment on AkashaApp {
  id
  applicationType
  description
  license
  name
  displayName
  keywords
  nsfw
  createdAt
  releases(first: 5, sorting: {createdAt: DESC}) {
    edges {
      node {
        id
        createdAt
        source
        version
        meta {
          property
          provider
          value
        }
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
  logoImage {
    height
    width
    src
  }
  coverImage {
    height
    width
    src
  }
  gallery {
    height
    width
    src
  }
  links {
    href
    label
  }
  contributors {
    id
    isViewer
    akashaProfile {
      ...UserProfileFragment
    }
  }
  meta {
    property
    provider
    value
  }
}
    `;
export const AppReleaseFragmentDoc = /*#__PURE__*/ gql`
    fragment AppReleaseFragment on AkashaAppRelease {
  application {
    ...AkashaAppFragment
  }
  applicationID
  id
  source
  version
  createdAt
  meta {
    provider
    property
    value
  }
}
    `;
export const AkashaWorldMetaInfoFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldMetaInfoFragment on AkashaWorldMetaInfo {
  id
  socialLinks {
    name
    href
  }
  worldID
  keywords
  description
  guidelinesUrl
}
    `;
export const AkashaWorldFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldFragment on AkashaWorld {
  id
  icon {
    default {
      sizes
      src
      width
      height
    }
  }
  active
  name
  instanceURL
  createdAt
  creator {
    id
  }
  extensionPublishers {
    id
    akashaProfile {
      name
      id
      avatar {
        default {
          src
          width
          height
        }
      }
    }
  }
}
    `;
export const AkashaWorldConfigFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldConfigFragment on AkashaWorldConfig {
  id
  worldID
  creator {
    id
  }
  active
  createdAt
  homepageExtension
  registryExtension
  layoutExtension
}
    `;
export const AkashaWorldConfigExtensionFragmentDoc = /*#__PURE__*/ gql`
    fragment AkashaWorldConfigExtensionFragment on AkashaWorldConfigExtension {
  id
  active
  createdAt
  worldConfigID
  extensionID
  extension {
    name
    displayName
    author {
      id
    }
    logoImage {
      src
      width
      height
    }
  }
  creator {
    id
  }
}
    `;
export const IndexBeamDocument = /*#__PURE__*/ gql`
    mutation IndexBeam($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexBeam(jws: $jws, capability: $capability) {
    document {
      ...IndexedBeamFragment
    }
  }
}
    ${IndexedBeamFragmentDoc}`;
export type IndexBeamMutationFn = Apollo.MutationFunction<Types.IndexBeamMutation, Types.IndexBeamMutationVariables>;

/**
 * __useIndexBeamMutation__
 *
 * To run a mutation, you first call `useIndexBeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIndexBeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [indexBeamMutation, { data, loading, error }] = useIndexBeamMutation({
 *   variables: {
 *      jws: // value for 'jws'
 *      capability: // value for 'capability'
 *   },
 * });
 */
export function useIndexBeamMutation(baseOptions?: Apollo.MutationHookOptions<Types.IndexBeamMutation, Types.IndexBeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.IndexBeamMutation, Types.IndexBeamMutationVariables>(IndexBeamDocument, options);
      }
export type IndexBeamMutationHookResult = ReturnType<typeof useIndexBeamMutation>;
export type IndexBeamMutationResult = Apollo.MutationResult<Types.IndexBeamMutation>;
export type IndexBeamMutationOptions = Apollo.BaseMutationOptions<Types.IndexBeamMutation, Types.IndexBeamMutationVariables>;
export const IndexContentBlockDocument = /*#__PURE__*/ gql`
    mutation IndexContentBlock($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexContentBlock(jws: $jws, capability: $capability) {
    document {
      ...IndexedContentBlockFragment
    }
  }
}
    ${IndexedContentBlockFragmentDoc}`;
export type IndexContentBlockMutationFn = Apollo.MutationFunction<Types.IndexContentBlockMutation, Types.IndexContentBlockMutationVariables>;

/**
 * __useIndexContentBlockMutation__
 *
 * To run a mutation, you first call `useIndexContentBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIndexContentBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [indexContentBlockMutation, { data, loading, error }] = useIndexContentBlockMutation({
 *   variables: {
 *      jws: // value for 'jws'
 *      capability: // value for 'capability'
 *   },
 * });
 */
export function useIndexContentBlockMutation(baseOptions?: Apollo.MutationHookOptions<Types.IndexContentBlockMutation, Types.IndexContentBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.IndexContentBlockMutation, Types.IndexContentBlockMutationVariables>(IndexContentBlockDocument, options);
      }
export type IndexContentBlockMutationHookResult = ReturnType<typeof useIndexContentBlockMutation>;
export type IndexContentBlockMutationResult = Apollo.MutationResult<Types.IndexContentBlockMutation>;
export type IndexContentBlockMutationOptions = Apollo.BaseMutationOptions<Types.IndexContentBlockMutation, Types.IndexContentBlockMutationVariables>;
export const CreateBeamDocument = /*#__PURE__*/ gql`
    mutation CreateBeam($i: CreateAkashaBeamInput!) {
  createAkashaBeam(input: $i) {
    document {
      ...BeamFragmentM
    }
    clientMutationId
  }
}
    ${BeamFragmentMFragmentDoc}`;
export type CreateBeamMutationFn = Apollo.MutationFunction<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>;

/**
 * __useCreateBeamMutation__
 *
 * To run a mutation, you first call `useCreateBeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBeamMutation, { data, loading, error }] = useCreateBeamMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateBeamMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>(CreateBeamDocument, options);
      }
export type CreateBeamMutationHookResult = ReturnType<typeof useCreateBeamMutation>;
export type CreateBeamMutationResult = Apollo.MutationResult<Types.CreateBeamMutation>;
export type CreateBeamMutationOptions = Apollo.BaseMutationOptions<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>;
export const UpdateBeamDocument = /*#__PURE__*/ gql`
    mutation UpdateBeam($i: UpdateAkashaBeamInput!) {
  updateAkashaBeam(input: $i) {
    document {
      ...BeamFragmentM
    }
    clientMutationId
  }
}
    ${BeamFragmentMFragmentDoc}`;
export type UpdateBeamMutationFn = Apollo.MutationFunction<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>;

/**
 * __useUpdateBeamMutation__
 *
 * To run a mutation, you first call `useUpdateBeamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBeamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBeamMutation, { data, loading, error }] = useUpdateBeamMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateBeamMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>(UpdateBeamDocument, options);
      }
export type UpdateBeamMutationHookResult = ReturnType<typeof useUpdateBeamMutation>;
export type UpdateBeamMutationResult = Apollo.MutationResult<Types.UpdateBeamMutation>;
export type UpdateBeamMutationOptions = Apollo.BaseMutationOptions<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>;
export const CreateContentBlockDocument = /*#__PURE__*/ gql`
    mutation CreateContentBlock($i: CreateAkashaContentBlockInput!) {
  createAkashaContentBlock(input: $i) {
    document {
      ...ContentBlockFragmentM
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentMFragmentDoc}`;
export type CreateContentBlockMutationFn = Apollo.MutationFunction<Types.CreateContentBlockMutation, Types.CreateContentBlockMutationVariables>;

/**
 * __useCreateContentBlockMutation__
 *
 * To run a mutation, you first call `useCreateContentBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContentBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContentBlockMutation, { data, loading, error }] = useCreateContentBlockMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateContentBlockMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateContentBlockMutation, Types.CreateContentBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateContentBlockMutation, Types.CreateContentBlockMutationVariables>(CreateContentBlockDocument, options);
      }
export type CreateContentBlockMutationHookResult = ReturnType<typeof useCreateContentBlockMutation>;
export type CreateContentBlockMutationResult = Apollo.MutationResult<Types.CreateContentBlockMutation>;
export type CreateContentBlockMutationOptions = Apollo.BaseMutationOptions<Types.CreateContentBlockMutation, Types.CreateContentBlockMutationVariables>;
export const UpdateContentBlockDocument = /*#__PURE__*/ gql`
    mutation UpdateContentBlock($i: UpdateAkashaContentBlockInput!) {
  updateAkashaContentBlock(input: $i) {
    document {
      ...ContentBlockFragmentM
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentMFragmentDoc}`;
export type UpdateContentBlockMutationFn = Apollo.MutationFunction<Types.UpdateContentBlockMutation, Types.UpdateContentBlockMutationVariables>;

/**
 * __useUpdateContentBlockMutation__
 *
 * To run a mutation, you first call `useUpdateContentBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContentBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContentBlockMutation, { data, loading, error }] = useUpdateContentBlockMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateContentBlockMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateContentBlockMutation, Types.UpdateContentBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateContentBlockMutation, Types.UpdateContentBlockMutationVariables>(UpdateContentBlockDocument, options);
      }
export type UpdateContentBlockMutationHookResult = ReturnType<typeof useUpdateContentBlockMutation>;
export type UpdateContentBlockMutationResult = Apollo.MutationResult<Types.UpdateContentBlockMutation>;
export type UpdateContentBlockMutationOptions = Apollo.BaseMutationOptions<Types.UpdateContentBlockMutation, Types.UpdateContentBlockMutationVariables>;
export const GetBeamStreamDocument = /*#__PURE__*/ gql`
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
            appID
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

/**
 * __useGetBeamStreamQuery__
 *
 * To run a query within a React component, call `useGetBeamStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeamStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeamStreamQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetBeamStreamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables> & ({ variables: Types.GetBeamStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>(GetBeamStreamDocument, options);
      }
export function useGetBeamStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>(GetBeamStreamDocument, options);
        }
export function useGetBeamStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>(GetBeamStreamDocument, options);
        }
export type GetBeamStreamQueryHookResult = ReturnType<typeof useGetBeamStreamQuery>;
export type GetBeamStreamLazyQueryHookResult = ReturnType<typeof useGetBeamStreamLazyQuery>;
export type GetBeamStreamSuspenseQueryHookResult = ReturnType<typeof useGetBeamStreamSuspenseQuery>;
export type GetBeamStreamQueryResult = Apollo.QueryResult<Types.GetBeamStreamQuery, Types.GetBeamStreamQueryVariables>;
export const GetBeamsDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetBeamsQuery__
 *
 * To run a query within a React component, call `useGetBeamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeamsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetBeamsQuery(baseOptions?: Apollo.QueryHookOptions<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, options);
      }
export function useGetBeamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, options);
        }
export function useGetBeamsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, options);
        }
export type GetBeamsQueryHookResult = ReturnType<typeof useGetBeamsQuery>;
export type GetBeamsLazyQueryHookResult = ReturnType<typeof useGetBeamsLazyQuery>;
export type GetBeamsSuspenseQueryHookResult = ReturnType<typeof useGetBeamsSuspenseQuery>;
export type GetBeamsQueryResult = Apollo.QueryResult<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>;
export const GetBeamsByAuthorDidDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetBeamsByAuthorDidQuery__
 *
 * To run a query within a React component, call `useGetBeamsByAuthorDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeamsByAuthorDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeamsByAuthorDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetBeamsByAuthorDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables> & ({ variables: Types.GetBeamsByAuthorDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, options);
      }
export function useGetBeamsByAuthorDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, options);
        }
export function useGetBeamsByAuthorDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, options);
        }
export type GetBeamsByAuthorDidQueryHookResult = ReturnType<typeof useGetBeamsByAuthorDidQuery>;
export type GetBeamsByAuthorDidLazyQueryHookResult = ReturnType<typeof useGetBeamsByAuthorDidLazyQuery>;
export type GetBeamsByAuthorDidSuspenseQueryHookResult = ReturnType<typeof useGetBeamsByAuthorDidSuspenseQuery>;
export type GetBeamsByAuthorDidQueryResult = Apollo.QueryResult<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>;
export const GetBeamByIdDocument = /*#__PURE__*/ gql`
    query GetBeamById($id: ID!) {
  node(id: $id) {
    ... on AkashaBeam {
      ...BeamFragment
    }
  }
}
    ${BeamFragmentDoc}`;

/**
 * __useGetBeamByIdQuery__
 *
 * To run a query within a React component, call `useGetBeamByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBeamByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBeamByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBeamByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables> & ({ variables: Types.GetBeamByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, options);
      }
export function useGetBeamByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, options);
        }
export function useGetBeamByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, options);
        }
export type GetBeamByIdQueryHookResult = ReturnType<typeof useGetBeamByIdQuery>;
export type GetBeamByIdLazyQueryHookResult = ReturnType<typeof useGetBeamByIdLazyQuery>;
export type GetBeamByIdSuspenseQueryHookResult = ReturnType<typeof useGetBeamByIdSuspenseQuery>;
export type GetBeamByIdQueryResult = Apollo.QueryResult<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>;
export const GetContentBlockStreamDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetContentBlockStreamQuery__
 *
 * To run a query within a React component, call `useGetContentBlockStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContentBlockStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContentBlockStreamQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetContentBlockStreamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables> & ({ variables: Types.GetContentBlockStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>(GetContentBlockStreamDocument, options);
      }
export function useGetContentBlockStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>(GetContentBlockStreamDocument, options);
        }
export function useGetContentBlockStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>(GetContentBlockStreamDocument, options);
        }
export type GetContentBlockStreamQueryHookResult = ReturnType<typeof useGetContentBlockStreamQuery>;
export type GetContentBlockStreamLazyQueryHookResult = ReturnType<typeof useGetContentBlockStreamLazyQuery>;
export type GetContentBlockStreamSuspenseQueryHookResult = ReturnType<typeof useGetContentBlockStreamSuspenseQuery>;
export type GetContentBlockStreamQueryResult = Apollo.QueryResult<Types.GetContentBlockStreamQuery, Types.GetContentBlockStreamQueryVariables>;
export const GetContentBlockByIdDocument = /*#__PURE__*/ gql`
    query GetContentBlockById($id: ID!) {
  node(id: $id) {
    ... on AkashaContentBlock {
      ...ContentBlockFragment
    }
  }
}
    ${ContentBlockFragmentDoc}`;

/**
 * __useGetContentBlockByIdQuery__
 *
 * To run a query within a React component, call `useGetContentBlockByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContentBlockByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContentBlockByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetContentBlockByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables> & ({ variables: Types.GetContentBlockByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>(GetContentBlockByIdDocument, options);
      }
export function useGetContentBlockByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>(GetContentBlockByIdDocument, options);
        }
export function useGetContentBlockByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>(GetContentBlockByIdDocument, options);
        }
export type GetContentBlockByIdQueryHookResult = ReturnType<typeof useGetContentBlockByIdQuery>;
export type GetContentBlockByIdLazyQueryHookResult = ReturnType<typeof useGetContentBlockByIdLazyQuery>;
export type GetContentBlockByIdSuspenseQueryHookResult = ReturnType<typeof useGetContentBlockByIdSuspenseQuery>;
export type GetContentBlockByIdQueryResult = Apollo.QueryResult<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>;
export const GetBlockStorageByIdDocument = /*#__PURE__*/ gql`
    query GetBlockStorageById($id: ID!) {
  node(id: $id) {
    ... on AkashaBlockStorage {
      ...BlockStorageFragment
    }
  }
}
    ${BlockStorageFragmentDoc}`;

/**
 * __useGetBlockStorageByIdQuery__
 *
 * To run a query within a React component, call `useGetBlockStorageByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockStorageByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlockStorageByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBlockStorageByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables> & ({ variables: Types.GetBlockStorageByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>(GetBlockStorageByIdDocument, options);
      }
export function useGetBlockStorageByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>(GetBlockStorageByIdDocument, options);
        }
export function useGetBlockStorageByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>(GetBlockStorageByIdDocument, options);
        }
export type GetBlockStorageByIdQueryHookResult = ReturnType<typeof useGetBlockStorageByIdQuery>;
export type GetBlockStorageByIdLazyQueryHookResult = ReturnType<typeof useGetBlockStorageByIdLazyQuery>;
export type GetBlockStorageByIdSuspenseQueryHookResult = ReturnType<typeof useGetBlockStorageByIdSuspenseQuery>;
export type GetBlockStorageByIdQueryResult = Apollo.QueryResult<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>;
export const GetIndexedStreamDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetIndexedStreamQuery__
 *
 * To run a query within a React component, call `useGetIndexedStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIndexedStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIndexedStreamQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetIndexedStreamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables> & ({ variables: Types.GetIndexedStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>(GetIndexedStreamDocument, options);
      }
export function useGetIndexedStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>(GetIndexedStreamDocument, options);
        }
export function useGetIndexedStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>(GetIndexedStreamDocument, options);
        }
export type GetIndexedStreamQueryHookResult = ReturnType<typeof useGetIndexedStreamQuery>;
export type GetIndexedStreamLazyQueryHookResult = ReturnType<typeof useGetIndexedStreamLazyQuery>;
export type GetIndexedStreamSuspenseQueryHookResult = ReturnType<typeof useGetIndexedStreamSuspenseQuery>;
export type GetIndexedStreamQueryResult = Apollo.QueryResult<Types.GetIndexedStreamQuery, Types.GetIndexedStreamQueryVariables>;
export const GetIndexedStreamCountDocument = /*#__PURE__*/ gql`
    query GetIndexedStreamCount($indexer: ID!, $filters: AkashaIndexedStreamFiltersInput) {
  node(id: $indexer) {
    ... on CeramicAccount {
      akashaIndexedStreamListCount(filters: $filters)
      isViewer
    }
  }
}
    `;

/**
 * __useGetIndexedStreamCountQuery__
 *
 * To run a query within a React component, call `useGetIndexedStreamCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIndexedStreamCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIndexedStreamCountQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetIndexedStreamCountQuery(baseOptions: Apollo.QueryHookOptions<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables> & ({ variables: Types.GetIndexedStreamCountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>(GetIndexedStreamCountDocument, options);
      }
export function useGetIndexedStreamCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>(GetIndexedStreamCountDocument, options);
        }
export function useGetIndexedStreamCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>(GetIndexedStreamCountDocument, options);
        }
export type GetIndexedStreamCountQueryHookResult = ReturnType<typeof useGetIndexedStreamCountQuery>;
export type GetIndexedStreamCountLazyQueryHookResult = ReturnType<typeof useGetIndexedStreamCountLazyQuery>;
export type GetIndexedStreamCountSuspenseQueryHookResult = ReturnType<typeof useGetIndexedStreamCountSuspenseQuery>;
export type GetIndexedStreamCountQueryResult = Apollo.QueryResult<Types.GetIndexedStreamCountQuery, Types.GetIndexedStreamCountQueryVariables>;
export const IndexReflectionDocument = /*#__PURE__*/ gql`
    mutation IndexReflection($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexReflection(jws: $jws, capability: $capability) {
    document {
      ...IndexedReflectFragment
    }
  }
}
    ${IndexedReflectFragmentDoc}`;
export type IndexReflectionMutationFn = Apollo.MutationFunction<Types.IndexReflectionMutation, Types.IndexReflectionMutationVariables>;

/**
 * __useIndexReflectionMutation__
 *
 * To run a mutation, you first call `useIndexReflectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIndexReflectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [indexReflectionMutation, { data, loading, error }] = useIndexReflectionMutation({
 *   variables: {
 *      jws: // value for 'jws'
 *      capability: // value for 'capability'
 *   },
 * });
 */
export function useIndexReflectionMutation(baseOptions?: Apollo.MutationHookOptions<Types.IndexReflectionMutation, Types.IndexReflectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.IndexReflectionMutation, Types.IndexReflectionMutationVariables>(IndexReflectionDocument, options);
      }
export type IndexReflectionMutationHookResult = ReturnType<typeof useIndexReflectionMutation>;
export type IndexReflectionMutationResult = Apollo.MutationResult<Types.IndexReflectionMutation>;
export type IndexReflectionMutationOptions = Apollo.BaseMutationOptions<Types.IndexReflectionMutation, Types.IndexReflectionMutationVariables>;
export const CreateReflectDocument = /*#__PURE__*/ gql`
    mutation CreateReflect($i: CreateAkashaReflectInput!) {
  createAkashaReflect(input: $i) {
    document {
      ...ReflectFragmentM
    }
    clientMutationId
  }
}
    ${ReflectFragmentMFragmentDoc}`;
export type CreateReflectMutationFn = Apollo.MutationFunction<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>;

/**
 * __useCreateReflectMutation__
 *
 * To run a mutation, you first call `useCreateReflectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReflectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReflectMutation, { data, loading, error }] = useCreateReflectMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateReflectMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>(CreateReflectDocument, options);
      }
export type CreateReflectMutationHookResult = ReturnType<typeof useCreateReflectMutation>;
export type CreateReflectMutationResult = Apollo.MutationResult<Types.CreateReflectMutation>;
export type CreateReflectMutationOptions = Apollo.BaseMutationOptions<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>;
export const UpdateAkashaReflectDocument = /*#__PURE__*/ gql`
    mutation UpdateAkashaReflect($i: UpdateAkashaReflectInput!) {
  updateAkashaReflect(input: $i) {
    document {
      ...ReflectFragmentM
    }
    clientMutationId
  }
}
    ${ReflectFragmentMFragmentDoc}`;
export type UpdateAkashaReflectMutationFn = Apollo.MutationFunction<Types.UpdateAkashaReflectMutation, Types.UpdateAkashaReflectMutationVariables>;

/**
 * __useUpdateAkashaReflectMutation__
 *
 * To run a mutation, you first call `useUpdateAkashaReflectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAkashaReflectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAkashaReflectMutation, { data, loading, error }] = useUpdateAkashaReflectMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateAkashaReflectMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateAkashaReflectMutation, Types.UpdateAkashaReflectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateAkashaReflectMutation, Types.UpdateAkashaReflectMutationVariables>(UpdateAkashaReflectDocument, options);
      }
export type UpdateAkashaReflectMutationHookResult = ReturnType<typeof useUpdateAkashaReflectMutation>;
export type UpdateAkashaReflectMutationResult = Apollo.MutationResult<Types.UpdateAkashaReflectMutation>;
export type UpdateAkashaReflectMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAkashaReflectMutation, Types.UpdateAkashaReflectMutationVariables>;
export const GetReflectionsFromBeamDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetReflectionsFromBeamQuery__
 *
 * To run a query within a React component, call `useGetReflectionsFromBeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReflectionsFromBeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReflectionsFromBeamQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sorting: // value for 'sorting'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetReflectionsFromBeamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables> & ({ variables: Types.GetReflectionsFromBeamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, options);
      }
export function useGetReflectionsFromBeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, options);
        }
export function useGetReflectionsFromBeamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, options);
        }
export type GetReflectionsFromBeamQueryHookResult = ReturnType<typeof useGetReflectionsFromBeamQuery>;
export type GetReflectionsFromBeamLazyQueryHookResult = ReturnType<typeof useGetReflectionsFromBeamLazyQuery>;
export type GetReflectionsFromBeamSuspenseQueryHookResult = ReturnType<typeof useGetReflectionsFromBeamSuspenseQuery>;
export type GetReflectionsFromBeamQueryResult = Apollo.QueryResult<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>;
export const GetReflectionsByAuthorDidDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetReflectionsByAuthorDidQuery__
 *
 * To run a query within a React component, call `useGetReflectionsByAuthorDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReflectionsByAuthorDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReflectionsByAuthorDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetReflectionsByAuthorDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables> & ({ variables: Types.GetReflectionsByAuthorDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, options);
      }
export function useGetReflectionsByAuthorDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, options);
        }
export function useGetReflectionsByAuthorDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, options);
        }
export type GetReflectionsByAuthorDidQueryHookResult = ReturnType<typeof useGetReflectionsByAuthorDidQuery>;
export type GetReflectionsByAuthorDidLazyQueryHookResult = ReturnType<typeof useGetReflectionsByAuthorDidLazyQuery>;
export type GetReflectionsByAuthorDidSuspenseQueryHookResult = ReturnType<typeof useGetReflectionsByAuthorDidSuspenseQuery>;
export type GetReflectionsByAuthorDidQueryResult = Apollo.QueryResult<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>;
export const GetReflectionStreamDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetReflectionStreamQuery__
 *
 * To run a query within a React component, call `useGetReflectionStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReflectionStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReflectionStreamQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetReflectionStreamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables> & ({ variables: Types.GetReflectionStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>(GetReflectionStreamDocument, options);
      }
export function useGetReflectionStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>(GetReflectionStreamDocument, options);
        }
export function useGetReflectionStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>(GetReflectionStreamDocument, options);
        }
export type GetReflectionStreamQueryHookResult = ReturnType<typeof useGetReflectionStreamQuery>;
export type GetReflectionStreamLazyQueryHookResult = ReturnType<typeof useGetReflectionStreamLazyQuery>;
export type GetReflectionStreamSuspenseQueryHookResult = ReturnType<typeof useGetReflectionStreamSuspenseQuery>;
export type GetReflectionStreamQueryResult = Apollo.QueryResult<Types.GetReflectionStreamQuery, Types.GetReflectionStreamQueryVariables>;
export const GetReflectionByIdDocument = /*#__PURE__*/ gql`
    query GetReflectionById($id: ID!) {
  node(id: $id) {
    ... on AkashaReflect {
      ...ReflectFragment
    }
  }
}
    ${ReflectFragmentDoc}`;

/**
 * __useGetReflectionByIdQuery__
 *
 * To run a query within a React component, call `useGetReflectionByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReflectionByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReflectionByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReflectionByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables> & ({ variables: Types.GetReflectionByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>(GetReflectionByIdDocument, options);
      }
export function useGetReflectionByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>(GetReflectionByIdDocument, options);
        }
export function useGetReflectionByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>(GetReflectionByIdDocument, options);
        }
export type GetReflectionByIdQueryHookResult = ReturnType<typeof useGetReflectionByIdQuery>;
export type GetReflectionByIdLazyQueryHookResult = ReturnType<typeof useGetReflectionByIdLazyQuery>;
export type GetReflectionByIdSuspenseQueryHookResult = ReturnType<typeof useGetReflectionByIdSuspenseQuery>;
export type GetReflectionByIdQueryResult = Apollo.QueryResult<Types.GetReflectionByIdQuery, Types.GetReflectionByIdQueryVariables>;
export const GetReflectReflectionsDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetReflectReflectionsQuery__
 *
 * To run a query within a React component, call `useGetReflectReflectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReflectReflectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReflectReflectionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetReflectReflectionsQuery(baseOptions: Apollo.QueryHookOptions<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables> & ({ variables: Types.GetReflectReflectionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, options);
      }
export function useGetReflectReflectionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, options);
        }
export function useGetReflectReflectionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, options);
        }
export type GetReflectReflectionsQueryHookResult = ReturnType<typeof useGetReflectReflectionsQuery>;
export type GetReflectReflectionsLazyQueryHookResult = ReturnType<typeof useGetReflectReflectionsLazyQuery>;
export type GetReflectReflectionsSuspenseQueryHookResult = ReturnType<typeof useGetReflectReflectionsSuspenseQuery>;
export type GetReflectReflectionsQueryResult = Apollo.QueryResult<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>;
export const IndexProfileDocument = /*#__PURE__*/ gql`
    mutation IndexProfile($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexProfile(jws: $jws, capability: $capability) {
    document {
      ...IndexedProfileFragment
    }
  }
}
    ${IndexedProfileFragmentDoc}`;
export type IndexProfileMutationFn = Apollo.MutationFunction<Types.IndexProfileMutation, Types.IndexProfileMutationVariables>;

/**
 * __useIndexProfileMutation__
 *
 * To run a mutation, you first call `useIndexProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIndexProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [indexProfileMutation, { data, loading, error }] = useIndexProfileMutation({
 *   variables: {
 *      jws: // value for 'jws'
 *      capability: // value for 'capability'
 *   },
 * });
 */
export function useIndexProfileMutation(baseOptions?: Apollo.MutationHookOptions<Types.IndexProfileMutation, Types.IndexProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.IndexProfileMutation, Types.IndexProfileMutationVariables>(IndexProfileDocument, options);
      }
export type IndexProfileMutationHookResult = ReturnType<typeof useIndexProfileMutation>;
export type IndexProfileMutationResult = Apollo.MutationResult<Types.IndexProfileMutation>;
export type IndexProfileMutationOptions = Apollo.BaseMutationOptions<Types.IndexProfileMutation, Types.IndexProfileMutationVariables>;
export const CreateProfileDocument = /*#__PURE__*/ gql`
    mutation CreateProfile($i: SetAkashaProfileInput!) {
  setAkashaProfile(input: $i) {
    document {
      ...UserProfileFragmentM
    }
    clientMutationId
  }
}
    ${UserProfileFragmentMFragmentDoc}`;
export type CreateProfileMutationFn = Apollo.MutationFunction<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>;

/**
 * __useCreateProfileMutation__
 *
 * To run a mutation, you first call `useCreateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProfileMutation, { data, loading, error }] = useCreateProfileMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateProfileMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, options);
      }
export type CreateProfileMutationHookResult = ReturnType<typeof useCreateProfileMutation>;
export type CreateProfileMutationResult = Apollo.MutationResult<Types.CreateProfileMutation>;
export type CreateProfileMutationOptions = Apollo.BaseMutationOptions<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>;
export const UpdateProfileDocument = /*#__PURE__*/ gql`
    mutation UpdateProfile($i: UpdateAkashaProfileInput!) {
  updateAkashaProfile(input: $i) {
    document {
      ...UserProfileFragmentM
    }
    clientMutationId
  }
}
    ${UserProfileFragmentMFragmentDoc}`;
export type UpdateProfileMutationFn = Apollo.MutationFunction<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<Types.UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>;
export const CreateInterestsDocument = /*#__PURE__*/ gql`
    mutation CreateInterests($i: SetAkashaProfileInterestsInput!) {
  setAkashaProfileInterests(input: $i) {
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
export type CreateInterestsMutationFn = Apollo.MutationFunction<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>;

/**
 * __useCreateInterestsMutation__
 *
 * To run a mutation, you first call `useCreateInterestsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInterestsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInterestsMutation, { data, loading, error }] = useCreateInterestsMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateInterestsMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, options);
      }
export type CreateInterestsMutationHookResult = ReturnType<typeof useCreateInterestsMutation>;
export type CreateInterestsMutationResult = Apollo.MutationResult<Types.CreateInterestsMutation>;
export type CreateInterestsMutationOptions = Apollo.BaseMutationOptions<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>;
export const UpdateInterestsDocument = /*#__PURE__*/ gql`
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
export type UpdateInterestsMutationFn = Apollo.MutationFunction<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>;

/**
 * __useUpdateInterestsMutation__
 *
 * To run a mutation, you first call `useUpdateInterestsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateInterestsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateInterestsMutation, { data, loading, error }] = useUpdateInterestsMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateInterestsMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, options);
      }
export type UpdateInterestsMutationHookResult = ReturnType<typeof useUpdateInterestsMutation>;
export type UpdateInterestsMutationResult = Apollo.MutationResult<Types.UpdateInterestsMutation>;
export type UpdateInterestsMutationOptions = Apollo.BaseMutationOptions<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>;
export const CreateFollowDocument = /*#__PURE__*/ gql`
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
export type CreateFollowMutationFn = Apollo.MutationFunction<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>;

/**
 * __useCreateFollowMutation__
 *
 * To run a mutation, you first call `useCreateFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFollowMutation, { data, loading, error }] = useCreateFollowMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateFollowMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, options);
      }
export type CreateFollowMutationHookResult = ReturnType<typeof useCreateFollowMutation>;
export type CreateFollowMutationResult = Apollo.MutationResult<Types.CreateFollowMutation>;
export type CreateFollowMutationOptions = Apollo.BaseMutationOptions<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>;
export const UpdateFollowDocument = /*#__PURE__*/ gql`
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
export type UpdateFollowMutationFn = Apollo.MutationFunction<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>;

/**
 * __useUpdateFollowMutation__
 *
 * To run a mutation, you first call `useUpdateFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFollowMutation, { data, loading, error }] = useUpdateFollowMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateFollowMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, options);
      }
export type UpdateFollowMutationHookResult = ReturnType<typeof useUpdateFollowMutation>;
export type UpdateFollowMutationResult = Apollo.MutationResult<Types.UpdateFollowMutation>;
export type UpdateFollowMutationOptions = Apollo.BaseMutationOptions<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>;
export const GetMyProfileDocument = /*#__PURE__*/ gql`
    query GetMyProfile {
  viewer {
    akashaProfile {
      ...UserProfileFragmentM
    }
  }
}
    ${UserProfileFragmentMFragmentDoc}`;

/**
 * __useGetMyProfileQuery__
 *
 * To run a query within a React component, call `useGetMyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyProfileQuery(baseOptions?: Apollo.QueryHookOptions<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, options);
      }
export function useGetMyProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
export function useGetMyProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, options);
        }
export type GetMyProfileQueryHookResult = ReturnType<typeof useGetMyProfileQuery>;
export type GetMyProfileLazyQueryHookResult = ReturnType<typeof useGetMyProfileLazyQuery>;
export type GetMyProfileSuspenseQueryHookResult = ReturnType<typeof useGetMyProfileSuspenseQuery>;
export type GetMyProfileQueryResult = Apollo.QueryResult<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>;
export const GetFollowDocumentsByDidDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetFollowDocumentsByDidQuery__
 *
 * To run a query within a React component, call `useGetFollowDocumentsByDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowDocumentsByDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowDocumentsByDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sorting: // value for 'sorting'
 *      following: // value for 'following'
 *   },
 * });
 */
export function useGetFollowDocumentsByDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables> & ({ variables: Types.GetFollowDocumentsByDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>(GetFollowDocumentsByDidDocument, options);
      }
export function useGetFollowDocumentsByDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>(GetFollowDocumentsByDidDocument, options);
        }
export function useGetFollowDocumentsByDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>(GetFollowDocumentsByDidDocument, options);
        }
export type GetFollowDocumentsByDidQueryHookResult = ReturnType<typeof useGetFollowDocumentsByDidQuery>;
export type GetFollowDocumentsByDidLazyQueryHookResult = ReturnType<typeof useGetFollowDocumentsByDidLazyQuery>;
export type GetFollowDocumentsByDidSuspenseQueryHookResult = ReturnType<typeof useGetFollowDocumentsByDidSuspenseQuery>;
export type GetFollowDocumentsByDidQueryResult = Apollo.QueryResult<Types.GetFollowDocumentsByDidQuery, Types.GetFollowDocumentsByDidQueryVariables>;
export const GetProfileByIdDocument = /*#__PURE__*/ gql`
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on AkashaProfile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;

/**
 * __useGetProfileByIdQuery__
 *
 * To run a query within a React component, call `useGetProfileByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProfileByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables> & ({ variables: Types.GetProfileByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, options);
      }
export function useGetProfileByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, options);
        }
export function useGetProfileByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, options);
        }
export type GetProfileByIdQueryHookResult = ReturnType<typeof useGetProfileByIdQuery>;
export type GetProfileByIdLazyQueryHookResult = ReturnType<typeof useGetProfileByIdLazyQuery>;
export type GetProfileByIdSuspenseQueryHookResult = ReturnType<typeof useGetProfileByIdSuspenseQuery>;
export type GetProfileByIdQueryResult = Apollo.QueryResult<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>;
export const GetProfileByDidDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetProfileByDidQuery__
 *
 * To run a query within a React component, call `useGetProfileByDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileByDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileByDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProfileByDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables> & ({ variables: Types.GetProfileByDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, options);
      }
export function useGetProfileByDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, options);
        }
export function useGetProfileByDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, options);
        }
export type GetProfileByDidQueryHookResult = ReturnType<typeof useGetProfileByDidQuery>;
export type GetProfileByDidLazyQueryHookResult = ReturnType<typeof useGetProfileByDidLazyQuery>;
export type GetProfileByDidSuspenseQueryHookResult = ReturnType<typeof useGetProfileByDidSuspenseQuery>;
export type GetProfileByDidQueryResult = Apollo.QueryResult<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>;
export const GetProfilesDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetProfilesQuery__
 *
 * To run a query within a React component, call `useGetProfilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfilesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetProfilesQuery(baseOptions?: Apollo.QueryHookOptions<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, options);
      }
export function useGetProfilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, options);
        }
export function useGetProfilesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, options);
        }
export type GetProfilesQueryHookResult = ReturnType<typeof useGetProfilesQuery>;
export type GetProfilesLazyQueryHookResult = ReturnType<typeof useGetProfilesLazyQuery>;
export type GetProfilesSuspenseQueryHookResult = ReturnType<typeof useGetProfilesSuspenseQuery>;
export type GetProfilesQueryResult = Apollo.QueryResult<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>;
export const GetProfileStreamDocument = /*#__PURE__*/ gql`
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
            appID
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

/**
 * __useGetProfileStreamQuery__
 *
 * To run a query within a React component, call `useGetProfileStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileStreamQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetProfileStreamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables> & ({ variables: Types.GetProfileStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>(GetProfileStreamDocument, options);
      }
export function useGetProfileStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>(GetProfileStreamDocument, options);
        }
export function useGetProfileStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>(GetProfileStreamDocument, options);
        }
export type GetProfileStreamQueryHookResult = ReturnType<typeof useGetProfileStreamQuery>;
export type GetProfileStreamLazyQueryHookResult = ReturnType<typeof useGetProfileStreamLazyQuery>;
export type GetProfileStreamSuspenseQueryHookResult = ReturnType<typeof useGetProfileStreamSuspenseQuery>;
export type GetProfileStreamQueryResult = Apollo.QueryResult<Types.GetProfileStreamQuery, Types.GetProfileStreamQueryVariables>;
export const GetInterestsDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetInterestsQuery__
 *
 * To run a query within a React component, call `useGetInterestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInterestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInterestsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useGetInterestsQuery(baseOptions?: Apollo.QueryHookOptions<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, options);
      }
export function useGetInterestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, options);
        }
export function useGetInterestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, options);
        }
export type GetInterestsQueryHookResult = ReturnType<typeof useGetInterestsQuery>;
export type GetInterestsLazyQueryHookResult = ReturnType<typeof useGetInterestsLazyQuery>;
export type GetInterestsSuspenseQueryHookResult = ReturnType<typeof useGetInterestsSuspenseQuery>;
export type GetInterestsQueryResult = Apollo.QueryResult<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>;
export const GetInterestsStreamDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetInterestsStreamQuery__
 *
 * To run a query within a React component, call `useGetInterestsStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInterestsStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInterestsStreamQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sorting: // value for 'sorting'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetInterestsStreamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables> & ({ variables: Types.GetInterestsStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, options);
      }
export function useGetInterestsStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, options);
        }
export function useGetInterestsStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>(GetInterestsStreamDocument, options);
        }
export type GetInterestsStreamQueryHookResult = ReturnType<typeof useGetInterestsStreamQuery>;
export type GetInterestsStreamLazyQueryHookResult = ReturnType<typeof useGetInterestsStreamLazyQuery>;
export type GetInterestsStreamSuspenseQueryHookResult = ReturnType<typeof useGetInterestsStreamSuspenseQuery>;
export type GetInterestsStreamQueryResult = Apollo.QueryResult<Types.GetInterestsStreamQuery, Types.GetInterestsStreamQueryVariables>;
export const GetInterestsByDidDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetInterestsByDidQuery__
 *
 * To run a query within a React component, call `useGetInterestsByDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInterestsByDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInterestsByDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInterestsByDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables> & ({ variables: Types.GetInterestsByDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, options);
      }
export function useGetInterestsByDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, options);
        }
export function useGetInterestsByDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, options);
        }
export type GetInterestsByDidQueryHookResult = ReturnType<typeof useGetInterestsByDidQuery>;
export type GetInterestsByDidLazyQueryHookResult = ReturnType<typeof useGetInterestsByDidLazyQuery>;
export type GetInterestsByDidSuspenseQueryHookResult = ReturnType<typeof useGetInterestsByDidSuspenseQuery>;
export type GetInterestsByDidQueryResult = Apollo.QueryResult<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>;
export const GetInterestsByIdDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetInterestsByIdQuery__
 *
 * To run a query within a React component, call `useGetInterestsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInterestsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInterestsByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInterestsByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables> & ({ variables: Types.GetInterestsByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, options);
      }
export function useGetInterestsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, options);
        }
export function useGetInterestsByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, options);
        }
export type GetInterestsByIdQueryHookResult = ReturnType<typeof useGetInterestsByIdQuery>;
export type GetInterestsByIdLazyQueryHookResult = ReturnType<typeof useGetInterestsByIdLazyQuery>;
export type GetInterestsByIdSuspenseQueryHookResult = ReturnType<typeof useGetInterestsByIdSuspenseQuery>;
export type GetInterestsByIdQueryResult = Apollo.QueryResult<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>;
export const GetFollowingListByDidDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetFollowingListByDidQuery__
 *
 * To run a query within a React component, call `useGetFollowingListByDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingListByDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingListByDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetFollowingListByDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables> & ({ variables: Types.GetFollowingListByDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, options);
      }
export function useGetFollowingListByDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, options);
        }
export function useGetFollowingListByDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, options);
        }
export type GetFollowingListByDidQueryHookResult = ReturnType<typeof useGetFollowingListByDidQuery>;
export type GetFollowingListByDidLazyQueryHookResult = ReturnType<typeof useGetFollowingListByDidLazyQuery>;
export type GetFollowingListByDidSuspenseQueryHookResult = ReturnType<typeof useGetFollowingListByDidSuspenseQuery>;
export type GetFollowingListByDidQueryResult = Apollo.QueryResult<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>;
export const GetFollowersListByDidDocument = /*#__PURE__*/ gql`
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
      }
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;

/**
 * __useGetFollowersListByDidQuery__
 *
 * To run a query within a React component, call `useGetFollowersListByDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersListByDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersListByDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetFollowersListByDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables> & ({ variables: Types.GetFollowersListByDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, options);
      }
export function useGetFollowersListByDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, options);
        }
export function useGetFollowersListByDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, options);
        }
export type GetFollowersListByDidQueryHookResult = ReturnType<typeof useGetFollowersListByDidQuery>;
export type GetFollowersListByDidLazyQueryHookResult = ReturnType<typeof useGetFollowersListByDidLazyQuery>;
export type GetFollowersListByDidSuspenseQueryHookResult = ReturnType<typeof useGetFollowersListByDidSuspenseQuery>;
export type GetFollowersListByDidQueryResult = Apollo.QueryResult<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>;
export const GetProfileStatsByDidDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetProfileStatsByDidQuery__
 *
 * To run a query within a React component, call `useGetProfileStatsByDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileStatsByDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileStatsByDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProfileStatsByDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables> & ({ variables: Types.GetProfileStatsByDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>(GetProfileStatsByDidDocument, options);
      }
export function useGetProfileStatsByDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>(GetProfileStatsByDidDocument, options);
        }
export function useGetProfileStatsByDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>(GetProfileStatsByDidDocument, options);
        }
export type GetProfileStatsByDidQueryHookResult = ReturnType<typeof useGetProfileStatsByDidQuery>;
export type GetProfileStatsByDidLazyQueryHookResult = ReturnType<typeof useGetProfileStatsByDidLazyQuery>;
export type GetProfileStatsByDidSuspenseQueryHookResult = ReturnType<typeof useGetProfileStatsByDidSuspenseQuery>;
export type GetProfileStatsByDidQueryResult = Apollo.QueryResult<Types.GetProfileStatsByDidQuery, Types.GetProfileStatsByDidQueryVariables>;
export const SetAppReleaseDocument = /*#__PURE__*/ gql`
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
export type SetAppReleaseMutationFn = Apollo.MutationFunction<Types.SetAppReleaseMutation, Types.SetAppReleaseMutationVariables>;

/**
 * __useSetAppReleaseMutation__
 *
 * To run a mutation, you first call `useSetAppReleaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAppReleaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAppReleaseMutation, { data, loading, error }] = useSetAppReleaseMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useSetAppReleaseMutation(baseOptions?: Apollo.MutationHookOptions<Types.SetAppReleaseMutation, Types.SetAppReleaseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.SetAppReleaseMutation, Types.SetAppReleaseMutationVariables>(SetAppReleaseDocument, options);
      }
export type SetAppReleaseMutationHookResult = ReturnType<typeof useSetAppReleaseMutation>;
export type SetAppReleaseMutationResult = Apollo.MutationResult<Types.SetAppReleaseMutation>;
export type SetAppReleaseMutationOptions = Apollo.BaseMutationOptions<Types.SetAppReleaseMutation, Types.SetAppReleaseMutationVariables>;
export const UpdateAppReleaseDocument = /*#__PURE__*/ gql`
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
export type UpdateAppReleaseMutationFn = Apollo.MutationFunction<Types.UpdateAppReleaseMutation, Types.UpdateAppReleaseMutationVariables>;

/**
 * __useUpdateAppReleaseMutation__
 *
 * To run a mutation, you first call `useUpdateAppReleaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAppReleaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAppReleaseMutation, { data, loading, error }] = useUpdateAppReleaseMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateAppReleaseMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateAppReleaseMutation, Types.UpdateAppReleaseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateAppReleaseMutation, Types.UpdateAppReleaseMutationVariables>(UpdateAppReleaseDocument, options);
      }
export type UpdateAppReleaseMutationHookResult = ReturnType<typeof useUpdateAppReleaseMutation>;
export type UpdateAppReleaseMutationResult = Apollo.MutationResult<Types.UpdateAppReleaseMutation>;
export type UpdateAppReleaseMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAppReleaseMutation, Types.UpdateAppReleaseMutationVariables>;
export const CreateAppDocument = /*#__PURE__*/ gql`
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
export type CreateAppMutationFn = Apollo.MutationFunction<Types.CreateAppMutation, Types.CreateAppMutationVariables>;

/**
 * __useCreateAppMutation__
 *
 * To run a mutation, you first call `useCreateAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppMutation, { data, loading, error }] = useCreateAppMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateAppMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateAppMutation, Types.CreateAppMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateAppMutation, Types.CreateAppMutationVariables>(CreateAppDocument, options);
      }
export type CreateAppMutationHookResult = ReturnType<typeof useCreateAppMutation>;
export type CreateAppMutationResult = Apollo.MutationResult<Types.CreateAppMutation>;
export type CreateAppMutationOptions = Apollo.BaseMutationOptions<Types.CreateAppMutation, Types.CreateAppMutationVariables>;
export const UpdateAppDocument = /*#__PURE__*/ gql`
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
export type UpdateAppMutationFn = Apollo.MutationFunction<Types.UpdateAppMutation, Types.UpdateAppMutationVariables>;

/**
 * __useUpdateAppMutation__
 *
 * To run a mutation, you first call `useUpdateAppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAppMutation, { data, loading, error }] = useUpdateAppMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateAppMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateAppMutation, Types.UpdateAppMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateAppMutation, Types.UpdateAppMutationVariables>(UpdateAppDocument, options);
      }
export type UpdateAppMutationHookResult = ReturnType<typeof useUpdateAppMutation>;
export type UpdateAppMutationResult = Apollo.MutationResult<Types.UpdateAppMutation>;
export type UpdateAppMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAppMutation, Types.UpdateAppMutationVariables>;
export const CreateWorldDocument = /*#__PURE__*/ gql`
    mutation CreateWorld($i: SetAkashaWorldInput!) {
  setAkashaWorld(input: $i) {
    document {
      ...AkashaWorldFragmentM
    }
    clientMutationId
  }
}
    ${AkashaWorldFragmentMFragmentDoc}`;
export type CreateWorldMutationFn = Apollo.MutationFunction<Types.CreateWorldMutation, Types.CreateWorldMutationVariables>;

/**
 * __useCreateWorldMutation__
 *
 * To run a mutation, you first call `useCreateWorldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorldMutation, { data, loading, error }] = useCreateWorldMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateWorldMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateWorldMutation, Types.CreateWorldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateWorldMutation, Types.CreateWorldMutationVariables>(CreateWorldDocument, options);
      }
export type CreateWorldMutationHookResult = ReturnType<typeof useCreateWorldMutation>;
export type CreateWorldMutationResult = Apollo.MutationResult<Types.CreateWorldMutation>;
export type CreateWorldMutationOptions = Apollo.BaseMutationOptions<Types.CreateWorldMutation, Types.CreateWorldMutationVariables>;
export const UpdateWorldDocument = /*#__PURE__*/ gql`
    mutation UpdateWorld($i: UpdateAkashaWorldInput!) {
  updateAkashaWorld(input: $i) {
    document {
      ...AkashaWorldFragmentM
    }
    clientMutationId
  }
}
    ${AkashaWorldFragmentMFragmentDoc}`;
export type UpdateWorldMutationFn = Apollo.MutationFunction<Types.UpdateWorldMutation, Types.UpdateWorldMutationVariables>;

/**
 * __useUpdateWorldMutation__
 *
 * To run a mutation, you first call `useUpdateWorldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorldMutation, { data, loading, error }] = useUpdateWorldMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateWorldMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateWorldMutation, Types.UpdateWorldMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateWorldMutation, Types.UpdateWorldMutationVariables>(UpdateWorldDocument, options);
      }
export type UpdateWorldMutationHookResult = ReturnType<typeof useUpdateWorldMutation>;
export type UpdateWorldMutationResult = Apollo.MutationResult<Types.UpdateWorldMutation>;
export type UpdateWorldMutationOptions = Apollo.BaseMutationOptions<Types.UpdateWorldMutation, Types.UpdateWorldMutationVariables>;
export const CreateAkashaWorldConfigDocument = /*#__PURE__*/ gql`
    mutation CreateAkashaWorldConfig($i: SetAkashaWorldConfigInput!) {
  setAkashaWorldConfig(input: $i) {
    document {
      ...AkashaWorldConfigM
    }
    clientMutationId
  }
}
    ${AkashaWorldConfigMFragmentDoc}`;
export type CreateAkashaWorldConfigMutationFn = Apollo.MutationFunction<Types.CreateAkashaWorldConfigMutation, Types.CreateAkashaWorldConfigMutationVariables>;

/**
 * __useCreateAkashaWorldConfigMutation__
 *
 * To run a mutation, you first call `useCreateAkashaWorldConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAkashaWorldConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAkashaWorldConfigMutation, { data, loading, error }] = useCreateAkashaWorldConfigMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateAkashaWorldConfigMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateAkashaWorldConfigMutation, Types.CreateAkashaWorldConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateAkashaWorldConfigMutation, Types.CreateAkashaWorldConfigMutationVariables>(CreateAkashaWorldConfigDocument, options);
      }
export type CreateAkashaWorldConfigMutationHookResult = ReturnType<typeof useCreateAkashaWorldConfigMutation>;
export type CreateAkashaWorldConfigMutationResult = Apollo.MutationResult<Types.CreateAkashaWorldConfigMutation>;
export type CreateAkashaWorldConfigMutationOptions = Apollo.BaseMutationOptions<Types.CreateAkashaWorldConfigMutation, Types.CreateAkashaWorldConfigMutationVariables>;
export const UpdateAkashaWorldConfigDocument = /*#__PURE__*/ gql`
    mutation UpdateAkashaWorldConfig($i: UpdateAkashaWorldConfigInput!) {
  updateAkashaWorldConfig(input: $i) {
    document {
      ...AkashaWorldConfigM
    }
    clientMutationId
  }
}
    ${AkashaWorldConfigMFragmentDoc}`;
export type UpdateAkashaWorldConfigMutationFn = Apollo.MutationFunction<Types.UpdateAkashaWorldConfigMutation, Types.UpdateAkashaWorldConfigMutationVariables>;

/**
 * __useUpdateAkashaWorldConfigMutation__
 *
 * To run a mutation, you first call `useUpdateAkashaWorldConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAkashaWorldConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAkashaWorldConfigMutation, { data, loading, error }] = useUpdateAkashaWorldConfigMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateAkashaWorldConfigMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateAkashaWorldConfigMutation, Types.UpdateAkashaWorldConfigMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateAkashaWorldConfigMutation, Types.UpdateAkashaWorldConfigMutationVariables>(UpdateAkashaWorldConfigDocument, options);
      }
export type UpdateAkashaWorldConfigMutationHookResult = ReturnType<typeof useUpdateAkashaWorldConfigMutation>;
export type UpdateAkashaWorldConfigMutationResult = Apollo.MutationResult<Types.UpdateAkashaWorldConfigMutation>;
export type UpdateAkashaWorldConfigMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAkashaWorldConfigMutation, Types.UpdateAkashaWorldConfigMutationVariables>;
export const CreateAkashaWorldConfigExtensionDocument = /*#__PURE__*/ gql`
    mutation CreateAkashaWorldConfigExtension($i: SetAkashaWorldConfigExtensionInput!) {
  setAkashaWorldConfigExtension(input: $i) {
    document {
      ...AkashaWorldConfigExtensionM
    }
    clientMutationId
  }
}
    ${AkashaWorldConfigExtensionMFragmentDoc}`;
export type CreateAkashaWorldConfigExtensionMutationFn = Apollo.MutationFunction<Types.CreateAkashaWorldConfigExtensionMutation, Types.CreateAkashaWorldConfigExtensionMutationVariables>;

/**
 * __useCreateAkashaWorldConfigExtensionMutation__
 *
 * To run a mutation, you first call `useCreateAkashaWorldConfigExtensionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAkashaWorldConfigExtensionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAkashaWorldConfigExtensionMutation, { data, loading, error }] = useCreateAkashaWorldConfigExtensionMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateAkashaWorldConfigExtensionMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateAkashaWorldConfigExtensionMutation, Types.CreateAkashaWorldConfigExtensionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateAkashaWorldConfigExtensionMutation, Types.CreateAkashaWorldConfigExtensionMutationVariables>(CreateAkashaWorldConfigExtensionDocument, options);
      }
export type CreateAkashaWorldConfigExtensionMutationHookResult = ReturnType<typeof useCreateAkashaWorldConfigExtensionMutation>;
export type CreateAkashaWorldConfigExtensionMutationResult = Apollo.MutationResult<Types.CreateAkashaWorldConfigExtensionMutation>;
export type CreateAkashaWorldConfigExtensionMutationOptions = Apollo.BaseMutationOptions<Types.CreateAkashaWorldConfigExtensionMutation, Types.CreateAkashaWorldConfigExtensionMutationVariables>;
export const UpdateAkashaWorldConfigExtensionDocument = /*#__PURE__*/ gql`
    mutation UpdateAkashaWorldConfigExtension($i: UpdateAkashaWorldConfigExtensionInput!) {
  updateAkashaWorldConfigExtension(input: $i) {
    document {
      ...AkashaWorldConfigExtensionM
    }
    clientMutationId
  }
}
    ${AkashaWorldConfigExtensionMFragmentDoc}`;
export type UpdateAkashaWorldConfigExtensionMutationFn = Apollo.MutationFunction<Types.UpdateAkashaWorldConfigExtensionMutation, Types.UpdateAkashaWorldConfigExtensionMutationVariables>;

/**
 * __useUpdateAkashaWorldConfigExtensionMutation__
 *
 * To run a mutation, you first call `useUpdateAkashaWorldConfigExtensionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAkashaWorldConfigExtensionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAkashaWorldConfigExtensionMutation, { data, loading, error }] = useUpdateAkashaWorldConfigExtensionMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateAkashaWorldConfigExtensionMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateAkashaWorldConfigExtensionMutation, Types.UpdateAkashaWorldConfigExtensionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateAkashaWorldConfigExtensionMutation, Types.UpdateAkashaWorldConfigExtensionMutationVariables>(UpdateAkashaWorldConfigExtensionDocument, options);
      }
export type UpdateAkashaWorldConfigExtensionMutationHookResult = ReturnType<typeof useUpdateAkashaWorldConfigExtensionMutation>;
export type UpdateAkashaWorldConfigExtensionMutationResult = Apollo.MutationResult<Types.UpdateAkashaWorldConfigExtensionMutation>;
export type UpdateAkashaWorldConfigExtensionMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAkashaWorldConfigExtensionMutation, Types.UpdateAkashaWorldConfigExtensionMutationVariables>;
export const DeleteAkashaWorldConfigExtensionDocument = /*#__PURE__*/ gql`
    mutation DeleteAkashaWorldConfigExtension($i: EnableIndexingAkashaWorldConfigExtensionInput!) {
  enableIndexingAkashaWorldConfigExtension(input: $i) {
    clientMutationId
  }
}
    `;
export type DeleteAkashaWorldConfigExtensionMutationFn = Apollo.MutationFunction<Types.DeleteAkashaWorldConfigExtensionMutation, Types.DeleteAkashaWorldConfigExtensionMutationVariables>;

/**
 * __useDeleteAkashaWorldConfigExtensionMutation__
 *
 * To run a mutation, you first call `useDeleteAkashaWorldConfigExtensionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAkashaWorldConfigExtensionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAkashaWorldConfigExtensionMutation, { data, loading, error }] = useDeleteAkashaWorldConfigExtensionMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useDeleteAkashaWorldConfigExtensionMutation(baseOptions?: Apollo.MutationHookOptions<Types.DeleteAkashaWorldConfigExtensionMutation, Types.DeleteAkashaWorldConfigExtensionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DeleteAkashaWorldConfigExtensionMutation, Types.DeleteAkashaWorldConfigExtensionMutationVariables>(DeleteAkashaWorldConfigExtensionDocument, options);
      }
export type DeleteAkashaWorldConfigExtensionMutationHookResult = ReturnType<typeof useDeleteAkashaWorldConfigExtensionMutation>;
export type DeleteAkashaWorldConfigExtensionMutationResult = Apollo.MutationResult<Types.DeleteAkashaWorldConfigExtensionMutation>;
export type DeleteAkashaWorldConfigExtensionMutationOptions = Apollo.BaseMutationOptions<Types.DeleteAkashaWorldConfigExtensionMutation, Types.DeleteAkashaWorldConfigExtensionMutationVariables>;
export const CreateAkashaWorldMetaInfoDocument = /*#__PURE__*/ gql`
    mutation CreateAkashaWorldMetaInfo($i: SetAkashaWorldMetaInfoInput!) {
  setAkashaWorldMetaInfo(input: $i) {
    document {
      ...AkashaWorldMetaInfoM
    }
    clientMutationId
  }
}
    ${AkashaWorldMetaInfoMFragmentDoc}`;
export type CreateAkashaWorldMetaInfoMutationFn = Apollo.MutationFunction<Types.CreateAkashaWorldMetaInfoMutation, Types.CreateAkashaWorldMetaInfoMutationVariables>;

/**
 * __useCreateAkashaWorldMetaInfoMutation__
 *
 * To run a mutation, you first call `useCreateAkashaWorldMetaInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAkashaWorldMetaInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAkashaWorldMetaInfoMutation, { data, loading, error }] = useCreateAkashaWorldMetaInfoMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useCreateAkashaWorldMetaInfoMutation(baseOptions?: Apollo.MutationHookOptions<Types.CreateAkashaWorldMetaInfoMutation, Types.CreateAkashaWorldMetaInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.CreateAkashaWorldMetaInfoMutation, Types.CreateAkashaWorldMetaInfoMutationVariables>(CreateAkashaWorldMetaInfoDocument, options);
      }
export type CreateAkashaWorldMetaInfoMutationHookResult = ReturnType<typeof useCreateAkashaWorldMetaInfoMutation>;
export type CreateAkashaWorldMetaInfoMutationResult = Apollo.MutationResult<Types.CreateAkashaWorldMetaInfoMutation>;
export type CreateAkashaWorldMetaInfoMutationOptions = Apollo.BaseMutationOptions<Types.CreateAkashaWorldMetaInfoMutation, Types.CreateAkashaWorldMetaInfoMutationVariables>;
export const UpdateAkashaWorldMetaInfoDocument = /*#__PURE__*/ gql`
    mutation UpdateAkashaWorldMetaInfo($i: UpdateAkashaWorldMetaInfoInput!) {
  updateAkashaWorldMetaInfo(input: $i) {
    document {
      ...AkashaWorldMetaInfoM
    }
    clientMutationId
  }
}
    ${AkashaWorldMetaInfoMFragmentDoc}`;
export type UpdateAkashaWorldMetaInfoMutationFn = Apollo.MutationFunction<Types.UpdateAkashaWorldMetaInfoMutation, Types.UpdateAkashaWorldMetaInfoMutationVariables>;

/**
 * __useUpdateAkashaWorldMetaInfoMutation__
 *
 * To run a mutation, you first call `useUpdateAkashaWorldMetaInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAkashaWorldMetaInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAkashaWorldMetaInfoMutation, { data, loading, error }] = useUpdateAkashaWorldMetaInfoMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateAkashaWorldMetaInfoMutation(baseOptions?: Apollo.MutationHookOptions<Types.UpdateAkashaWorldMetaInfoMutation, Types.UpdateAkashaWorldMetaInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.UpdateAkashaWorldMetaInfoMutation, Types.UpdateAkashaWorldMetaInfoMutationVariables>(UpdateAkashaWorldMetaInfoDocument, options);
      }
export type UpdateAkashaWorldMetaInfoMutationHookResult = ReturnType<typeof useUpdateAkashaWorldMetaInfoMutation>;
export type UpdateAkashaWorldMetaInfoMutationResult = Apollo.MutationResult<Types.UpdateAkashaWorldMetaInfoMutation>;
export type UpdateAkashaWorldMetaInfoMutationOptions = Apollo.BaseMutationOptions<Types.UpdateAkashaWorldMetaInfoMutation, Types.UpdateAkashaWorldMetaInfoMutationVariables>;
export const DeleteAkashaWorldMetaInfoDocument = /*#__PURE__*/ gql`
    mutation DeleteAkashaWorldMetaInfo($i: EnableIndexingAkashaWorldMetaInfoInput!) {
  enableIndexingAkashaWorldMetaInfo(input: $i) {
    clientMutationId
  }
}
    `;
export type DeleteAkashaWorldMetaInfoMutationFn = Apollo.MutationFunction<Types.DeleteAkashaWorldMetaInfoMutation, Types.DeleteAkashaWorldMetaInfoMutationVariables>;

/**
 * __useDeleteAkashaWorldMetaInfoMutation__
 *
 * To run a mutation, you first call `useDeleteAkashaWorldMetaInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAkashaWorldMetaInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAkashaWorldMetaInfoMutation, { data, loading, error }] = useDeleteAkashaWorldMetaInfoMutation({
 *   variables: {
 *      i: // value for 'i'
 *   },
 * });
 */
export function useDeleteAkashaWorldMetaInfoMutation(baseOptions?: Apollo.MutationHookOptions<Types.DeleteAkashaWorldMetaInfoMutation, Types.DeleteAkashaWorldMetaInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Types.DeleteAkashaWorldMetaInfoMutation, Types.DeleteAkashaWorldMetaInfoMutationVariables>(DeleteAkashaWorldMetaInfoDocument, options);
      }
export type DeleteAkashaWorldMetaInfoMutationHookResult = ReturnType<typeof useDeleteAkashaWorldMetaInfoMutation>;
export type DeleteAkashaWorldMetaInfoMutationResult = Apollo.MutationResult<Types.DeleteAkashaWorldMetaInfoMutation>;
export type DeleteAkashaWorldMetaInfoMutationOptions = Apollo.BaseMutationOptions<Types.DeleteAkashaWorldMetaInfoMutation, Types.DeleteAkashaWorldMetaInfoMutationVariables>;
export const GetAppsDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetAppsQuery__
 *
 * To run a query within a React component, call `useGetAppsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppsQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetAppsQuery(baseOptions?: Apollo.QueryHookOptions<Types.GetAppsQuery, Types.GetAppsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAppsQuery, Types.GetAppsQueryVariables>(GetAppsDocument, options);
      }
export function useGetAppsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAppsQuery, Types.GetAppsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAppsQuery, Types.GetAppsQueryVariables>(GetAppsDocument, options);
        }
export function useGetAppsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetAppsQuery, Types.GetAppsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetAppsQuery, Types.GetAppsQueryVariables>(GetAppsDocument, options);
        }
export type GetAppsQueryHookResult = ReturnType<typeof useGetAppsQuery>;
export type GetAppsLazyQueryHookResult = ReturnType<typeof useGetAppsLazyQuery>;
export type GetAppsSuspenseQueryHookResult = ReturnType<typeof useGetAppsSuspenseQuery>;
export type GetAppsQueryResult = Apollo.QueryResult<Types.GetAppsQuery, Types.GetAppsQueryVariables>;
export const GetAppsStreamDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetAppsStreamQuery__
 *
 * To run a query within a React component, call `useGetAppsStreamQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppsStreamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppsStreamQuery({
 *   variables: {
 *      indexer: // value for 'indexer'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetAppsStreamQuery(baseOptions: Apollo.QueryHookOptions<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables> & ({ variables: Types.GetAppsStreamQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>(GetAppsStreamDocument, options);
      }
export function useGetAppsStreamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>(GetAppsStreamDocument, options);
        }
export function useGetAppsStreamSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>(GetAppsStreamDocument, options);
        }
export type GetAppsStreamQueryHookResult = ReturnType<typeof useGetAppsStreamQuery>;
export type GetAppsStreamLazyQueryHookResult = ReturnType<typeof useGetAppsStreamLazyQuery>;
export type GetAppsStreamSuspenseQueryHookResult = ReturnType<typeof useGetAppsStreamSuspenseQuery>;
export type GetAppsStreamQueryResult = Apollo.QueryResult<Types.GetAppsStreamQuery, Types.GetAppsStreamQueryVariables>;
export const GetAppsByIdDocument = /*#__PURE__*/ gql`
    query GetAppsByID($id: ID!) {
  node(id: $id) {
    ... on AkashaApp {
      ...AkashaAppFragment
    }
  }
}
    ${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;

/**
 * __useGetAppsByIdQuery__
 *
 * To run a query within a React component, call `useGetAppsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppsByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAppsByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables> & ({ variables: Types.GetAppsByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>(GetAppsByIdDocument, options);
      }
export function useGetAppsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>(GetAppsByIdDocument, options);
        }
export function useGetAppsByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>(GetAppsByIdDocument, options);
        }
export type GetAppsByIdQueryHookResult = ReturnType<typeof useGetAppsByIdQuery>;
export type GetAppsByIdLazyQueryHookResult = ReturnType<typeof useGetAppsByIdLazyQuery>;
export type GetAppsByIdSuspenseQueryHookResult = ReturnType<typeof useGetAppsByIdSuspenseQuery>;
export type GetAppsByIdQueryResult = Apollo.QueryResult<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>;
export const GetAppsByPublisherDidDocument = /*#__PURE__*/ gql`
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
    ${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;

/**
 * __useGetAppsByPublisherDidQuery__
 *
 * To run a query within a React component, call `useGetAppsByPublisherDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppsByPublisherDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppsByPublisherDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetAppsByPublisherDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables> & ({ variables: Types.GetAppsByPublisherDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>(GetAppsByPublisherDidDocument, options);
      }
export function useGetAppsByPublisherDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>(GetAppsByPublisherDidDocument, options);
        }
export function useGetAppsByPublisherDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>(GetAppsByPublisherDidDocument, options);
        }
export type GetAppsByPublisherDidQueryHookResult = ReturnType<typeof useGetAppsByPublisherDidQuery>;
export type GetAppsByPublisherDidLazyQueryHookResult = ReturnType<typeof useGetAppsByPublisherDidLazyQuery>;
export type GetAppsByPublisherDidSuspenseQueryHookResult = ReturnType<typeof useGetAppsByPublisherDidSuspenseQuery>;
export type GetAppsByPublisherDidQueryResult = Apollo.QueryResult<Types.GetAppsByPublisherDidQuery, Types.GetAppsByPublisherDidQueryVariables>;
export const GetAppsReleasesByPublisherDidDocument = /*#__PURE__*/ gql`
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
    ${AppReleaseFragmentDoc}
${AkashaAppFragmentDoc}
${UserProfileFragmentDoc}`;

/**
 * __useGetAppsReleasesByPublisherDidQuery__
 *
 * To run a query within a React component, call `useGetAppsReleasesByPublisherDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppsReleasesByPublisherDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppsReleasesByPublisherDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetAppsReleasesByPublisherDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables> & ({ variables: Types.GetAppsReleasesByPublisherDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>(GetAppsReleasesByPublisherDidDocument, options);
      }
export function useGetAppsReleasesByPublisherDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>(GetAppsReleasesByPublisherDidDocument, options);
        }
export function useGetAppsReleasesByPublisherDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>(GetAppsReleasesByPublisherDidDocument, options);
        }
export type GetAppsReleasesByPublisherDidQueryHookResult = ReturnType<typeof useGetAppsReleasesByPublisherDidQuery>;
export type GetAppsReleasesByPublisherDidLazyQueryHookResult = ReturnType<typeof useGetAppsReleasesByPublisherDidLazyQuery>;
export type GetAppsReleasesByPublisherDidSuspenseQueryHookResult = ReturnType<typeof useGetAppsReleasesByPublisherDidSuspenseQuery>;
export type GetAppsReleasesByPublisherDidQueryResult = Apollo.QueryResult<Types.GetAppsReleasesByPublisherDidQuery, Types.GetAppsReleasesByPublisherDidQueryVariables>;
export const GetAppsReleasesDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetAppsReleasesQuery__
 *
 * To run a query within a React component, call `useGetAppsReleasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppsReleasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppsReleasesQuery({
 *   variables: {
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      filters: // value for 'filters'
 *      sorting: // value for 'sorting'
 *   },
 * });
 */
export function useGetAppsReleasesQuery(baseOptions?: Apollo.QueryHookOptions<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>(GetAppsReleasesDocument, options);
      }
export function useGetAppsReleasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>(GetAppsReleasesDocument, options);
        }
export function useGetAppsReleasesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>(GetAppsReleasesDocument, options);
        }
export type GetAppsReleasesQueryHookResult = ReturnType<typeof useGetAppsReleasesQuery>;
export type GetAppsReleasesLazyQueryHookResult = ReturnType<typeof useGetAppsReleasesLazyQuery>;
export type GetAppsReleasesSuspenseQueryHookResult = ReturnType<typeof useGetAppsReleasesSuspenseQuery>;
export type GetAppsReleasesQueryResult = Apollo.QueryResult<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>;
export const GetAppReleaseByIdDocument = /*#__PURE__*/ gql`
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

/**
 * __useGetAppReleaseByIdQuery__
 *
 * To run a query within a React component, call `useGetAppReleaseByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppReleaseByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppReleaseByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAppReleaseByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables> & ({ variables: Types.GetAppReleaseByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>(GetAppReleaseByIdDocument, options);
      }
export function useGetAppReleaseByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>(GetAppReleaseByIdDocument, options);
        }
export function useGetAppReleaseByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>(GetAppReleaseByIdDocument, options);
        }
export type GetAppReleaseByIdQueryHookResult = ReturnType<typeof useGetAppReleaseByIdQuery>;
export type GetAppReleaseByIdLazyQueryHookResult = ReturnType<typeof useGetAppReleaseByIdLazyQuery>;
export type GetAppReleaseByIdSuspenseQueryHookResult = ReturnType<typeof useGetAppReleaseByIdSuspenseQuery>;
export type GetAppReleaseByIdQueryResult = Apollo.QueryResult<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>;
export const GetWorldByIdDocument = /*#__PURE__*/ gql`
    query GetWorldByID($id: ID!) {
  node(id: $id) {
    ... on AkashaWorld {
      ...AkashaWorldFragment
    }
  }
}
    ${AkashaWorldFragmentDoc}`;

/**
 * __useGetWorldByIdQuery__
 *
 * To run a query within a React component, call `useGetWorldByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetWorldByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldByIdQuery, Types.GetWorldByIdQueryVariables> & ({ variables: Types.GetWorldByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldByIdQuery, Types.GetWorldByIdQueryVariables>(GetWorldByIdDocument, options);
      }
export function useGetWorldByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldByIdQuery, Types.GetWorldByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldByIdQuery, Types.GetWorldByIdQueryVariables>(GetWorldByIdDocument, options);
        }
export function useGetWorldByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldByIdQuery, Types.GetWorldByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldByIdQuery, Types.GetWorldByIdQueryVariables>(GetWorldByIdDocument, options);
        }
export type GetWorldByIdQueryHookResult = ReturnType<typeof useGetWorldByIdQuery>;
export type GetWorldByIdLazyQueryHookResult = ReturnType<typeof useGetWorldByIdLazyQuery>;
export type GetWorldByIdSuspenseQueryHookResult = ReturnType<typeof useGetWorldByIdSuspenseQuery>;
export type GetWorldByIdQueryResult = Apollo.QueryResult<Types.GetWorldByIdQuery, Types.GetWorldByIdQueryVariables>;
export const GetWorldByNameDocument = /*#__PURE__*/ gql`
    query GetWorldByName($name: String!) {
  akashaWorldIndex(
    first: 2
    filters: {and: [{where: {name: {equalTo: $name}}}, {where: {active: {equalTo: true}}}]}
  ) {
    edges {
      node {
        ...AkashaWorldFragment
      }
    }
  }
}
    ${AkashaWorldFragmentDoc}`;

/**
 * __useGetWorldByNameQuery__
 *
 * To run a query within a React component, call `useGetWorldByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetWorldByNameQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldByNameQuery, Types.GetWorldByNameQueryVariables> & ({ variables: Types.GetWorldByNameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldByNameQuery, Types.GetWorldByNameQueryVariables>(GetWorldByNameDocument, options);
      }
export function useGetWorldByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldByNameQuery, Types.GetWorldByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldByNameQuery, Types.GetWorldByNameQueryVariables>(GetWorldByNameDocument, options);
        }
export function useGetWorldByNameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldByNameQuery, Types.GetWorldByNameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldByNameQuery, Types.GetWorldByNameQueryVariables>(GetWorldByNameDocument, options);
        }
export type GetWorldByNameQueryHookResult = ReturnType<typeof useGetWorldByNameQuery>;
export type GetWorldByNameLazyQueryHookResult = ReturnType<typeof useGetWorldByNameLazyQuery>;
export type GetWorldByNameSuspenseQueryHookResult = ReturnType<typeof useGetWorldByNameSuspenseQuery>;
export type GetWorldByNameQueryResult = Apollo.QueryResult<Types.GetWorldByNameQuery, Types.GetWorldByNameQueryVariables>;
export const GetWorldsByCreatorDidDocument = /*#__PURE__*/ gql`
    query GetWorldsByCreatorDID($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaWorldList(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            ...AkashaWorldFragment
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
    ${AkashaWorldFragmentDoc}`;

/**
 * __useGetWorldsByCreatorDidQuery__
 *
 * To run a query within a React component, call `useGetWorldsByCreatorDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldsByCreatorDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldsByCreatorDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useGetWorldsByCreatorDidQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldsByCreatorDidQuery, Types.GetWorldsByCreatorDidQueryVariables> & ({ variables: Types.GetWorldsByCreatorDidQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldsByCreatorDidQuery, Types.GetWorldsByCreatorDidQueryVariables>(GetWorldsByCreatorDidDocument, options);
      }
export function useGetWorldsByCreatorDidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldsByCreatorDidQuery, Types.GetWorldsByCreatorDidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldsByCreatorDidQuery, Types.GetWorldsByCreatorDidQueryVariables>(GetWorldsByCreatorDidDocument, options);
        }
export function useGetWorldsByCreatorDidSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldsByCreatorDidQuery, Types.GetWorldsByCreatorDidQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldsByCreatorDidQuery, Types.GetWorldsByCreatorDidQueryVariables>(GetWorldsByCreatorDidDocument, options);
        }
export type GetWorldsByCreatorDidQueryHookResult = ReturnType<typeof useGetWorldsByCreatorDidQuery>;
export type GetWorldsByCreatorDidLazyQueryHookResult = ReturnType<typeof useGetWorldsByCreatorDidLazyQuery>;
export type GetWorldsByCreatorDidSuspenseQueryHookResult = ReturnType<typeof useGetWorldsByCreatorDidSuspenseQuery>;
export type GetWorldsByCreatorDidQueryResult = Apollo.QueryResult<Types.GetWorldsByCreatorDidQuery, Types.GetWorldsByCreatorDidQueryVariables>;
export const GetWorldConfigDocument = /*#__PURE__*/ gql`
    query GetWorldConfig($worldID: String!, $creator: ID) {
  akashaWorldConfigIndex(
    first: 1
    filters: {and: [{where: {worldID: {equalTo: $worldID}}}, {where: {active: {equalTo: true}}}]}
  ) {
    edges {
      node {
        ...AkashaWorldConfigFragment
        extensions(account: $creator, first: 100) {
          edges {
            node {
              ...AkashaWorldConfigExtensionFragment
            }
          }
        }
      }
    }
  }
}
    ${AkashaWorldConfigFragmentDoc}
${AkashaWorldConfigExtensionFragmentDoc}`;

/**
 * __useGetWorldConfigQuery__
 *
 * To run a query within a React component, call `useGetWorldConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldConfigQuery({
 *   variables: {
 *      worldID: // value for 'worldID'
 *      creator: // value for 'creator'
 *   },
 * });
 */
export function useGetWorldConfigQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldConfigQuery, Types.GetWorldConfigQueryVariables> & ({ variables: Types.GetWorldConfigQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldConfigQuery, Types.GetWorldConfigQueryVariables>(GetWorldConfigDocument, options);
      }
export function useGetWorldConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldConfigQuery, Types.GetWorldConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldConfigQuery, Types.GetWorldConfigQueryVariables>(GetWorldConfigDocument, options);
        }
export function useGetWorldConfigSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldConfigQuery, Types.GetWorldConfigQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldConfigQuery, Types.GetWorldConfigQueryVariables>(GetWorldConfigDocument, options);
        }
export type GetWorldConfigQueryHookResult = ReturnType<typeof useGetWorldConfigQuery>;
export type GetWorldConfigLazyQueryHookResult = ReturnType<typeof useGetWorldConfigLazyQuery>;
export type GetWorldConfigSuspenseQueryHookResult = ReturnType<typeof useGetWorldConfigSuspenseQuery>;
export type GetWorldConfigQueryResult = Apollo.QueryResult<Types.GetWorldConfigQuery, Types.GetWorldConfigQueryVariables>;
export const GetWorldMetaInfoDocument = /*#__PURE__*/ gql`
    query GetWorldMetaInfo($worldID: CeramicStreamID!, $creator: ID!) {
  node(id: $creator) {
    ... on CeramicAccount {
      akashaWorldMetaInfo(with: {worldID: $worldID}) {
        ...AkashaWorldMetaInfoFragment
      }
    }
  }
}
    ${AkashaWorldMetaInfoFragmentDoc}`;

/**
 * __useGetWorldMetaInfoQuery__
 *
 * To run a query within a React component, call `useGetWorldMetaInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldMetaInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldMetaInfoQuery({
 *   variables: {
 *      worldID: // value for 'worldID'
 *      creator: // value for 'creator'
 *   },
 * });
 */
export function useGetWorldMetaInfoQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldMetaInfoQuery, Types.GetWorldMetaInfoQueryVariables> & ({ variables: Types.GetWorldMetaInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldMetaInfoQuery, Types.GetWorldMetaInfoQueryVariables>(GetWorldMetaInfoDocument, options);
      }
export function useGetWorldMetaInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldMetaInfoQuery, Types.GetWorldMetaInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldMetaInfoQuery, Types.GetWorldMetaInfoQueryVariables>(GetWorldMetaInfoDocument, options);
        }
export function useGetWorldMetaInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldMetaInfoQuery, Types.GetWorldMetaInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldMetaInfoQuery, Types.GetWorldMetaInfoQueryVariables>(GetWorldMetaInfoDocument, options);
        }
export type GetWorldMetaInfoQueryHookResult = ReturnType<typeof useGetWorldMetaInfoQuery>;
export type GetWorldMetaInfoLazyQueryHookResult = ReturnType<typeof useGetWorldMetaInfoLazyQuery>;
export type GetWorldMetaInfoSuspenseQueryHookResult = ReturnType<typeof useGetWorldMetaInfoSuspenseQuery>;
export type GetWorldMetaInfoQueryResult = Apollo.QueryResult<Types.GetWorldMetaInfoQuery, Types.GetWorldMetaInfoQueryVariables>;
export const GetWorldConfigByIdDocument = /*#__PURE__*/ gql`
    query GetWorldConfigByID($configID: ID!) {
  node(id: $configID) {
    ... on AkashaWorldConfig {
      ...AkashaWorldConfigFragment
    }
  }
}
    ${AkashaWorldConfigFragmentDoc}`;

/**
 * __useGetWorldConfigByIdQuery__
 *
 * To run a query within a React component, call `useGetWorldConfigByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldConfigByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldConfigByIdQuery({
 *   variables: {
 *      configID: // value for 'configID'
 *   },
 * });
 */
export function useGetWorldConfigByIdQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldConfigByIdQuery, Types.GetWorldConfigByIdQueryVariables> & ({ variables: Types.GetWorldConfigByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldConfigByIdQuery, Types.GetWorldConfigByIdQueryVariables>(GetWorldConfigByIdDocument, options);
      }
export function useGetWorldConfigByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldConfigByIdQuery, Types.GetWorldConfigByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldConfigByIdQuery, Types.GetWorldConfigByIdQueryVariables>(GetWorldConfigByIdDocument, options);
        }
export function useGetWorldConfigByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldConfigByIdQuery, Types.GetWorldConfigByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldConfigByIdQuery, Types.GetWorldConfigByIdQueryVariables>(GetWorldConfigByIdDocument, options);
        }
export type GetWorldConfigByIdQueryHookResult = ReturnType<typeof useGetWorldConfigByIdQuery>;
export type GetWorldConfigByIdLazyQueryHookResult = ReturnType<typeof useGetWorldConfigByIdLazyQuery>;
export type GetWorldConfigByIdSuspenseQueryHookResult = ReturnType<typeof useGetWorldConfigByIdSuspenseQuery>;
export type GetWorldConfigByIdQueryResult = Apollo.QueryResult<Types.GetWorldConfigByIdQuery, Types.GetWorldConfigByIdQueryVariables>;
export const GetWorldConfigExtensionsDocument = /*#__PURE__*/ gql`
    query GetWorldConfigExtensions($configID: String!) {
  akashaWorldConfigExtensionIndex(
    first: 100
    filters: {and: [{where: {worldConfigID: {equalTo: $configID}}}, {where: {active: {equalTo: true}}}]}
  ) {
    edges {
      node {
        ...AkashaWorldConfigExtensionFragment
      }
    }
  }
}
    ${AkashaWorldConfigExtensionFragmentDoc}`;

/**
 * __useGetWorldConfigExtensionsQuery__
 *
 * To run a query within a React component, call `useGetWorldConfigExtensionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldConfigExtensionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldConfigExtensionsQuery({
 *   variables: {
 *      configID: // value for 'configID'
 *   },
 * });
 */
export function useGetWorldConfigExtensionsQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldConfigExtensionsQuery, Types.GetWorldConfigExtensionsQueryVariables> & ({ variables: Types.GetWorldConfigExtensionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldConfigExtensionsQuery, Types.GetWorldConfigExtensionsQueryVariables>(GetWorldConfigExtensionsDocument, options);
      }
export function useGetWorldConfigExtensionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldConfigExtensionsQuery, Types.GetWorldConfigExtensionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldConfigExtensionsQuery, Types.GetWorldConfigExtensionsQueryVariables>(GetWorldConfigExtensionsDocument, options);
        }
export function useGetWorldConfigExtensionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldConfigExtensionsQuery, Types.GetWorldConfigExtensionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldConfigExtensionsQuery, Types.GetWorldConfigExtensionsQueryVariables>(GetWorldConfigExtensionsDocument, options);
        }
export type GetWorldConfigExtensionsQueryHookResult = ReturnType<typeof useGetWorldConfigExtensionsQuery>;
export type GetWorldConfigExtensionsLazyQueryHookResult = ReturnType<typeof useGetWorldConfigExtensionsLazyQuery>;
export type GetWorldConfigExtensionsSuspenseQueryHookResult = ReturnType<typeof useGetWorldConfigExtensionsSuspenseQuery>;
export type GetWorldConfigExtensionsQueryResult = Apollo.QueryResult<Types.GetWorldConfigExtensionsQuery, Types.GetWorldConfigExtensionsQueryVariables>;
export const GetWorldFullInfoDocument = /*#__PURE__*/ gql`
    query GetWorldFullInfo($id: ID!, $creator: ID) {
  node(id: $id) {
    ... on AkashaWorld {
      metaInfo(first: 1, account: $creator) {
        edges {
          node {
            ...AkashaWorldMetaInfoFragment
          }
        }
      }
      configInfo(
        first: 1
        filters: {and: [{where: {active: {equalTo: true}}}]}
        account: $creator
      ) {
        edges {
          node {
            ...AkashaWorldConfigFragment
          }
        }
      }
      ...AkashaWorldFragment
    }
  }
}
    ${AkashaWorldMetaInfoFragmentDoc}
${AkashaWorldConfigFragmentDoc}
${AkashaWorldFragmentDoc}`;

/**
 * __useGetWorldFullInfoQuery__
 *
 * To run a query within a React component, call `useGetWorldFullInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorldFullInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorldFullInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *      creator: // value for 'creator'
 *   },
 * });
 */
export function useGetWorldFullInfoQuery(baseOptions: Apollo.QueryHookOptions<Types.GetWorldFullInfoQuery, Types.GetWorldFullInfoQueryVariables> & ({ variables: Types.GetWorldFullInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Types.GetWorldFullInfoQuery, Types.GetWorldFullInfoQueryVariables>(GetWorldFullInfoDocument, options);
      }
export function useGetWorldFullInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Types.GetWorldFullInfoQuery, Types.GetWorldFullInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Types.GetWorldFullInfoQuery, Types.GetWorldFullInfoQueryVariables>(GetWorldFullInfoDocument, options);
        }
export function useGetWorldFullInfoSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Types.GetWorldFullInfoQuery, Types.GetWorldFullInfoQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Types.GetWorldFullInfoQuery, Types.GetWorldFullInfoQueryVariables>(GetWorldFullInfoDocument, options);
        }
export type GetWorldFullInfoQueryHookResult = ReturnType<typeof useGetWorldFullInfoQuery>;
export type GetWorldFullInfoLazyQueryHookResult = ReturnType<typeof useGetWorldFullInfoLazyQuery>;
export type GetWorldFullInfoSuspenseQueryHookResult = ReturnType<typeof useGetWorldFullInfoSuspenseQuery>;
export type GetWorldFullInfoQueryResult = Apollo.QueryResult<Types.GetWorldFullInfoQuery, Types.GetWorldFullInfoQueryVariables>;