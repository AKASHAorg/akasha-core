import { UIEventData, EventTypes } from '@akashaorg/typings/ui';
import {
  Subject,
  merge,
  fromEvent,
  tap,
  map,
  mapTo,
  filter,
  MonoTypeOperatorFunction,
  ReplaySubject,
  mergeMap,
  distinctUntilKeyChanged,
  mergeWith,
} from 'rxjs';
import { hidePageSplash } from './splash-screen';
import { LoaderState } from './state';
import { getModalFromParams } from './utils';
import { AUTH_EVENTS, APP_EVENTS } from '@akashaorg/typings/sdk';
import * as singleSpa from 'single-spa';

export const pipelineEvents = new Subject<Partial<LoaderState>>();
export const uiEvents = new ReplaySubject<UIEventData>();

/**
 * A helper operator to filter events,
 * @example <SubjectLike>.pipe(filterEvent(EventTypes.ExtensionPointMount)).subscribe(...)
 * @internal
 */
export function filterEvent(eventType: EventTypes): MonoTypeOperatorFunction<UIEventData>;
export function filterEvent(
  eventType: AUTH_EVENTS,
): MonoTypeOperatorFunction<{ event: AUTH_EVENTS; data?: { ethAddress: string } }>;
export function filterEvent(
  eventType: APP_EVENTS,
): MonoTypeOperatorFunction<{ event: APP_EVENTS; data?: unknown }>;

export function filterEvent(eventType: never) {
  return filter(
    (eventData: { event: string }) =>
      eventData && eventData.hasOwnProperty('event') && eventData.event === eventType,
  );
}

export type ObservedEventNames =
  | 'single-spa:before-mount-routing-event'
  | 'single-spa:routing-event';

export const spaEvents$ = merge(
  /**
   * Before the first of any single-spa applications is mounted,
   * single-spa fires a single-spa:before-first-mount event;
   * therefore it will only be fired once ever.
   * More specifically, it fires after the application is already
   * loaded but before mounting.
   * @internal
   */
  fromEvent(window, 'single-spa:before-first-mount')
    .pipe(tap(() => hidePageSplash()))
    .pipe(mapTo({})),
  /**
   * A single-spa:before-mount-routing-event event is fired after
   * `before-routing-event` and before `routing-event`.
   * It is guaranteed to fire after all single-spa applications
   * have been unmounted, but before any new applications have been mounted.
   *
   * Use this event to:
   *    - show an app area loader
   *    - load translation files for the mounting app
   * @internal
   */
  fromEvent(window, 'single-spa:before-mount-routing-event').pipe(
    map((spaEvent: CustomEvent<{ detail: singleSpa.SingleSpaCustomEventDetail }>) => ({
      spaEvents: {
        eventName: 'single-spa:before-mount-routing-event',
        detail: spaEvent.detail,
      },
    })),
  ),

  /**
   * A single-spa:routing-event event is fired every time that a routing
   * event has occurred, which is after each hashchange, popstate, or
   * triggerAppChange, even if no changes to registered applications were necessary;
   * and after single-spa verified that all apps were correctly
   * loaded, bootstrapped, mounted, and unmounted.
   *
   * Using this event for:
   *   - hiding app loader;
   *   - decide it it's 404;
   * @internal
   */
  fromEvent(window, 'single-spa:routing-event').pipe(
    map((spaEvent: CustomEvent<{ detail: singleSpa.SingleSpaCustomEventDetail }>) => ({
      spaEvents: {
        eventName: 'single-spa:routing-event',
        detail: spaEvent.detail,
      },
    })),
  ),
  /**
   * After the first of any single-spa applications is mounted, single-spa
   * fires a single-spa:first-mount event; therefore it will only be fired once ever.
   *
   * At this point, the layout is mounted.
   * @internal
   */
  fromEvent(window, 'single-spa:first-mount')
    .pipe(tap(() => console.timeEnd('AppLoader:firstMount')))
    .pipe(mapTo({})),
  /**
   * A single-spa:before-routing-event event is fired before
   * every routing event occurs, which is after each
   * hashchange, popstate, or triggerAppChange, even if no
   * changes to registered applications were necessary.
   * @internal
   */
  fromEvent(window, 'single-spa:before-routing-event').pipe(
    mergeMap(getModalFromParams(location)),
    distinctUntilKeyChanged('name'),
    tap(result => uiEvents.next({ event: EventTypes.ModalRequest, data: result })),
  ),
);

export const getUiEvents = () => {
  return merge(
    /**
     * when an extension point mounts:
     * Register the apps and widgets into single-spa.
     * Match the mountsIn property defined by the extension point with the `event.data.name`
     * property of the event.
     *    Load the extension points that match as single-spa parcel (mountRootParcel).
     * Note that the extensions are not conditioned by their parent integration status (mounted or not).
     *  However if the parent integration is disabled in the user prefs, they should not load.
     * @internal
     */
    uiEvents
      .pipe(filterEvent(EventTypes.ExtensionPointMount))
      .pipe(map(eventData => ({ ...eventData }))),

    uiEvents
      .pipe(filterEvent(EventTypes.ExtensionPointUnmount))
      .pipe(map(eventData => ({ ...eventData }))),

    uiEvents.pipe(filterEvent(EventTypes.LayoutReady)).pipe(mapTo({ layoutReady: true })),
  );
};

export const getGlobalChannelEvents = (globalChannel: ReplaySubject<unknown>) => {
  return merge(
    globalChannel.pipe(filterEvent(APP_EVENTS.INFO_READY)).pipe(map(evt => evt)),
    globalChannel.pipe(filterEvent(APP_EVENTS.REMOVED)).pipe(map(evt => evt)),
    globalChannel
      .pipe(filterEvent(AUTH_EVENTS.READY))
      .pipe(map(evt => ({ user: { ...evt.data, waitForAuth: false } }))),
    globalChannel.pipe(filterEvent(AUTH_EVENTS.WAIT_FOR_AUTH)).pipe(
      mapTo({
        user: {
          waitForAuth: true,
        },
      }),
    ),
  );
};

export const getEvents = (
  globalChannel: ReplaySubject<unknown> /* worldConfig: ILoaderConfig */,
) => {
  return spaEvents$.pipe(
    mergeWith(getUiEvents(), getGlobalChannelEvents(globalChannel), pipelineEvents.asObservable()),
  );
};
