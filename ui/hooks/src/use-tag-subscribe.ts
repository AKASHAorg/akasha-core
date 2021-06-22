import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';
import { createErrorHandler } from './utils/error-handler';
import { filter } from 'rxjs/operators';

export interface UseTagSubscribeActions {
  /**
   * check if logged in user is subscribed to a tag
   * @param tagName - name of tag to check
   */
  isSubscribedToTag: (tagName: string) => void;
  /**
   * have current logged in user subscribe to a tag
   * @param tagName - name of tag to subscribe to
   */
  toggleTagSubscription: (tagName: string) => void;
  /**
   * get tag subscriptions for the current logged user
   */
  getTagSubscriptions: () => void;
}

export interface UseTagSubscribeProps {
  onError?: (error: IAkashaError) => void;
}

interface ITagSubscriptionState {
  isFetching: boolean;
  isSubscribedToTagPayload: string | null;
  toggleTagSubscriptionPayload: string | null;
  tags: string[];
}

export type ITagSubscriptionAction =
  | { type: 'GET_TAG_SUBSCRIPTIONS' }
  | {
      type: 'GET_TAG_SUBSCRIPTIONS_SUCCESS';
      payload: string[];
    }
  | { type: 'GET_IS_SUBSCRIBED_TO_TAG'; payload: string }
  | {
      type: 'GET_IS_SUBSCRIBED_TO_TAG_SUCCESS';
      payload: { isSubscribedToTag?: boolean; tag: string };
    }
  | { type: 'TOGGLE_TAG_SUBSCRIPTION'; payload: string }
  | {
      type: 'TOGGLE_TAG_SUBSCRIPTION_SUCCESS';
      payload: { tagSubscribed: boolean; tag: string };
    };

const initialTagSubscriptionState: ITagSubscriptionState = {
  isFetching: false,
  isSubscribedToTagPayload: null,
  toggleTagSubscriptionPayload: null,
  tags: [],
};

const tagSubscriptionStateReducer = (
  state: ITagSubscriptionState,
  action: ITagSubscriptionAction,
) => {
  switch (action.type) {
    case 'GET_TAG_SUBSCRIPTIONS':
      return { ...state, isFetching: true };
    case 'GET_TAG_SUBSCRIPTIONS_SUCCESS': {
      const tags = action.payload;

      return {
        ...state,
        tags: tags || [],
        isFetching: false,
      };
    }
    case 'GET_IS_SUBSCRIBED_TO_TAG':
      return { ...state, isSubscribedToTagPayload: action.payload };
    case 'GET_IS_SUBSCRIBED_TO_TAG_SUCCESS': {
      const { isSubscribedToTag, tag } = action.payload;

      if (isSubscribedToTag && !state.tags.includes(tag)) {
        return {
          ...state,
          tags: [...state.tags, tag],
          isSubscribedToTagPayload: null,
        };
      } else if (!isSubscribedToTag && state.tags.includes(tag)) {
        const filteredTags = state.tags.filter(tagName => tagName !== tag);
        return {
          ...state,
          tags: filteredTags,
          isSubscribedToTagPayload: null,
        };
      }
      return { ...state, isSubscribedToTagPayload: null };
    }
    case 'TOGGLE_TAG_SUBSCRIPTION':
      return { ...state, toggleTagSubscriptionPayload: action.payload };
    case 'TOGGLE_TAG_SUBSCRIPTION_SUCCESS': {
      const { tag, tagSubscribed } = action.payload;

      if (tagSubscribed && !state.tags.includes(tag)) {
        return {
          ...state,
          tags: [...state.tags, tag],
          toggleTagSubscriptionPayload: null,
        };
      } else if (!tagSubscribed && state.tags.includes(tag)) {
        const filteredTags = state.tags.filter(tagName => tagName !== tag);
        return {
          ...state,
          tags: filteredTags,
          toggleTagSubscriptionPayload: null,
        };
      }
      return { ...state, toggleTagSubscriptionPayload: null };
    }
    default:
      throw new Error('[UseTagSubscriptionReducer] action is not defined!');
  }
};

/* A hook with toggle tag subscription, get tag subscriptions and isSubscribedToTag functionality */
export const useTagSubscribe = (
  props: UseTagSubscribeProps,
): [string[], UseTagSubscribeActions] => {
  const { onError } = props;

  const sdk = getSDK();

  const [tagSubscriptionState, dispatch] = React.useReducer(
    tagSubscriptionStateReducer,
    initialTagSubscriptionState,
  );

  const handleSubscribe = (payload: any) => {
    const { data, channelInfo } = payload;
    dispatch({
      type: 'TOGGLE_TAG_SUBSCRIPTION_SUCCESS',
      payload: { tag: channelInfo.args, tagSubscribed: data },
    });
  };

  // this is used to sync tag subscription state between different components using the hook
  React.useEffect(() => {
    const call = sdk.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.PROFILE_EVENTS.TOGGLE_TAG_SUBSCRIPTION;
      }),
    );
    const callSub = call.subscribe({
      next: handleSubscribe,
      error: createErrorHandler('useTagSubscribe.globalSubscribe', false, onError),
    });
    return () => callSub.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (tagSubscriptionState.isFetching) {
      const call = sdk.api.profile.getTagSubscriptions();
      const callSub = call.subscribe({
        next: (resp: any) => {
          dispatch({ type: 'GET_TAG_SUBSCRIPTIONS_SUCCESS', payload: resp.data });
        },
        error: createErrorHandler('useTagSubscribe.getTagSubscriptions', false, onError),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [tagSubscriptionState.isFetching]);

  React.useEffect(() => {
    const tagName = tagSubscriptionState.isSubscribedToTagPayload;

    if (tagName) {
      const call = sdk.api.profile.isSubscribedToTag(tagName);
      const callSub = call.subscribe({
        next: (resp: { data?: { isSubscribedToTag: boolean } }) => {
          dispatch({
            type: 'GET_IS_SUBSCRIBED_TO_TAG_SUCCESS',
            payload: { isSubscribedToTag: resp.data?.isSubscribedToTag, tag: tagName },
          });
        },
        error: createErrorHandler('useTagSubscribe.isSubscribedToTag', false, onError),
      });
      return () => {
        callSub.unsubscribe();
      };
    }
    return;
  }, [tagSubscriptionState.isSubscribedToTagPayload]);

  React.useEffect(() => {
    const tagName = tagSubscriptionState.toggleTagSubscriptionPayload;

    if (tagName) {
      (async () => {
        try {
          const resp = await sdk.api.profile.toggleTagSubscription(tagName);
          dispatch({
            type: 'TOGGLE_TAG_SUBSCRIPTION_SUCCESS',
            payload: { tagSubscribed: resp, tag: tagName },
          });
        } catch (error) {
          createErrorHandler('useTagSubscribe.toggleTagSubscription', false, onError);
        }
      })();
    }
  }, [tagSubscriptionState.toggleTagSubscriptionPayload]);

  const actions: UseTagSubscribeActions = {
    isSubscribedToTag(tagName) {
      dispatch({ type: 'GET_IS_SUBSCRIBED_TO_TAG', payload: tagName });
    },
    toggleTagSubscription(tagName) {
      dispatch({ type: 'TOGGLE_TAG_SUBSCRIPTION', payload: tagName });
    },
    getTagSubscriptions() {
      dispatch({ type: 'GET_TAG_SUBSCRIPTIONS' });
    },
  };

  return [tagSubscriptionState.tags, actions];
};

export default useTagSubscribe;
