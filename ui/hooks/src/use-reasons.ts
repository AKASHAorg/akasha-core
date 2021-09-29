import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

import { createErrorHandler } from './utils/error-handler';
import { getModerationReasons } from './moderation-requests';

export interface UseReasonsActions {
  /**
   *  fetch reasons, pass active as true to get only active reasons
   */
  fetchReasons: (data: { active: boolean }) => void;
}

export interface IReasonsState {
  reasons: string[];
}

export interface UseReasonsProps {
  onError?: (error: IAkashaError) => void;
}

const initialReasonstate = {
  reasons: [],
};

export type IReasonsAction = {
  type: 'FETCH_REASONS_SUCCESS';
  payload: string[];
};

const ReasonStateReducer = (state: IReasonsState, action: IReasonsAction) => {
  switch (action.type) {
    case 'FETCH_REASONS_SUCCESS': {
      return {
        ...state,
        reasons: action.payload,
      };
    }
    default:
      throw new Error('[ReasonStateReducer] action is not defined!');
  }
};

/* A hook to get predefined reasons from moderation API */
export const useReasons = (props: UseReasonsProps): [string[], UseReasonsActions] => {
  const { onError } = props;

  const [reasonsState, dispatch] = React.useReducer(ReasonStateReducer, initialReasonstate);

  const actions: UseReasonsActions = {
    async fetchReasons(data) {
      try {
        const res = await getModerationReasons(data);

        if (Array.isArray(res)) {
          // pick only labels for each reason object
          const labels = res.reduce(
            (acc: string[], cur: Record<string, unknown>) => [...acc, cur.label],
            [],
          );
          // dispatch labels, adding last option - 'Other'
          dispatch({ type: 'FETCH_REASONS_SUCCESS', payload: [...labels, 'Other'] });
        } else {
          throw new Error('Response must be an array');
        }
      } catch (error) {
        return createErrorHandler('useReasons.fetchReasons', false, onError);
      }
    },
  };

  return [reasonsState.reasons, actions];
};

export default useReasons;
