import * as React from 'react';
import { filter } from 'rxjs/operators';
import { createErrorHandler } from './utils/error-handler';

/**
 * a hook that will fire an action when the signIn is called
 */
export type OnLoginSuccessHandler = (data: { ethAddress: string; pubKey: string }) => void;
export type OnLogoutSuccessHandler = () => void;
export type OnErrorHandler = (payload: { error: Error }) => void;

export interface UseGlobalLoginProps {
  globalChannel: any;
  onLogin: OnLoginSuccessHandler;
  onLogout: OnLogoutSuccessHandler;
  onError?: OnErrorHandler;
}

const useGlobalLogin = (props: UseGlobalLoginProps): void => {
  const { onError } = props;
  const handleLoginSubscribe = (payload: any) => {
    const { data } = payload;
    props.onLogin(data);
  };

  const handleLogoutSubscribe = () => {
    props.onLogout();
  };

  React.useEffect(() => {
    const call = props.globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'signIn' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );
    call.subscribe(handleLoginSubscribe, createErrorHandler('useGlobalLogin.login'));
    return () => call.unsubscribe();
  }, []);

  React.useEffect(() => {
    const logoutCall = props.globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'signOut' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );
    logoutCall.subscribe(
      handleLogoutSubscribe,
      createErrorHandler('useGlobalLogin.logoutCall', false, onError),
    );
  }, []);
};

export default useGlobalLogin;
