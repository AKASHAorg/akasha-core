import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { createErrorHandler } from './utils/error-handler';

export interface UseSignDataActions {
  /**
   *  sign data using the user's pubKey
   *  @param data - data to be signed
   *  @param base64Format - convert data to base64
   */
  signData: (
    data: string | Record<string, unknown> | Record<string, unknown>[],
    base64Format?: boolean,
  ) => void;
}

export interface UseSignDataProps {
  onError?: (error: IAkashaError) => void;
}

export interface ISignDataState {
  response: {
    serializedData: any;
    signature: string | Uint8Array;
    pubKey: string;
  } | null;
  signDataQuery: {
    data: string | Record<string, unknown> | Record<string, unknown>[];
    base64Format?: boolean;
  } | null;
}

const initialSignDataState = {
  response: null,
  signDataQuery: null,
};

export type ISignDataAction =
  | {
      type: 'SIGN_DATA';
      payload: {
        data: string | Record<string, unknown> | Record<string, unknown>[];
        base64Format?: boolean;
      };
    }
  | {
      type: 'SIGN_DATA_SUCCESS';
      payload: {
        serializedData: any;
        signature: string | Uint8Array;
        pubKey: string;
      };
    };

const signDataStateReducer = (state: ISignDataState, action: ISignDataAction) => {
  switch (action.type) {
    case 'SIGN_DATA':
      return { ...state, signDataQuery: action.payload };
    case 'SIGN_DATA_SUCCESS': {
      return {
        ...state,
        signDataQuery: null,
        response: action.payload,
      };
    }

    default:
      throw new Error('[UseSignDataReducer] action is not defined!');
  }
};

/* A hook to sign data */
export const useSignData = (
  props: UseSignDataProps,
): [
  {
    serializedData: any;
    signature: string | Uint8Array;
    pubKey: string;
  },
  UseSignDataActions,
] => {
  const { onError } = props;

  const sdk = getSDK();

  const [signDataState, dispatch] = React.useReducer(signDataStateReducer, initialSignDataState);

  React.useEffect(() => {
    if (signDataState.signDataQuery) {
      const { data, base64Format } = signDataState.signDataQuery;
      const call = sdk.api.auth.signData(data, base64Format);
      const callSub = call.subscribe({
        next: resp => {
          if (resp.data) {
            dispatch({ type: 'SIGN_DATA_SUCCESS', payload: resp.data });
          }
        },
        error: createErrorHandler('useSignData.getLegalDoc', false, onError),
      });
      return () => {
        callSub.unsubscribe();
      };
    }
    return;
  }, [signDataState.signDataQuery]);

  const actions: UseSignDataActions = {
    signData(data, base64Format) {
      dispatch({ type: 'SIGN_DATA', payload: { data, base64Format } });
    },
  };

  return [signDataState.response, actions];
};

export default useSignData;
