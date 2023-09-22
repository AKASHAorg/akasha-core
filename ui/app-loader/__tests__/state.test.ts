import { map, Observable, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { pipelineEvents } from '../src/events';
import { defaultInitialState, initState, LoaderState } from '../src/state';

describe('[AppLoader] state.ts', () => {
  let state: Observable<LoaderState>;
  let globalChannel: ReplaySubject<any>;
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
      a: defaultInitialState,
      b: { ...defaultInitialState, manifests: [{ name: 'TestExtension1' }] },
      c: {
        ...defaultInitialState,
        manifests: [{ name: 'TestExtension1' }],
        user: { ethAddress: '0x00' },
      },
      d: {
        ...defaultInitialState,
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
