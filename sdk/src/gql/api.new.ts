import type * as Types from '@akashaorg/typings/sdk/graphql-operation-types-new';

import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export const BeamFragmentDoc = /*#__PURE__*/ gql`
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
export const ReflectFragmentDoc = /*#__PURE__*/ gql`
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
export const UserProfileFragmentDoc = /*#__PURE__*/ gql`
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
export const GetBeamsDocument = /*#__PURE__*/ gql`
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
export const GetBeamsByAuthorDidDocument = /*#__PURE__*/ gql`
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
      isViewer
    }
  }
}
    ${BeamFragmentDoc}`;
export const GetBeamByIdDocument = /*#__PURE__*/ gql`
    query GetBeamById($id: ID!) {
  node(id: $id) {
    ... on Beam {
      ...BeamFragment
    }
  }
}
    ${BeamFragmentDoc}`;
export const GetRebeamsFromBeamDocument = /*#__PURE__*/ gql`
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
export const GetMentionsFromBeamDocument = /*#__PURE__*/ gql`
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
export const CreateBeamDocument = /*#__PURE__*/ gql`
    mutation CreateBeam($i: CreateBeamInput!) {
  createBeam(input: $i) {
    document {
      ...BeamFragment
    }
  }
}
    ${BeamFragmentDoc}`;
export const UpdateBeamDocument = /*#__PURE__*/ gql`
    mutation UpdateBeam($i: UpdateBeamInput!) {
  updateBeam(input: $i) {
    document {
      ...BeamFragment
    }
    clientMutationId
  }
}
    ${BeamFragmentDoc}`;
export const CreateRebeamDocument = /*#__PURE__*/ gql`
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
export const CreateBeamProfileMentionDocument = /*#__PURE__*/ gql`
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
export const GetReflectionsFromBeamDocument = /*#__PURE__*/ gql`
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
export const GetReflectionsByAuthorDidDocument = /*#__PURE__*/ gql`
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
      isViewer
    }
  }
}
    ${ReflectFragmentDoc}`;
export const GetReflectReflectionsDocument = /*#__PURE__*/ gql`
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
export const CreateReflectDocument = /*#__PURE__*/ gql`
    mutation CreateReflect($i: CreateReflectInput!) {
  createReflect(input: $i) {
    document {
      ...ReflectFragment
    }
    clientMutationId
  }
}
    ${ReflectFragmentDoc}`;
export const UpdateReflectDocument = /*#__PURE__*/ gql`
    mutation UpdateReflect($i: UpdateReflectInput!) {
  updateReflect(input: $i) {
    document {
      ...ReflectFragment
    }
    clientMutationId
  }
}
    ${ReflectFragmentDoc}`;
export const CreateReflectReflectionDocument = /*#__PURE__*/ gql`
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
export const UpdateReflectReflectionDocument = /*#__PURE__*/ gql`
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
export const GetProfileByIdDocument = /*#__PURE__*/ gql`
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on Profile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const GetProfileByDidDocument = /*#__PURE__*/ gql`
    query GetProfileByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      profile {
        ...UserProfileFragment
      }
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const GetProfilesDocument = /*#__PURE__*/ gql`
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
export const GetInterestsDocument = /*#__PURE__*/ gql`
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
export const GetInterestsByDidDocument = /*#__PURE__*/ gql`
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
      isViewer
    }
  }
}
    `;
export const GetInterestsByIdDocument = /*#__PURE__*/ gql`
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
export const GetFollowingListByDidDocument = /*#__PURE__*/ gql`
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
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const GetFollowersListByDidDocument = /*#__PURE__*/ gql`
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
      isViewer
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const GetMyProfileDocument = /*#__PURE__*/ gql`
    query GetMyProfile {
  viewer {
    profile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const CreateProfileDocument = /*#__PURE__*/ gql`
    mutation CreateProfile($i: CreateProfileInput!) {
  createProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const UpdateProfileDocument = /*#__PURE__*/ gql`
    mutation UpdateProfile($i: UpdateProfileInput!) {
  updateProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const CreateInterestsDocument = /*#__PURE__*/ gql`
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
export const UpdateInterestsDocument = /*#__PURE__*/ gql`
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
export const CreateFollowDocument = /*#__PURE__*/ gql`
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
export const UpdateFollowDocument = /*#__PURE__*/ gql`
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
    GetRebeamsFromBeam(variables: Types.GetRebeamsFromBeamQueryVariables, options?: C): Promise<Types.GetRebeamsFromBeamQuery> {
      return requester<Types.GetRebeamsFromBeamQuery, Types.GetRebeamsFromBeamQueryVariables>(GetRebeamsFromBeamDocument, variables, options) as Promise<Types.GetRebeamsFromBeamQuery>;
    },
    GetMentionsFromBeam(variables: Types.GetMentionsFromBeamQueryVariables, options?: C): Promise<Types.GetMentionsFromBeamQuery> {
      return requester<Types.GetMentionsFromBeamQuery, Types.GetMentionsFromBeamQueryVariables>(GetMentionsFromBeamDocument, variables, options) as Promise<Types.GetMentionsFromBeamQuery>;
    },
    CreateBeam(variables: Types.CreateBeamMutationVariables, options?: C): Promise<Types.CreateBeamMutation> {
      return requester<Types.CreateBeamMutation, Types.CreateBeamMutationVariables>(CreateBeamDocument, variables, options) as Promise<Types.CreateBeamMutation>;
    },
    UpdateBeam(variables: Types.UpdateBeamMutationVariables, options?: C): Promise<Types.UpdateBeamMutation> {
      return requester<Types.UpdateBeamMutation, Types.UpdateBeamMutationVariables>(UpdateBeamDocument, variables, options) as Promise<Types.UpdateBeamMutation>;
    },
    CreateRebeam(variables: Types.CreateRebeamMutationVariables, options?: C): Promise<Types.CreateRebeamMutation> {
      return requester<Types.CreateRebeamMutation, Types.CreateRebeamMutationVariables>(CreateRebeamDocument, variables, options) as Promise<Types.CreateRebeamMutation>;
    },
    CreateBeamProfileMention(variables: Types.CreateBeamProfileMentionMutationVariables, options?: C): Promise<Types.CreateBeamProfileMentionMutation> {
      return requester<Types.CreateBeamProfileMentionMutation, Types.CreateBeamProfileMentionMutationVariables>(CreateBeamProfileMentionDocument, variables, options) as Promise<Types.CreateBeamProfileMentionMutation>;
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
    UpdateReflect(variables: Types.UpdateReflectMutationVariables, options?: C): Promise<Types.UpdateReflectMutation> {
      return requester<Types.UpdateReflectMutation, Types.UpdateReflectMutationVariables>(UpdateReflectDocument, variables, options) as Promise<Types.UpdateReflectMutation>;
    },
    CreateReflectReflection(variables: Types.CreateReflectReflectionMutationVariables, options?: C): Promise<Types.CreateReflectReflectionMutation> {
      return requester<Types.CreateReflectReflectionMutation, Types.CreateReflectReflectionMutationVariables>(CreateReflectReflectionDocument, variables, options) as Promise<Types.CreateReflectReflectionMutation>;
    },
    UpdateReflectReflection(variables: Types.UpdateReflectReflectionMutationVariables, options?: C): Promise<Types.UpdateReflectReflectionMutation> {
      return requester<Types.UpdateReflectReflectionMutation, Types.UpdateReflectReflectionMutationVariables>(UpdateReflectReflectionDocument, variables, options) as Promise<Types.UpdateReflectReflectionMutation>;
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
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;