import { APP_EVENTS, AUTH_EVENTS } from '@akashaorg/typings/lib/sdk';
import { EventTypes } from '@akashaorg/typings/lib/ui';
import { map, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getGlobalChannelEvents, getUiEvents, spaEvents$, uiEvents } from '../src/events';

describe('[AppLoader]: events', () => {
  let globalChannel: ReplaySubject<any>;
  let uiEvents$: ReturnType<typeof getUiEvents>;
  let singleSpaEvents$;
  let globalChannelEvents$;
  beforeAll(() => {
    globalChannel = new ReplaySubject();
    uiEvents$ = getUiEvents();
    singleSpaEvents$ = spaEvents$;
    globalChannelEvents$ = getGlobalChannelEvents(globalChannel);
  });
  test('uiEvents subscriptions', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    scheduler.run(({ expectObservable, cold }) => {
      const eventsMarble = 'ab';
      const uiEventValues = {
        a: {
          event: EventTypes.ExtensionPointMount,
          data: { name: 'TestExtension1' },
        },
        b: {
          event: EventTypes.ExtensionPointUnmount,
          data: { name: 'TestExtension2' },
        },
        c: {
          event: EventTypes.ExtensionPointUpdate,
          data: { name: 'TestExtension2', prop: 'new-prop' },
        },
      };
      const expectedMarble = 'ab';
      const expectedValues = {
        a: { data: { name: 'TestExtension1' }, event: EventTypes.ExtensionPointMount },
        b: { data: { name: 'TestExtension2' }, event: EventTypes.ExtensionPointUnmount },
        c: {
          event: EventTypes.ExtensionPointUpdate,
          data: { name: 'TestExtension2', prop: 'new-prop' },
        },
      };

      const uiEventsInput$ = cold(eventsMarble, uiEventValues).pipe(
        tap(ev => uiEvents.next(ev)),
        withLatestFrom(uiEvents$),
        map(([, uiEvents]) => uiEvents),
      );

      expectObservable(uiEventsInput$).toBe(expectedMarble, expectedValues);
    });
  });
  test('single-spa event subscriptions', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    scheduler.run(({ expectObservable, cold }) => {
      const eventValues = {
        a: {
          event: 'single-spa:before-first-mount',
          detail: {},
        },
        b: {
          event: 'single-spa:before-mount-routing-event',
          detail: {},
        },
        c: {
          event: 'single-spa:routing-event',
          detail: {},
        },
        d: {
          event: 'single-spa:first-mount',
          detail: {},
        },
        e: {
          event: 'single-spa:before-routing-event',
          detail: {},
        },
      };

      const evMarbles = '     -a-bcd-e';
      const expectedMarble = '-a-bcd-e';

      const ev$ = cold(evMarbles, eventValues).pipe(
        tap(ev => dispatchEvent(new CustomEvent(ev.event, { detail: ev.detail }))),
      );

      const input$ = ev$.pipe(
        withLatestFrom(singleSpaEvents$),
        map(([, spaEvent]) => spaEvent),
      );

      expectObservable(input$).toBe(expectedMarble, {
        a: {},
        b: { spaEvents: { eventName: eventValues.b.event, detail: eventValues.b.detail } },
        c: { spaEvents: { eventName: eventValues.c.event, detail: eventValues.c.detail } },
        d: {},
        e: { name: null },
      });
    });
  });
  test('globalChannel subscriptions', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    scheduler.run(({ expectObservable, cold }) => {
      const eventValues = {
        a: { event: APP_EVENTS.INFO_READY, data: {} },
        b: { event: AUTH_EVENTS.READY, data: { ethAddress: '0x0123' } },
      };
      const globalChannelInput$ = cold('ab', eventValues).pipe(
        tap(ev => globalChannel.next(ev)),
        withLatestFrom(globalChannelEvents$),
        map(([, mappedEvent]) => mappedEvent),
      );
      expectObservable(globalChannelInput$).toBe('ab', {
        a: { ...eventValues.a, data: {} },
        b: { user: { ...eventValues.b.data, waitForAuth: false } },
      });
    });
  });
});
