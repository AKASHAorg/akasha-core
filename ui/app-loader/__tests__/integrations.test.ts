import { mockSDK } from '@akashaproject/ui-awf-testing-utils';
import { TestScheduler } from 'rxjs/testing';
import { systemImport } from '../src/integrations';
import getSDK from '@akashaproject/awf-sdk';
import { concatMap, from, map, mergeMap, of, tap, toArray, withLatestFrom } from 'rxjs';

(global as any).System = {
  import: jest.fn(() =>
    Promise.resolve({
      register: jest.fn(),
      getPlugin: jest.fn(),
    }),
  ),
};
jest.mock('@akashaproject/awf-sdk', () => {
  return () => mockSDK();
});

describe('[AppLoader] integrations', () => {
  let scheduler: TestScheduler;
  const sdk = getSDK();
  const logger = sdk.services.log.create();
  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toStrictEqual(expected);
    });
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
  test('extractExtensionsFromApps', () => {
    //
  });
  test('extractMenuItemsFromApps', () => {
    //
  });
  test('processSystemModules', () => {
    //
  });
  test('handleExtPointMountOfApps', () => {
    //
  });
  test('handleIntegrationUninstall', () => {
    //
  });
  test('handleDisableIntegration', () => {
    //
  });
  test('handleEnableIntegration', () => {
    //
  });
});
