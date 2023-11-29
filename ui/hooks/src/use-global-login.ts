import * as React from 'react';
import { createErrorHandler } from './utils/error-handler';
import { filter } from 'rxjs/operators';
import getSDK from '@akashaorg/awf-sdk';
import { AUTH_EVENTS, CurrentUser, WEB3_EVENTS } from '@akashaorg/typings/lib/sdk';

export type OnLoginSuccessHandler = (data: CurrentUser) => void;
export type OnLogoutSuccessHandler = () => void;
export type OnErrorHandler = (payload: { error: Error }) => void;

export interface UseGlobalLoginProps {
  onLogin: OnLoginSuccessHandler;
  onLogout: OnLogoutSuccessHandler;
  onError?: OnErrorHandler;
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
export const useGlobalLogin = (props: UseGlobalLoginProps): void => {
  const { onError, onLogin, onLogout } = props;
  const onErrorHandler = React.useRef(onError);
  const onLoginHandler = React.useRef(onLogin);
  const onLogoutHandler = React.useRef(onLogout);

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
        return payload.event === WEB3_EVENTS.DISCONNECTED;
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
};
