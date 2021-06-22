import * as React from 'react';
import { IAkashaError, LEGAL_DOCS } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { createErrorHandler } from './utils/error-handler';

export interface UseLegalActions {
  /**
   *  fetch a specific legal document for ethereum world
   *  @param doc - type of legal document to fetch
   */
  getLegalDoc: (doc: LEGAL_DOCS) => void;
}

export interface UseLegalProps {
  onError?: (error: IAkashaError) => void;
}

export interface ILegalState {
  doc: string;
  docQuery: LEGAL_DOCS | null;
}

const initialLegalState = {
  doc: 'null',
  docQuery: null,
};

export type ILegalAction =
  | { type: 'GET_LEGAL_DOCS'; payload: LEGAL_DOCS }
  | {
      type: 'GET_LEGAL_DOCS_SUCCESS';
      payload: string;
    };

const LegalStateReducer = (state: ILegalState, action: ILegalAction) => {
  switch (action.type) {
    case 'GET_LEGAL_DOCS':
      return { ...state, docQuery: action.payload };
    case 'GET_LEGAL_DOCS_SUCCESS': {
      return {
        ...state,
        docQuery: null,
        doc: action.payload,
      };
    }

    default:
      throw new Error('[UseLegalReducer] action is not defined!');
  }
};

/* A hook to access legal documents from the ipfsService */
export const useLegal = (props: UseLegalProps): [string | null, UseLegalActions] => {
  const { onError } = props;

  const sdk = getSDK();

  const [legalDocsState, dispatch] = React.useReducer(LegalStateReducer, initialLegalState);

  React.useEffect(() => {
    if (legalDocsState.docQuery) {
      const call = sdk.services.ipfs.getLegalDoc(legalDocsState.docQuery);
      const callSub = call.subscribe((resp: any) => {
        if (resp.data) {
          dispatch({ type: 'GET_LEGAL_DOCS_SUCCESS', payload: resp.data });
        }
      }, createErrorHandler('useLegal.getLegalDoc', false, onError));
      return () => {
        callSub.unsubscribe();
      };
    }
    return;
  }, [legalDocsState.docQuery]);

  const actions: UseLegalActions = {
    getLegalDoc(doc) {
      dispatch({ type: 'GET_LEGAL_DOCS', payload: doc });
    },
  };

  return [legalDocsState.doc, actions];
};

export default useLegal;
