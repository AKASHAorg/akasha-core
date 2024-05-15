import { useEffect, useRef, useState } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { GQL_EVENTS } from '@akashaorg/typings/lib/sdk';

/**
 * Hook to listen for mutation events
 * @example useListenForMutationEvents hook
 * ```typescript
 * const mutationEvent = useListenForMutationEvents();
 *
 * const { messageObj, appid, success, pending } = mutationEvent;
 * ```
 */
export function useListenForMutationEvents() {
  const [data, setData] = useState(null);

  const sdk = getSDK();

  const messageObj = useRef(null);
  const uuid = useRef('');

  useEffect(() => {
    const subSDK = sdk.api.globalChannel.subscribe({
      next: (eventData: {
        data: { uuid: string; [key: string]: unknown };
        event: GQL_EVENTS.MUTATION;
      }) => {
        if (eventData.event === GQL_EVENTS.MUTATION) {
          const currentUuid = eventData.data.uuid;

          if (currentUuid !== uuid.current) {
            uuid.current = currentUuid;
            messageObj.current = sdk.services.gql.consumeMutationNotificationObject(currentUuid);
          }
          setData({ ...eventData.data, messageObj: messageObj.current, appid: uuid.current });
        }
      },
    });
    return () => {
      if (subSDK) {
        subSDK.unsubscribe();
      }
    };
  }, []);
  return data;
}
