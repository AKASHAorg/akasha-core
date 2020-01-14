import { Dispatch } from 'react';
import { fetchFeedItemData, fetchFeedItems } from '../../services/feed-service';
import { IAction, IBaseSuspenseAction, ValueOf } from '../interfaces';
import { useSuspenseAction } from '../suspense-action';
import { actionTypes } from './action-types';

export interface IFeedActions {
  getFeedItems: IBaseSuspenseAction<any>;
  getFeedItemData: IBaseSuspenseAction<any>;
}

// disable hooks-nesting to avoid naming them as `useMyAction`
// tslint:disable: react-hooks-nesting

export const getFeedActions = (
  dispatch: Dispatch<IAction<any, ValueOf<typeof actionTypes>>>,
): IFeedActions => ({
  getFeedItems: payload =>
    useSuspenseAction(dispatch, fetchFeedItems, {
      payload,
      type: actionTypes.GET_FEED_ITEMS,
    }),

  getFeedItemData: payload =>
    useSuspenseAction(dispatch, fetchFeedItemData, {
      payload,
      type: actionTypes.GET_FEED_ITEM_DATA,
    }),
});
