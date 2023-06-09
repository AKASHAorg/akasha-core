import * as React from 'react';
import { createErrorHandler } from './utils/error-handler';
import { filter } from 'rxjs/operators';
import getSDK from '@akashaorg/awf-sdk';
import { AUTH_EVENTS, CurrentUser } from '@akashaorg/typings/sdk';

export type OnLoginSuccessHandler = (data: CurrentUser) => void;
export type OnLogoutSuccessHandler = () => void;
export type OnErrorHandler = (payload: { error: Error }) => void;

export interface UseGlobalLoginProps {
  onLogin: OnLoginSuccessHandler;
  onLogout: OnLogoutSuccessHandler;
  onError?: OnErrorHandler;
  onLoadFromCache?: (data: CurrentUser) => void;
}

/**
 * Hook that will fire an action when the sign in is called
 * @example useGlobalLogin hook
 * ```typescript
 * useGlobalLogin({
 * onLogin: payload => {},
 * onLogout: () => {},
 * waitForAuth: payload => {}.
 * onReady: payload => {},
 * onLoadFromCache: payload => {},
 * onError: payload => {},
 * })
 * ```
 */
const useGlobalLogin = (props: UseGlobalLoginProps): void => {
  const { onError, onLogin, onLogout, onLoadFromCache } = props;
  const onErrorHandler = React.useRef(onError);
  const onLoginHandler = React.useRef(onLogin);
  const onLogoutHandler = React.useRef(onLogout);
  const onLoadFromCacheHandler = React.useRef(onLoadFromCache);

  const sdk = React.useRef(getSDK());

  React.useEffect(() => {
    const call = sdk.current.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === AUTH_EVENTS.SIGN_IN;
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
    const logoutCall = sdk.current.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === AUTH_EVENTS.SIGN_OUT;
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
    sdk.current.api.auth.getCurrentUser().then(resp => {
      if (onLoadFromCacheHandler.current) {
        onLoadFromCacheHandler.current(resp);
      }
    });
  }, []);
};

export default useGlobalLogin;
