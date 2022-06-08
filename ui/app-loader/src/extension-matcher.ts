import {
  EventTypes,
  UIEventData,
  ExtensionMatcherFn,
} from '@akashaorg/ui-awf-typings/lib/app-loader';
import { filter, from, map, mergeMap } from 'rxjs';
import { filterEvent } from './events';
import { stringToRegExp } from './utils';

export const extensionMatcher: ExtensionMatcherFn = (uiEvents, props) => extConfig => {
  uiEvents
    .pipe(
      filterEvent(EventTypes.ExtensionPointMount),
      mergeMap((event: UIEventData) =>
        from(Object.entries(extConfig))
          .pipe(filter(([mountPoint]) => stringToRegExp(mountPoint).test(event.data.name)))
          .pipe(
            map(([mountPoint, handler]) => ({
              mountPoint,
              loader: handler,
              event,
            })),
          ),
      ),
    )
    .subscribe(({ event, loader }) => {
      loader.load({
        uiEvents,
        extensionData: event.data,
        domElement: document.getElementById(event.data.name),
        ...props,
      });
    });

  uiEvents
    .pipe(
      filterEvent(EventTypes.ExtensionPointUnmount),
      mergeMap((event: UIEventData) =>
        from(Object.entries(extConfig)).pipe(
          filter(([mountPoint]) => stringToRegExp(mountPoint).test(event.data.name)),
          map(([mountPoint, handler]) => ({
            mountPoint,
            loader: handler,
            event,
          })),
        ),
      ),
    )
    .subscribe(({ loader, event }) => {
      // do not wait for unmount
      loader.unload(event);
    });
};
