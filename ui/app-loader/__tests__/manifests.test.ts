import getSDK from '@akashaproject/awf-sdk';
import { mockSDK, genWorldConfig } from '@akashaproject/af-testing';
import { map, mergeMap, Observable, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getStateSlice, initState, LoaderState } from '../src/state';
import { getDefaultIntegrationManifests, getUserIntegrationManifests } from '../src/manifests';
import { ILoaderConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { pipelineEvents } from '../src/events';

jest.mock('@akashaproject/awf-sdk', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { of } = require('rxjs');
  return () =>
    mockSDK({
      icRegistry: {
        getLatestReleaseInfo: jest.fn((relInfos: { name: string }[]) =>
          of({
            data: {
              getLatestRelease: relInfos.map(info => ({ name: info.name, version: '1.0.0' })),
            },
          }),
        ),
      },
      appSettings: {
        getAll: () =>
          of({
            data: [
              {
                name: '@akashaproject/user-installed-test-app',
                version: '1.0.0',
              },
              {
                name: '@akashaproject/user-installed-test-widget',
                version: '1.0.0',
              },
            ],
          }),
      },
    });
});

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
  test('getDefaultIntegrationManifests', () => {
    const marbles = 'ab';
    const values = {
      a: genWorldConfig({
        defaultApps: ['@akashaproject/test-app'],
      }),
      b: genWorldConfig({
        defaultWidgets: ['@akashaproject/test-widget'],
      }),
    };
    scheduler.run(({ expectObservable, cold }) => {
      const source$ = cold(marbles, values).pipe(
        mergeMap(worldConf => {
          return getDefaultIntegrationManifests(
            worldConf as ILoaderConfig,
            getSDK().services.log.create(),
          );
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
              name: '@akashaproject/test-app',
              version: '1.0.0',
            },
          ],
        },
        b: {
          manifests: [
            { name: values.a.layout, version: '1.0.0' },
            { name: values.a.homepageApp, version: '1.0.0' },
            {
              name: '@akashaproject/test-widget',
              version: '1.0.0',
            },
          ],
        },
      });
    });
  });

  test('getUserIntegrationManifests', () => {
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
              name: '@akashaproject/user-installed-test-app',
              version: '1.0.0',
            },
            {
              name: '@akashaproject/user-installed-test-widget',
              version: '1.0.0',
            },
          ],
        },
      });
    });
  });
});
