import type * as Types from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';

function composeDbFetch<TData, TVariables extends Record<string, unknown>>(query: string, variables?: TVariables, options?: unknown) {
  const sdk = getSDK();
    const gqlOptions = Object.assign({}, { context: { source: sdk.services.gql.contextSources.default }}, options);
  return async () => {
    return sdk.services.gql.requester<TData, TVariables>(query, variables, gqlOptions);
  };
}

export const IndexedBeamFragmentDoc = /*#__PURE__*/ `
    fragment IndexedBeamFragment on IndexBeamPayloadDocument {
  id
  createdAt
  beamID
}
    `;
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