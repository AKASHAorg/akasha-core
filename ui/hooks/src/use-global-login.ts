import * as React from 'react';
import { createErrorHandler } from './utils/error-handler';
import { filter } from 'rxjs/operators';
import getSDK from '@akashaproject/awf-sdk';

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

  const handleLoginSubscribe = (payload: any) => {
    const { data } = payload;
    props.onLogin(data);
  };

  const handleLogoutSubscribe = () => {
    props.onLogout();
  };

  React.useEffect(() => {
    const call = sdk.api.globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'signIn' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );
    const sub = call.subscribe(handleLoginSubscribe, createErrorHandler('useGlobalLogin.login'));
    return () => sub.unsubscribe();
  }, []);
  React.useEffect(() => {
    const waitForAuthCall = sdk.api.globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'waitForAuth' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );

    const sub = waitForAuthCall.subscribe((payload: { data: boolean }) => {
      const { data } = payload;
      if (props.waitForAuth) {
        props.waitForAuth(data);
      }
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const readyCall = sdk.api.globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'ready' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );

    const sub = readyCall.subscribe((payload: { data: { ethAddress: string; pubKey: string } }) => {
      const { data } = payload;
      if (props.onReady) {
        props.onReady(data);
      }
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const logoutCall = sdk.api.globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'signOut' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );
    const sub = logoutCall.subscribe(
      handleLogoutSubscribe,
      createErrorHandler('useGlobalLogin.logoutCall', false, onError),
    );
    return () => sub.unsubscribe();
  }, []);
};

export default useGlobalLogin;
