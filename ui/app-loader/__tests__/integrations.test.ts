import { genWorldConfig, mockSDK } from '@akashaproject/ui-awf-testing-utils';
import { TestScheduler } from 'rxjs/testing';
import { handleIntegrationUninstall, systemImport } from '../src/integrations';
import getSDK from '@akashaproject/awf-sdk';
import { concatMap, map, mergeMap, Observable, of, ReplaySubject, withLatestFrom } from 'rxjs';
import { initState, LoaderState } from '../src/state';
import { pipelineEvents } from '../src/events';
import * as singleSpa from 'single-spa';

jest.mock('single-spa', () => {
  let appNames = [];
  return {
    appNames: [],
    registerApplication: jest.fn(),
    getAppNames: jest.fn(() => appNames),
    setAppNames: names => {
      appNames = names;
    },
    unregisterApplication: jest.fn(() => Promise.resolve()),
    mountRootParcel: jest.fn((loadingFn, props) => {
      return {
        mountPromise: Promise.resolve({ ...props }),
        unmount: () => {
          //TODO:
        },
      };
    }),
  };
});

jest.mock('@akashaproject/awf-sdk', () => {
  return () => mockSDK();
});

describe('[AppLoader] integrations', () => {
  let scheduler: TestScheduler;
  const sdk = getSDK();
  const logger = sdk.services.log.create();
  const globalChannel = new ReplaySubject();
  const worldConfig = genWorldConfig();
  let state$: Observable<LoaderState>;
  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toStrictEqual(expected);
    });
    state$ = initState(worldConfig, globalChannel);
  });
  test('systemImport call', done => {
    const dummyManifest = {
      name: '@akashaproject/test-app',
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
});
