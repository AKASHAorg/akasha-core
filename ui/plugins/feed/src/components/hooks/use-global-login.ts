import * as React from 'react';
import { filter } from 'rxjs/operators';

/**
 * a hook that will fire an action when the signIn is called
 */

export const useGlobalLogin = (channel: any, onSuccess: any, onError: any) => {
  const handleSubscribe = (payload: any) => {
    const { data } = payload;
    onSuccess(data);
  };

  const handleError = (err: Error) => {
    onError(err);
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
