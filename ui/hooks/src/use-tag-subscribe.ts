import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { filter } from 'rxjs/operators';
import { createErrorHandler } from './utils/error-handler';

export interface UseTagSubscribeActions {
  isSubscribedToTag: (tagName: string) => void;
  toggleTagSubscription: (tagName: string) => void;
  getTagSubscriptions: () => void;
}

export interface UseTagSubscribeProps {
  onError?: (error: IAkashaError) => void;
  profileService: any;
  globalChannel: any;
}

/* A hook with toggle tag subscription, get tag subscriptions and isSubscribedToTag functionality */
export const useTagSubscribe = (
  props: UseTagSubscribeProps,
): [string[], UseTagSubscribeActions] => {
  const { onError, profileService, globalChannel } = props;
  const [tagSubscriptionState, setTagSubscriptionState] = React.useState<string[]>([]);

  const handleSubscribe = (payload: any) => {
    const { data, channelInfo } = payload;
    if (data && !(tagSubscriptionState.findIndex(tag => tag === channelInfo.args) >= 0)) {
      setTagSubscriptionState(prev => [...prev, channelInfo.args]);
    } else if (data && tagSubscriptionState.findIndex(tag => tag === channelInfo.args) >= 0) {
      setTagSubscriptionState(prev => prev.filter(tag => tag !== channelInfo.args));
    }
  };

  // this is used to sync tag subscription state between different components using the hook
  React.useEffect(() => {
    const call = globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'toggleTagSubscription' &&
          payload.channelInfo.servicePath.includes('PROFILE_STORE')
        );
      }),
    );
    call.subscribe(
      handleSubscribe,
      createErrorHandler('useTagSubscribe.globalSubscribe', false, onError),
    );
    return () => call.unsubscribe();
  }, []);

  const actions: UseTagSubscribeActions = {
    isSubscribedToTag(tagName) {
      const call = profileService.isSubscribedToTag(tagName);
      call.subscribe((resp: { data?: { isSubscribedToTag: boolean } }) => {
        if (resp.data && !tagSubscriptionState.includes(tagName)) {
          setTagSubscriptionState(prev => [...prev, tagName]);
        } else if (!resp.data && tagSubscriptionState.includes(tagName)) {
          setTagSubscriptionState(prev => prev.filter(tag => tag !== tagName));
        }
      }, createErrorHandler('useTagSubscribe.isSubscribedToTag', false, onError));
    },

    toggleTagSubscription(tagName) {
      const call = profileService.toggleTagSubscription(tagName);
      call.subscribe((resp: any) => {
        if (resp.data && !tagSubscriptionState.includes(tagName)) {
          setTagSubscriptionState(prev => [...prev, tagName]);
        } else if (resp.data && tagSubscriptionState.includes(tagName)) {
          setTagSubscriptionState(prev => prev.filter(tag => tag !== tagName));
        }
      }, createErrorHandler('useTagSubscribe.toggleTagSubscription', false, onError));
    },
    getTagSubscriptions() {
      const call = profileService.getTagSubscriptions(null);
      call.subscribe((resp: any) => {
        if (resp.data) {
          setTagSubscriptionState(resp.data);
        }
      }, createErrorHandler('useTagSubscribe.getTagSubscriptions', false, onError));
    },
  };

  return [tagSubscriptionState, actions];
};

export default useTagSubscribe;
