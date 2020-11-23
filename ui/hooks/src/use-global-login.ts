import * as React from 'react';
import { filter } from 'rxjs/operators';

/**
 * a hook that will fire an action when the signIn is called
 */
export type OnSuccessHandler = (data: { ethAddress: string; token: string }) => void;
export type OnErrorHandler = (payload: { error: Error }) => void;

const useGlobalLogin = (
  channel: any,
  onSuccess: OnSuccessHandler,
  onError?: OnErrorHandler,
): void => {
  const handleSubscribe = (payload: any) => {
    const { data } = payload;
    onSuccess(data);
  };

  const handleError = (err: Error) => {
    if (onError) {
      onError({ error: err });
    }
  };

  React.useEffect(() => {
    const call = channel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'signIn' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );
    call.subscribe(handleSubscribe, handleError);
    return () => call.unsubscribe();
  }, []);
};

export default useGlobalLogin;
