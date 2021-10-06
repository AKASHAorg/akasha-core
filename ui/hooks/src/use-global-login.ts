import * as React from 'react';
import { createErrorHandler } from './utils/error-handler';
import { filter } from 'rxjs/operators';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';
import { CurrentUser } from '@akashaproject/sdk-typings/lib/interfaces/common';

/**
 * a hook that will fire an action when the signIn is called
 */
export type OnLoginSuccessHandler = (data: CurrentUser) => void;
export type OnLogoutSuccessHandler = () => void;
export type OnErrorHandler = (payload: { error: Error }) => void;

export interface UseGlobalLoginProps {
  onLogin: OnLoginSuccessHandler;
  onLogout: OnLogoutSuccessHandler;
  onError?: OnErrorHandler;
  waitForAuth?: (data: boolean) => void;
  onReady?: (data: { ethAddress: string; pubKey: string }) => void;
  onLoadFromCache?: (data: CurrentUser) => void;
}

const useGlobalLogin = (props: UseGlobalLoginProps): void => {
  const { onError, onLogin, waitForAuth, onReady, onLogout, onLoadFromCache } = props;
  const onErrorHandler = React.useRef(onError);
  const onLoginHandler = React.useRef(onLogin);
  const waitForAuthHandler = React.useRef(waitForAuth);
  const onLogoutHandler = React.useRef(onLogout);
  const onReadyHandler = React.useRef(onReady);
  const onLoadFromCacheHandler = React.useRef(onLoadFromCache);

  const sdk = React.useRef(getSDK());

  React.useEffect(() => {
    const call = sdk.current.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.SIGN_IN;
      }),
    );
    const sub = call.subscribe({
      next: payload => {
        const { data } = payload;
        onLoginHandler.current(data as CurrentUser);
      },
      error: createErrorHandler('useGlobalLogin.login'),
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const waitForAuthCall = sdk.current.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.WAIT_FOR_AUTH;
      }),
    );

    const sub = waitForAuthCall.subscribe(payload => {
      const { data } = payload;
      if (waitForAuthHandler.current) {
        waitForAuthHandler.current(!!data as boolean);
      }
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const readyCall = sdk.current.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.READY;
      }),
    );

    const sub = readyCall.subscribe(payload => {
      const { data } = payload;
      if (onReadyHandler.current) {
        onReadyHandler.current(data as { ethAddress: string; pubKey: string });
      }
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const logoutCall = sdk.current.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.SIGN_OUT;
      }),
    );
    const sub = logoutCall.subscribe({
      next: () => {
        onLogoutHandler.current();
      },
      error: createErrorHandler('useGlobalLogin.logoutCall', false, onErrorHandler.current),
    });
    return () => sub.unsubscribe();
  }, []);
  React.useLayoutEffect(() => {
    // make an attempt to load the eth address from cache;

    const getDepsCall = sdk.current.api.auth.getCurrentUser();
    const sub = getDepsCall.subscribe({
      next: resp => {
        if (onLoadFromCacheHandler.current) {
          onLoadFromCacheHandler.current(resp.data);
        }
      },
    });
    return () => sub.unsubscribe();
  }, []);
};

export default useGlobalLogin;
