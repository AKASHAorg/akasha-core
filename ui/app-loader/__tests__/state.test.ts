import { mockSDK } from '@akashaproject/ui-awf-testing-utils';
import { map, Observable, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { pipelineEvents } from '../src/events';
import { initialState, initState } from '../src/state';

jest.mock('@akashaproject/awf-sdk', () => {
  return () => mockSDK();
});

describe('[AppLoader] state.ts', () => {
  let state;
  let globalChannel;
  const worldConfig = {
    defaultPlugins: [],
    defaultApps: [],
    defaultWidgets: [],
    layout: '@test/layout',
    homepageApp: '@test/homepageApp',
    title: 'Test World Title',
  };
  let scheduler;
  beforeAll(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toStrictEqual(expected);
    });
  });
  beforeEach(() => {
    globalChannel = new ReplaySubject();
    state = initState(worldConfig, globalChannel);
  });
  test('state should be initialized as an Observable', () => {
    expect(state).toBeInstanceOf(Observable);
  });
  test('should mutate through piplineEvents', () => {
    const marble = 'a-b-c-d';
    const expectedMarble = 'a-b-c-d';

    const values = {
      a: {},
      b: { manifests: [{ name: 'TestExtension1' }] },
      c: { user: { ethAddress: '0x00' } },
      d: { uninstallAppRequest: { name: 'installed-app-name' } },
    };

    const expectedValues = {
      a: initialState,
      b: { ...initialState, manifests: [{ name: 'TestExtension1' }] },
      c: { ...initialState, manifests: [{ name: 'TestExtension1' }], user: { ethAddress: '0x00' } },
      d: {
        ...initialState,
        manifests: [{ name: 'TestExtension1' }],
        user: { ethAddress: '0x00' },
        uninstallAppRequest: { name: 'installed-app-name' },
      },
    };
    scheduler.run(({ expectObservable, cold }) => {
      const input$ = cold(marble, values);
      const output$ = input$.pipe(
        tap(inputVal => {
          pipelineEvents.next(inputVal);
        }),
        withLatestFrom(state),
        map(([, state]) => state),
      );
      expectObservable(output$).toBe(expectedMarble, expectedValues);
    });
  });
});
