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
  beamID
}
    `;
export const IndexedContentBlockFragmentDoc = /*#__PURE__*/ `
    fragment IndexedContentBlockFragment on IndexContentBlockPayloadDocument {
  blockID
}
    `;
export const IndexedReflectFragmentDoc = /*#__PURE__*/ `
    fragment IndexedReflectFragment on IndexReflectPayloadDocument {
  reflectionID
}
    `;
export const IndexedProfileFragmentDoc = /*#__PURE__*/ `
    fragment IndexedProfileFragment on IndexProfilePayloadDocument {
  profileID
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
export const IndexContentBlockDocument = /*#__PURE__*/ `
    mutation IndexContentBlock($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexContentBlock(jws: $jws, capability: $capability) {
    document {
      ...IndexedContentBlockFragment
    }
  }
}
    ${IndexedContentBlockFragmentDoc}`;
export const useIndexContentBlockMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.IndexContentBlockMutation, TError, Types.IndexContentBlockMutationVariables, TContext>) =>
    useMutation<Types.IndexContentBlockMutation, TError, Types.IndexContentBlockMutationVariables, TContext>(
      ['IndexContentBlock'],
      (variables?: Types.IndexContentBlockMutationVariables) => composeDbFetch<Types.IndexContentBlockMutation, Types.IndexContentBlockMutationVariables>(IndexContentBlockDocument, variables)(),
      options
    );
useIndexContentBlockMutation.getKey = () => ['IndexContentBlock'];

useIndexContentBlockMutation.fetcher = (variables?: Types.IndexContentBlockMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.IndexContentBlockMutation, Types.IndexContentBlockMutationVariables>(IndexContentBlockDocument, variables, options);
export const IndexReflectionDocument = /*#__PURE__*/ `
    mutation IndexReflection($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexReflection(jws: $jws, capability: $capability) {
    document {
      ...IndexedReflectFragment
    }
  }
}
    ${IndexedReflectFragmentDoc}`;
export const useIndexReflectionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.IndexReflectionMutation, TError, Types.IndexReflectionMutationVariables, TContext>) =>
    useMutation<Types.IndexReflectionMutation, TError, Types.IndexReflectionMutationVariables, TContext>(
      ['IndexReflection'],
      (variables?: Types.IndexReflectionMutationVariables) => composeDbFetch<Types.IndexReflectionMutation, Types.IndexReflectionMutationVariables>(IndexReflectionDocument, variables)(),
      options
    );
useIndexReflectionMutation.getKey = () => ['IndexReflection'];

useIndexReflectionMutation.fetcher = (variables?: Types.IndexReflectionMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.IndexReflectionMutation, Types.IndexReflectionMutationVariables>(IndexReflectionDocument, variables, options);
export const IndexProfileDocument = /*#__PURE__*/ `
    mutation IndexProfile($jws: DID_JWS, $capability: CACAO_CAPABILITY) {
  indexProfile(jws: $jws, capability: $capability) {
    document {
      ...IndexedProfileFragment
    }
  }
}
    ${IndexedProfileFragmentDoc}`;
export const useIndexProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.IndexProfileMutation, TError, Types.IndexProfileMutationVariables, TContext>) =>
    useMutation<Types.IndexProfileMutation, TError, Types.IndexProfileMutationVariables, TContext>(
      ['IndexProfile'],
      (variables?: Types.IndexProfileMutationVariables) => composeDbFetch<Types.IndexProfileMutation, Types.IndexProfileMutationVariables>(IndexProfileDocument, variables)(),
      options
    );
useIndexProfileMutation.getKey = () => ['IndexProfile'];

useIndexProfileMutation.fetcher = (variables?: Types.IndexProfileMutationVariables, options?: RequestInit['headers']) => composeDbFetch<Types.IndexProfileMutation, Types.IndexProfileMutationVariables>(IndexProfileDocument, variables, options);