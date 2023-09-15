import { filter, MonoTypeOperatorFunction } from 'rxjs';
import { hasOwn } from './has-own';
import { UIEventData } from '@akashaorg/typings/lib/ui';

export function filterEvent(eventType: UIEventData['event']): MonoTypeOperatorFunction<
  Extract<
    UIEventData,
    {
      event: typeof eventType;
    }
  >
> {
  return filter(
    eventData => eventData && eventData.hasOwnProperty('event') && eventData.event === eventType,
  );
}

export const filterEvents = (
  eventTypes: UIEventData['event'][],
): MonoTypeOperatorFunction<
  Extract<
    UIEventData,
    {
      event: UIEventData['event'];
    }
  >
> => {
  return filter(evData => {
    if (evData && hasOwn(evData, 'event')) {
      return eventTypes.some(et => et === evData.event);
    }
    return false;
  });
};
