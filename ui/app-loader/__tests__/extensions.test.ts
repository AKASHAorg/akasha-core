import { genWorldConfig, mockSDK } from '@akashaproject/ui-awf-testing-utils';
import { initState, LoaderState } from '../src/state';
import { map, mergeMap, Observable, ReplaySubject, tap, toArray, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { pipelineEvents } from '../src/events';
import { mountMatchingExtensionParcels } from '../src/extensions';
import {
  genExtConfigs,
  genExtConfigsByMountPoint,
  genMountPoints,
} from '@akashaproject/ui-awf-testing-utils';
import getSDK from '@akashaproject/awf-sdk';

jest.mock('@akashaproject/awf-sdk', () => {
  return () => mockSDK();
});

jest.mock('single-spa', () => {
  const orig = jest.requireActual('single-spa');
  const mountRootParcelMock = jest.requireActual('./mocks/single-spa').mountRootParcelMock;
  return {
    ...orig,
    mountRootParcel: mountRootParcelMock,
  };
});

describe('[AppLoader]: extensions.ts', () => {
  let state$: Observable<LoaderState>;
  let scheduler;

  const globalChannel = new ReplaySubject();

  const worldConfig = genWorldConfig();
  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toStrictEqual(expected);
    });
    state$ = initState(worldConfig, globalChannel);
  });
  // currently failing because there is no dom element to mount to
  // TODO: use jsdom to create a dom element
  it.skip('should mount extensions as parcels when a matching extensionpoint is mounted', done => {
    const extConfigs = genExtConfigs();
    const marble = 'a|';
    const values = {
      a: {
        mountedExtPoints: genMountPoints(),
        extensionsByMountPoint: genExtConfigsByMountPoint(extConfigs),
        layoutConfig: {},
      },
    };

    scheduler.run(({ cold }) => {
      const source$ = cold(marble, values).pipe(
        tap({
          next(val) {
            pipelineEvents.next(val);
          },
        }),
        withLatestFrom(state$),
        mergeMap(([, newState]) => {
          return mountMatchingExtensionParcels({
            worldConfig,
            state: newState,
            logger: getSDK().services.log.create(),
          });
        }),
        toArray(),
        map(vals => ({ parcels: vals })),
      );
      source$.subscribe({
        next(v) {
          expect(Array.isArray(v.parcels)).toBe(true);
          expect(v.parcels.length).toBe(values.a.mountedExtPoints.size);
          v.parcels.forEach(pData => {
            expect(pData).toHaveProperty('mountPoint');
            expect(pData).toHaveProperty('extID');
            expect(pData).toHaveProperty('parent');
            expect(pData).toHaveProperty('parcel');
          });
        },
        complete() {
          done();
        },
      });
    });
  });
  it('should unmount parcels when their extensionPoint is unmounted', done => {
    done();
  });
});
