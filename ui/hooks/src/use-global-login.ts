import * as React from 'react';
import { createErrorHandler } from './utils/error-handler';
import { filter } from 'rxjs/operators';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';

/**
 * a hook that will fire an action when the signIn is called
 */
export type OnLoginSuccessHandler = (data: { ethAddress: string; pubKey: string }) => void;
export type OnLogoutSuccessHandler = () => void;
export type OnErrorHandler = (payload: { error: Error }) => void;

export interface UseGlobalLoginProps {
  onLogin: OnLoginSuccessHandler;
  onLogout: OnLogoutSuccessHandler;
  onError?: OnErrorHandler;
  waitForAuth?: (data: boolean) => void;
  onReady?: (data: { ethAddress: string; pubKey: string }) => void;
}

const useGlobalLogin = (props: UseGlobalLoginProps): void => {
  const { onError } = props;

  const sdk = getSDK();

  React.useEffect(() => {
    const call = sdk.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.SIGN_IN;
      }),
    );
    const sub = call.subscribe({
      next: payload => {
        const { data } = payload;
        props.onLogin(data as { ethAddress: string; pubKey: string });
      },
      error: createErrorHandler('useGlobalLogin.login'),
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const waitForAuthCall = sdk.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.WAIT_FOR_AUTH;
      }),
    );

    const sub = waitForAuthCall.subscribe(payload => {
      const { data } = payload;
      if (props.waitForAuth) {
        props.waitForAuth(data as boolean);
      }
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const readyCall = sdk.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.READY;
      }),
    );

    const sub = readyCall.subscribe(payload => {
      const { data } = payload;
      if (props.onReady) {
        props.onReady(data as { ethAddress: string; pubKey: string });
      }
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const logoutCall = sdk.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.SIGN_OUT;
      }),
    );
    const sub = logoutCall.subscribe({
      next: () => {
        props.onLogout();
      },
      error: createErrorHandler('useGlobalLogin.logoutCall', false, onError),
    });
    return () => sub.unsubscribe();
  }, []);
};

export default useGlobalLogin;
