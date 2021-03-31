import * as React from 'react';
import { IAkashaError, LEGAL_DOCS } from '@akashaproject/ui-awf-typings';
import { createErrorHandler } from './utils/error-handler';

export interface UseLegalActions {
  getLegalDoc: (doc: LEGAL_DOCS) => void;
}

export interface UseLegalProps {
  onError?: (error: IAkashaError) => void;
  commonService: any;
}

/* A hook to access legal documents from the ipfsService */
export const useLegal = (props: UseLegalProps): [string | null, UseLegalActions] => {
  const { onError, commonService } = props;
  const [legalDocsState, setLegalDocsState] = React.useState<string | null>(null);

  const actions: UseLegalActions = {
    getLegalDoc(doc) {
      const call = commonService.ipfsService.getLegalDoc(doc);
      call.subscribe((resp: any) => {
        if (resp.data) {
          setLegalDocsState(resp.data);
        }
      }, createErrorHandler('useLegal.getLegalDoc', false, onError));
    },
  };

  return [legalDocsState, actions];
};

export default useLegal;
