import * as Types from '@akashaorg/typings/sdk/graphql-operation-types';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom.js';
import gql from 'graphql-tag';
export const UserProfileFragmentFragmentDoc = gql`
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
  totalFollowers
  totalFollowing
}
    `;
export const GetProfileByIdDocument = gql`
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on Profile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentFragmentDoc}`;
export const GetProfileByDidDocument = gql`
    query GetProfileByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      profile {
        ...UserProfileFragment
      }
    }
  }
}
    ${UserProfileFragmentFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetProfileByID(variables: Types.GetProfileByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetProfileByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetProfileByIdQuery>(GetProfileByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetProfileByID', 'query');
    },
    GetProfileByDid(variables: Types.GetProfileByDidQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetProfileByDidQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetProfileByDidQuery>(GetProfileByDidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetProfileByDid', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;