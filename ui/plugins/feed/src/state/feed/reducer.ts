import { Reducer, useReducer } from 'react';
import { createContainer } from 'react-tracked';
import { handleActions } from '../handle-actions';
import { IAction, UseValueType } from '../interfaces';
import { actionTypes } from './action-types';
import { getFeedActions, IFeedActions } from './actions';

import { IFeedState } from './interfaces';

export const feedState: IFeedState = {
  items: [],
  itemData: {},
};

export function feedInit(initialValues?: Partial<IFeedState>): IFeedState {
  return {
    ...feedState,
    ...initialValues,
  };
}

type FeedReducer = Reducer<IFeedState, IAction<any, keyof typeof actionTypes>>;
// @ts-ignore
export const feedReducer: FeedReducer = handleActions<typeof actionTypes, Draft<IFeedState>, any>(
  {
    GET_FEED_ITEMS: (draft, payload) => {
      const { items, reverse } = payload;
      if (reverse) {
        draft.items.unshift(...items);
      } else {
        draft.items.push(...items);
      }
    },
    GET_FEED_ITEM_DATA: (draft, payload) => {
      draft.itemData[payload.entryId] = payload;
    },
  },
  feedState,
);

const useValue: UseValueType<any, IFeedState, IFeedActions> = () => {
  const [state, dispatch] = useReducer(feedReducer, feedState);
  const actions = getFeedActions(dispatch);
  return [state, actions];
};

export const {
  Provider: FeedProvider,
  useTracked: useFeed,
  useTrackedState: useFeedState,
  useUpdate: useFeedUpdate,
  useSelector: useFeedSelector,
} = createContainer(useValue);
