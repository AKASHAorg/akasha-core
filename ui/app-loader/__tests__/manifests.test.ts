import { map, mergeMap, Observable, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import getSDK from '@akashaorg/awf-sdk';
import { genWorldConfig } from '@akashaorg/af-testing';
import { pipelineEvents } from '../src/events';
import { getDefaultIntegrationManifests, getUserIntegrationManifests } from '../src/manifests';
import { getStateSlice, initState, LoaderState } from '../src/state';

describe('[AppLoader]: manifests.ts', () => {
  const globalChannel = new ReplaySubject();
  let state$: Observable<LoaderState>;
  let scheduler: TestScheduler;

  beforeEach(() => {
    state$ = initState(genWorldConfig(), globalChannel);
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  test.skip('getDefaultIntegrationManifests', () => {
    const marbles = 'ab';
    const values = {
      a: genWorldConfig({
        defaultApps: ['@akashaorg/test-app'],
      }),
      b: genWorldConfig({
        defaultWidgets: ['@akashaorg/test-widget'],
      }),
    };
    scheduler.run(({ expectObservable, cold }) => {
      const source$ = cold(marbles, values).pipe(
        mergeMap(worldConf => {
          return getDefaultIntegrationManifests(worldConf);
        }),
        withLatestFrom(state$.pipe(getStateSlice('manifests'))),
        map(([, manifests]) => ({ manifests })),
      );

      expectObservable(source$).toBe('ab', {
        a: {
          manifests: [
            { name: values.a.layout, version: '1.0.0' },
            { name: values.a.homepageApp, version: '1.0.0' },
            {
              name: '@akashaorg/test-app',
              version: '1.0.0',
            },
          ],
        },
        b: {
          manifests: [
            { name: values.a.layout, version: '1.0.0' },
            { name: values.a.homepageApp, version: '1.0.0' },
            {
              name: '@akashaorg/test-widget',
              version: '1.0.0',
            },
          ],
        },
      });
    });
  });

  test.skip('getUserIntegrationManifests', () => {
    const marbles = 'a';
    const values = {
      a: {
        user: { ethAddress: '0x123', waitForAuth: false },
        worldConfig: genWorldConfig(),
      },
    };
    scheduler.run(({ expectObservable, cold }) => {
      const source$ = cold(marbles, values).pipe(
        tap({
          next({ user }) {
            pipelineEvents.next({ user });
          },
        }),
        mergeMap(({ worldConfig }) => {
          return getUserIntegrationManifests(worldConfig, state$, getSDK().services.log.create());
        }),
        withLatestFrom(state$.pipe(getStateSlice('manifests'))),
        map(([, manifests]) => ({ manifests })),
      );

      expectObservable(source$).toBe('a', {
        a: {
          manifests: [
            {
              name: '@akashaorg/user-installed-test-app',
              version: '1.0.0',
            },
            {
              name: '@akashaorg/user-installed-test-widget',
              version: '1.0.0',
            },
          ],
        },
      });
    });
  });
});
