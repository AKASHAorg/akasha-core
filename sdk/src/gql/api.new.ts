import type * as Types from '@akashaorg/typings/sdk/graphql-operation-types-new';

import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
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
export const GetProfileByIdDocument = /*#__PURE__*/ gql`
  query GetProfileByID($id: ID!) {
    node(id: $id) {
      ... on Profile {
        ...UserProfileFragment
      }
    }
  }
  ${UserProfileFragmentDoc}
`;
export const GetProfileByDidDocument = /*#__PURE__*/ gql`
  query GetProfileByDid($id: ID!) {
    node(id: $id) {
      ... on CeramicAccount {
        profile {
          ...UserProfileFragment
        }
      }
    }
  }
  ${UserProfileFragmentDoc}
`;
export type Requester<C = {}, E = unknown> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C,
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetProfileByID(
      variables: Types.GetProfileByIdQueryVariables,
      options?: C,
    ): Promise<Types.GetProfileByIdQuery> {
      return requester<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(
        GetProfileByIdDocument,
        variables,
        options,
      ) as Promise<Types.GetProfileByIdQuery>;
    },
    GetProfileByDid(
      variables: Types.GetProfileByDidQueryVariables,
      options?: C,
    ): Promise<Types.GetProfileByDidQuery> {
      return requester<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(
        GetProfileByDidDocument,
        variables,
        options,
      ) as Promise<Types.GetProfileByDidQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
