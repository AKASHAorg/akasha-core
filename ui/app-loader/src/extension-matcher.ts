import { APP_EVENTS } from '@akashaorg/typings/sdk';
import { IntegrationInfoFragmentFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import { EventTypes, ExtensionMatcherFn, EventDataTypes } from '@akashaorg/typings/ui';
import { filter, from, map, mergeMap, ReplaySubject } from 'rxjs';
import { filterEvent } from './events';
import { stringToRegExp } from './utils';

export const extensionMatcher: ExtensionMatcherFn<ReplaySubject<unknown>> =
  (uiEvents, globalChannel, props, parentConfig) => extConfig => {
    uiEvents
      .pipe(
        filterEvent(EventTypes.ExtensionPointMount),
        mergeMap((event: { event: EventTypes; data?: EventDataTypes }) =>
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
      .subscribe({
        next: ({ event, loader }) => {
          loader.load(
            {
              uiEvents,
              extensionData: event.data,
              domElement: document.getElementById(event.data.name),
              ...props,
            },
            parentConfig.name,
          );
        },
        error: err => {
          props.logger.error(
            `Error loading extension from app ${parentConfig.name}: ${
              err.message ?? err.toString()
            }`,
          );
        },
      });

    uiEvents
      .pipe(
        filterEvent(EventTypes.ExtensionPointUnmount),
        mergeMap((event: { event: EventTypes; data?: EventDataTypes }) =>
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
      .subscribe({
        next: ({ loader, event }) => {
          // do not wait for unmount
          loader.unload(event, parentConfig.name);
        },
        error: err => {
          // sometimes this error si swallowed..
          // TODO: force the error from the stream
          props.logger.error(
            `Error unloading extension from app ${parentConfig.name}: ${
              err.message ?? err.toString()
            }`,
          );
        },
      });

    globalChannel
      .pipe(
        filterEvent(APP_EVENTS.REMOVED),
        filter(res => {
          const { data } = res as { data: IntegrationInfoFragmentFragment };
          return data.name === parentConfig.name;
        }),
        mergeMap(({ event, data }: { event: APP_EVENTS; data: IntegrationInfoFragmentFragment }) =>
          from(Object.entries(extConfig)).pipe(
            filter(([mountPoint]) => stringToRegExp(mountPoint).test(data.name)),
            map(([mountPoint, loader]) => ({
              mountPoint,
              loader,
              event: { event, data } as unknown as { event: EventTypes; data: EventDataTypes },
            })),
          ),
        ),
      )
      .subscribe({
        next: ({ loader, event }) => loader.unload(event, parentConfig.name),
        error: err => {
          props.logger.error(
            `Error unloading extension from app ${parentConfig.name}: ${
              err.message ?? err.toString()
            }`,
          );
        },
      });
  };
