import { genWorldConfig, mockSDK, genAppConfig } from '@akashaproject/tests';
import { TestScheduler } from 'rxjs/testing';
import {
  extractExtensionsFromApps,
  handleExtPointMountOfApps,
  handleIntegrationUninstall,
  systemImport,
} from '../src/integrations';
import getSDK from '@akashaproject/awf-sdk';
import { concatMap, map, mergeMap, Observable, of, ReplaySubject, tap, withLatestFrom } from 'rxjs';
import { initState, LoaderState } from '../src/state';
import { pipelineEvents } from '../src/events';
import * as singleSpa from 'single-spa';
import { IAppConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

jest.mock('@akashaproject/awf-sdk', () => {
  return () => mockSDK();
});

jest.mock('single-spa', () => {
  const getSingleSpaInstanceMock =
    jest.requireActual('@akashaproject/tests').getSingleSpaInstanceMock;

  return getSingleSpaInstanceMock();
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
    jest.unmock('@akashaproject/awf-sdk');
  });
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
  test('extract extensions from apps', () => {
    const marbles = 'ab-b-ba';

    const values: { [key: string]: IAppConfig & { name: string } } = {
      a: genAppConfig({ name: '@test/test-app-1' }),
      b: genAppConfig({ name: '@test/test-app-2' }),
    };

    const stateVal = {
      extensionsByParent: new Map(),
      extensionsByMountPoint: new Map(),
    };

    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold(marbles, values);
      const input$ = source$.pipe(
        tap(() => pipelineEvents.next(stateVal)),
        withLatestFrom(state$),
        mergeMap(([conf, newState]) => extractExtensionsFromApps(conf, of(newState), logger)),
      );
      expectObservable(input$).toBe('ab-b-ba', {
        a: {
          extensionsByMountPoint: new Map().set(
            values.a.extends[0].mountsIn,
            values.a.extends.map(ext => ({ ...ext, parent: values.a.name })),
          ),
          extensionsByParent: new Map().set(values.a.name, values.a.extends),
        },
        b: {
          extensionsByMountPoint: new Map().set(
            values.b.extends[0].mountsIn,
            values.b.extends.map(ext => ({ ...ext, parent: values.b.name })),
          ),
          extensionsByParent: new Map().set(values.b.name, values.b.extends),
        },
      });
    });
  });
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
