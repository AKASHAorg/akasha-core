import { events } from '@akashaorg/sdk-typings';
import {
  EventTypes,
  UIEventData,
  ExtensionMatcherFn,
  BaseIntegrationInfo,
} from '@akashaorg/ui-awf-typings/lib/app-loader';
import { filter, from, map, mergeMap, ReplaySubject } from 'rxjs';
import { filterEvent } from './events';
import { stringToRegExp } from './utils';

export const extensionMatcher: ExtensionMatcherFn<ReplaySubject<unknown>> =
  (uiEvents, globalChannel, props, parentConfig) => extConfig => {
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
            map(([mountPoint, loader]) => ({
              mountPoint,
              loader,
              event,
            })),
          ),
        ),
      )
      .subscribe(({ loader, event }) => {
        // do not wait for unmount
        loader.unload(event);
      });

    globalChannel
      .pipe(
        filterEvent(events.APP_EVENTS.REMOVED),
        filter(res => {
          const { data } = res as { data: BaseIntegrationInfo };
          return data.name === parentConfig.name;
        }),
        mergeMap(({ event, data }: { event: events.APP_EVENTS; data: BaseIntegrationInfo }) =>
          from(Object.entries(extConfig)).pipe(
            filter(([mountPoint]) => stringToRegExp(mountPoint).test(data.name)),
            map(([mountPoint, loader]) => ({
              mountPoint,
              loader,
              event: { event, data } as unknown as UIEventData,
            })),
          ),
        ),
      )
      .subscribe({
        next: ({ loader, event }) => {
          loader.unload(event);
        },
      });
  };
