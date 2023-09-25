import * as singleSpa from 'single-spa';
import { concatMap, map, mergeMap, Observable, of, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { genAppConfig, genWorldConfig } from '@akashaorg/af-testing';
import {
  handleExtPointMountOfApps,
  handleIntegrationUninstall,
  systemImport,
} from '../src/integrations';
import getSDK from '@akashaorg/awf-sdk';
import { pipelineEvents } from '../src/events';
import { initState, LoaderState } from '../src/state';

jest.mock('single-spa', () => {
  const orig = jest.requireActual('single-spa');
  const getSingleSpaInstanceMock =
    jest.requireActual('@akashaorg/af-testing').getSingleSpaInstanceMock;

  return {
    ...orig,
    ...getSingleSpaInstanceMock(),
  };
});

describe('[AppLoader] integrations', () => {
  let scheduler: TestScheduler;
  const sdk = getSDK();
  const logger = sdk.services.log.create();
  const globalChannel = new ReplaySubject();
  const worldConfig = genWorldConfig();
  let state$: Observable<LoaderState>;
  afterAll(() => {
    jest.unmock('single-spa');
    jest.unmock('@akashaorg/awf-sdk');
  });
  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toStrictEqual(expected);
    });
    state$ = initState(worldConfig, globalChannel);
  });
  test('systemImport call', done => {
    const dummyManifest = {
      name: '@akashaorg/test-app',
      version: '1.0.0',
      sources: ['/test/source/path'],
      enabled: true,
      integrationType: 1,
    };
    of([dummyManifest])
      .pipe(concatMap(systemImport(logger)))
      .subscribe({
        next(moduleData) {
          expect(moduleData).toBeDefined();
          expect(moduleData).toHaveProperty('manifest', dummyManifest);
          expect(moduleData).toHaveProperty('module');
        },
        complete() {
          done();
        },
      });
  });
  test('handleIntegrationUninstall', done => {
    const testNames = ['@test/test-app-1', '@test/test-app-2', '@test/test-app-3'];
    const manifests = testNames.map(name => ({
      name,
      integrationType: 1,
      sources: [`${name}/index.js`],
    }));
    (singleSpa as any).setAppNames(testNames);
    scheduler.run(({ cold }) => {
      const marble = 'abc|';
      const values = {
        a: {
          uninstallAppRequest: { name: '@test/test-app-1' },
          manifests,
        },
        b: {
          uninstallAppRequest: { name: '@test/test-app-2' },
        },
        c: {
          uninstallAppRequest: { name: '@test/test-app-3' },
        },
      };

      cold(marble, values)
        .pipe(
          mergeMap(v => {
            pipelineEvents.next(v);
            return of(v);
          }),
          withLatestFrom(state$),
          map(([, state]) => state),
          mergeMap(newState => handleIntegrationUninstall(of(newState), logger)),
        )
        .subscribe({
          next(results) {
            expect(
              results.manifests.find(man => man.name === results.uninstalledApp.name),
            ).toBeUndefined();
          },
          complete() {
            done();
          },
        });
    });
  });
  // @Todo: rewrite this because it's obsolete
  test.skip('handleExtPointMountOfApps', () => {
    const marbles = 'a';
    const testAppConf = genAppConfig({ name: '@test/test-app-handleExtPointMountOfApps' });
    const testManifest = {
      name: testAppConf.name,
      version: '1.0.0',
      sources: ['/test/source/path'],
      integrationType: 1,
    };
    const values = {
      a: {
        mountedExtPoints: new Map().set(testAppConf.mountsIn, { name: testAppConf.mountsIn }),
        integrationsByMountPoint: new Map().set(testAppConf.mountsIn, [testAppConf]),
        manifests: [testManifest],
        layoutConfig: genAppConfig({ extensions: {} }),
      },
    };
    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold(marbles, values);
      const input$ = source$.pipe(
        tap(val => pipelineEvents.next(val)),
        withLatestFrom(state$),
        mergeMap(([, newstate]) => {
          return handleExtPointMountOfApps(worldConfig, of(newstate), logger);
        }),
      );
      // asert the data in the handleExtPointMountOfApps' last tap() operator, not in the state
      expectObservable(input$).toBe('a', {
        a: {
          activeModal: { name: null },
          data: {
            config: testAppConf,
            extData: { name: testAppConf.mountsIn },
          },
          integrationConfigs: new Map(),
          manifests: [testManifest],
          plugins: {},
          layoutConfig: {
            extensions: {},
          },
        },
      });
    });
  });
});
