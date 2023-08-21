import type * as Types from '@akashaorg/typings/sdk/graphql-operation-types-new';

import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export const BeamFragmentDoc = /*#__PURE__*/ gql`
    fragment BeamFragment on AkashaBeam {
  id
  reflectionsCount
  active
  embeddedBeam
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
}
    `;
export const ContentBlockFragmentDoc = /*#__PURE__*/ gql`
    fragment ContentBlockFragment on AkashaContentBlock {
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
export const ReflectFragmentDoc = /*#__PURE__*/ gql`
    fragment ReflectFragment on AkashaReflect {
  author {
    id
    isViewer
  }
  version
  active
  content {
    provider
    property
    value
  }
  isReply
  reflection
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
  licence
  name
  displayName
  keywords
  releases {
    edges {
      node {
        id
        createdAt
        source
        version
      }
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
}
    `;
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
export const GetBeamByIdDocument = /*#__PURE__*/ gql`
    query GetBeamById($id: ID!) {
  node(id: $id) {
    ... on AkashaBeam {
      ...BeamFragment
    }
  }
}
    ${BeamFragmentDoc}`;
export const GetContentBlockByIdDocument = /*#__PURE__*/ gql`
    query GetContentBlockById($id: ID!) {
  node(id: $id) {
    ... on AkashaContentBlock {
      ...ContentBlockFragment
    }
  }
}
    ${ContentBlockFragmentDoc}`;
export const GetBlockStorageByIdDocument = /*#__PURE__*/ gql`
    query GetBlockStorageById($id: ID!) {
  node(id: $id) {
    ... on AkashaBlockStorage {
      ...BlockStorageFragment
    }
  }
}
    ${BlockStorageFragmentDoc}`;
export const CreateBeamDocument = /*#__PURE__*/ gql`
    mutation CreateBeam($i: CreateAkashaBeamInput!) {
  createAkashaBeam(input: $i) {
    document {
      ...BeamFragment
    }
    clientMutationId
  }
}
    ${BeamFragmentDoc}`;
export const UpdateBeamDocument = /*#__PURE__*/ gql`
    mutation UpdateBeam($i: UpdateAkashaBeamInput!) {
  updateAkashaBeam(input: $i) {
    document {
      ...BeamFragment
    }
    clientMutationId
  }
}
    ${BeamFragmentDoc}`;
export const CreateContentBlockDocument = /*#__PURE__*/ gql`
    mutation CreateContentBlock($i: CreateAkashaContentBlockInput!) {
  createAkashaContentBlock(input: $i) {
    document {
      ...ContentBlockFragment
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentDoc}`;
export const UpdateContentBlockDocument = /*#__PURE__*/ gql`
    mutation UpdateContentBlock($i: UpdateAkashaContentBlockInput!) {
  updateAkashaContentBlock(input: $i) {
    document {
      ...ContentBlockFragment
    }
    clientMutationId
  }
}
    ${ContentBlockFragmentDoc}`;
export const GetReflectionsFromBeamDocument = /*#__PURE__*/ gql`
    query GetReflectionsFromBeam($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on AkashaBeam {
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
export const GetReflectionsByAuthorDidDocument = /*#__PURE__*/ gql`
    query GetReflectionsByAuthorDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      akashaReflectList(after: $after, before: $before, first: $first, last: $last) {
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
      isViewer
    }
  }
}
    ${ReflectFragmentDoc}`;
export const GetReflectReflectionsDocument = /*#__PURE__*/ gql`
    query GetReflectReflections($id: String!, $after: String, $before: String, $first: Int, $last: Int, $sorting: AkashaReflectSortingInput) {
  akashaReflectIndex(
    after: $after
    before: $before
    first: $first
    last: $last
    filters: {where: {reflection: {equalTo: $id}}}
    sorting: $sorting
  ) {
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
    ${ReflectFragmentDoc}`;
export const CreateReflectDocument = /*#__PURE__*/ gql`
    mutation CreateReflect($i: CreateAkashaReflectInput!) {
  createAkashaReflect(input: $i) {
    document {
      ...ReflectFragment
    }
    clientMutationId
  }
}
    ${ReflectFragmentDoc}`;
export const UpdateAkashaReflectDocument = /*#__PURE__*/ gql`
    mutation UpdateAkashaReflect($i: UpdateAkashaReflectInput!) {
  updateAkashaReflect(input: $i) {
    document {
      ...ReflectFragment
    }
    clientMutationId
  }
}
    ${ReflectFragmentDoc}`;
export const GetProfileByIdDocument = /*#__PURE__*/ gql`
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on AkashaProfile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
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
          }
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
export const GetFollowersListByDidDocument = /*#__PURE__*/ gql`
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
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const GetMyProfileDocument = /*#__PURE__*/ gql`
    query GetMyProfile {
  viewer {
    akashaProfile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const GetFollowDocumentDocument = /*#__PURE__*/ gql`
    query GetFollowDocument($follower: ID!, $following: String!) {
  node(id: $follower) {
    ... on CeramicAccount {
      akashaProfile {
        followers(last: 1, filters: {where: {profileID: {equalTo: $following}}}) {
          edges {
            node {
              id
              isFollowing
              profileID
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
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const CreateProfileDocument = /*#__PURE__*/ gql`
    mutation CreateProfile($i: CreateAkashaProfileInput!) {
  createAkashaProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const UpdateProfileDocument = /*#__PURE__*/ gql`
    mutation UpdateProfile($i: UpdateAkashaProfileInput!) {
  updateAkashaProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const CreateInterestsDocument = /*#__PURE__*/ gql`
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
export const CreateFollowDocument = /*#__PURE__*/ gql`
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
export const UpdateFollowDocument = /*#__PURE__*/ gql`
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
export const CreateAppDocument = /*#__PURE__*/ gql`
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
export const UpdateAppDocument = /*#__PURE__*/ gql`
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
export const CreateAppReleaseDocument = /*#__PURE__*/ gql`
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
export const UpdateAppReleaseDocument = /*#__PURE__*/ gql`
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
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetBeams(variables?: Types.GetBeamsQueryVariables, options?: C): Promise<Types.GetBeamsQuery> {
      return requester<Types.GetBeamsQuery, Types.GetBeamsQueryVariables>(GetBeamsDocument, variables, options) as Promise<Types.GetBeamsQuery>;
    },
    GetBeamsByAuthorDid(variables: Types.GetBeamsByAuthorDidQueryVariables, options?: C): Promise<Types.GetBeamsByAuthorDidQuery> {
      return requester<Types.GetBeamsByAuthorDidQuery, Types.GetBeamsByAuthorDidQueryVariables>(GetBeamsByAuthorDidDocument, variables, options) as Promise<Types.GetBeamsByAuthorDidQuery>;
    },
    GetBeamById(variables: Types.GetBeamByIdQueryVariables, options?: C): Promise<Types.GetBeamByIdQuery> {
      return requester<Types.GetBeamByIdQuery, Types.GetBeamByIdQueryVariables>(GetBeamByIdDocument, variables, options) as Promise<Types.GetBeamByIdQuery>;
    },
    GetContentBlockById(variables: Types.GetContentBlockByIdQueryVariables, options?: C): Promise<Types.GetContentBlockByIdQuery> {
      return requester<Types.GetContentBlockByIdQuery, Types.GetContentBlockByIdQueryVariables>(GetContentBlockByIdDocument, variables, options) as Promise<Types.GetContentBlockByIdQuery>;
    },
    GetBlockStorageById(variables: Types.GetBlockStorageByIdQueryVariables, options?: C): Promise<Types.GetBlockStorageByIdQuery> {
      return requester<Types.GetBlockStorageByIdQuery, Types.GetBlockStorageByIdQueryVariables>(GetBlockStorageByIdDocument, variables, options) as Promise<Types.GetBlockStorageByIdQuery>;
    },
    CreateBeam(variables: Types.CreateBeamMutationVariables, options?: C): Promise<Types.CreateBeamMutation> {
      return requester<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>(CreateBeamDocument, variables, options) as Promise<Types.CreateBeamMutation>;
    },
    UpdateBeam(variables: Types.UpdateBeamMutationVariables, options?: C): Promise<Types.UpdateBeamMutation> {
      return requester<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>(UpdateBeamDocument, variables, options) as Promise<Types.UpdateBeamMutation>;
    },
    CreateContentBlock(variables: Types.CreateContentBlockMutationVariables, options?: C): Promise<Types.CreateContentBlockMutation> {
      return requester<Types.CreateContentBlockMutation, Types.CreateContentBlockMutationVariables>(CreateContentBlockDocument, variables, options) as Promise<Types.CreateContentBlockMutation>;
    },
    UpdateContentBlock(variables: Types.UpdateContentBlockMutationVariables, options?: C): Promise<Types.UpdateContentBlockMutation> {
      return requester<Types.UpdateContentBlockMutation, Types.UpdateContentBlockMutationVariables>(UpdateContentBlockDocument, variables, options) as Promise<Types.UpdateContentBlockMutation>;
    },
    GetReflectionsFromBeam(variables: Types.GetReflectionsFromBeamQueryVariables, options?: C): Promise<Types.GetReflectionsFromBeamQuery> {
      return requester<Types.GetReflectionsFromBeamQuery, Types.GetReflectionsFromBeamQueryVariables>(GetReflectionsFromBeamDocument, variables, options) as Promise<Types.GetReflectionsFromBeamQuery>;
    },
    GetReflectionsByAuthorDid(variables: Types.GetReflectionsByAuthorDidQueryVariables, options?: C): Promise<Types.GetReflectionsByAuthorDidQuery> {
      return requester<Types.GetReflectionsByAuthorDidQuery, Types.GetReflectionsByAuthorDidQueryVariables>(GetReflectionsByAuthorDidDocument, variables, options) as Promise<Types.GetReflectionsByAuthorDidQuery>;
    },
    GetReflectReflections(variables: Types.GetReflectReflectionsQueryVariables, options?: C): Promise<Types.GetReflectReflectionsQuery> {
      return requester<Types.GetReflectReflectionsQuery, Types.GetReflectReflectionsQueryVariables>(GetReflectReflectionsDocument, variables, options) as Promise<Types.GetReflectReflectionsQuery>;
    },
    CreateReflect(variables: Types.CreateReflectMutationVariables, options?: C): Promise<Types.CreateReflectMutation> {
      return requester<Types.CreateReflectMutation, Types.CreateReflectMutationVariables>(CreateReflectDocument, variables, options) as Promise<Types.CreateReflectMutation>;
    },
    UpdateAkashaReflect(variables: Types.UpdateAkashaReflectMutationVariables, options?: C): Promise<Types.UpdateAkashaReflectMutation> {
      return requester<Types.UpdateAkashaReflectMutation, Types.UpdateAkashaReflectMutationVariables>(UpdateAkashaReflectDocument, variables, options) as Promise<Types.UpdateAkashaReflectMutation>;
    },
    GetProfileByID(variables: Types.GetProfileByIdQueryVariables, options?: C): Promise<Types.GetProfileByIdQuery> {
      return requester<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables, options) as Promise<Types.GetProfileByIdQuery>;
    },
    GetProfileByDid(variables: Types.GetProfileByDidQueryVariables, options?: C): Promise<Types.GetProfileByDidQuery> {
      return requester<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables, options) as Promise<Types.GetProfileByDidQuery>;
    },
    GetProfiles(variables?: Types.GetProfilesQueryVariables, options?: C): Promise<Types.GetProfilesQuery> {
      return requester<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables, options) as Promise<Types.GetProfilesQuery>;
    },
    GetInterests(variables?: Types.GetInterestsQueryVariables, options?: C): Promise<Types.GetInterestsQuery> {
      return requester<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables, options) as Promise<Types.GetInterestsQuery>;
    },
    GetInterestsByDid(variables: Types.GetInterestsByDidQueryVariables, options?: C): Promise<Types.GetInterestsByDidQuery> {
      return requester<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables, options) as Promise<Types.GetInterestsByDidQuery>;
    },
    GetInterestsById(variables: Types.GetInterestsByIdQueryVariables, options?: C): Promise<Types.GetInterestsByIdQuery> {
      return requester<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables, options) as Promise<Types.GetInterestsByIdQuery>;
    },
    GetFollowingListByDid(variables: Types.GetFollowingListByDidQueryVariables, options?: C): Promise<Types.GetFollowingListByDidQuery> {
      return requester<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables, options) as Promise<Types.GetFollowingListByDidQuery>;
    },
    GetFollowersListByDid(variables: Types.GetFollowersListByDidQueryVariables, options?: C): Promise<Types.GetFollowersListByDidQuery> {
      return requester<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables, options) as Promise<Types.GetFollowersListByDidQuery>;
    },
    GetMyProfile(variables?: Types.GetMyProfileQueryVariables, options?: C): Promise<Types.GetMyProfileQuery> {
      return requester<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables, options) as Promise<Types.GetMyProfileQuery>;
    },
    GetFollowDocument(variables: Types.GetFollowDocumentQueryVariables, options?: C): Promise<Types.GetFollowDocumentQuery> {
      return requester<Types.GetFollowDocumentQuery, Types.GetFollowDocumentQueryVariables>(GetFollowDocumentDocument, variables, options) as Promise<Types.GetFollowDocumentQuery>;
    },
    CreateProfile(variables: Types.CreateProfileMutationVariables, options?: C): Promise<Types.CreateProfileMutation> {
      return requester<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables, options) as Promise<Types.CreateProfileMutation>;
    },
    UpdateProfile(variables: Types.UpdateProfileMutationVariables, options?: C): Promise<Types.UpdateProfileMutation> {
      return requester<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables, options) as Promise<Types.UpdateProfileMutation>;
    },
    CreateInterests(variables: Types.CreateInterestsMutationVariables, options?: C): Promise<Types.CreateInterestsMutation> {
      return requester<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables, options) as Promise<Types.CreateInterestsMutation>;
    },
    UpdateInterests(variables: Types.UpdateInterestsMutationVariables, options?: C): Promise<Types.UpdateInterestsMutation> {
      return requester<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables, options) as Promise<Types.UpdateInterestsMutation>;
    },
    CreateFollow(variables: Types.CreateFollowMutationVariables, options?: C): Promise<Types.CreateFollowMutation> {
      return requester<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables, options) as Promise<Types.CreateFollowMutation>;
    },
    UpdateFollow(variables: Types.UpdateFollowMutationVariables, options?: C): Promise<Types.UpdateFollowMutation> {
      return requester<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables, options) as Promise<Types.UpdateFollowMutation>;
    },
    CreateApp(variables: Types.CreateAppMutationVariables, options?: C): Promise<Types.CreateAppMutation> {
      return requester<Types.CreateAppMutation, Types.CreateAppMutationVariables>(CreateAppDocument, variables, options) as Promise<Types.CreateAppMutation>;
    },
    UpdateApp(variables: Types.UpdateAppMutationVariables, options?: C): Promise<Types.UpdateAppMutation> {
      return requester<Types.UpdateAppMutation, Types.UpdateAppMutationVariables>(UpdateAppDocument, variables, options) as Promise<Types.UpdateAppMutation>;
    },
    GetApps(variables?: Types.GetAppsQueryVariables, options?: C): Promise<Types.GetAppsQuery> {
      return requester<Types.GetAppsQuery, Types.GetAppsQueryVariables>(GetAppsDocument, variables, options) as Promise<Types.GetAppsQuery>;
    },
    GetAppsByID(variables: Types.GetAppsByIdQueryVariables, options?: C): Promise<Types.GetAppsByIdQuery> {
      return requester<Types.GetAppsByIdQuery, Types.GetAppsByIdQueryVariables>(GetAppsByIdDocument, variables, options) as Promise<Types.GetAppsByIdQuery>;
    },
    CreateAppRelease(variables: Types.CreateAppReleaseMutationVariables, options?: C): Promise<Types.CreateAppReleaseMutation> {
      return requester<Types.CreateAppReleaseMutation, Types.CreateAppReleaseMutationVariables>(CreateAppReleaseDocument, variables, options) as Promise<Types.CreateAppReleaseMutation>;
    },
    UpdateAppRelease(variables: Types.UpdateAppReleaseMutationVariables, options?: C): Promise<Types.UpdateAppReleaseMutation> {
      return requester<Types.UpdateAppReleaseMutation, Types.UpdateAppReleaseMutationVariables>(UpdateAppReleaseDocument, variables, options) as Promise<Types.UpdateAppReleaseMutation>;
    },
    GetAppsReleases(variables?: Types.GetAppsReleasesQueryVariables, options?: C): Promise<Types.GetAppsReleasesQuery> {
      return requester<Types.GetAppsReleasesQuery, Types.GetAppsReleasesQueryVariables>(GetAppsReleasesDocument, variables, options) as Promise<Types.GetAppsReleasesQuery>;
    },
    GetAppReleaseByID(variables: Types.GetAppReleaseByIdQueryVariables, options?: C): Promise<Types.GetAppReleaseByIdQuery> {
      return requester<Types.GetAppReleaseByIdQuery, Types.GetAppReleaseByIdQueryVariables>(GetAppReleaseByIdDocument, variables, options) as Promise<Types.GetAppReleaseByIdQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;