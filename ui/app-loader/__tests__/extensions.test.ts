import { map, mergeMap, Observable, ReplaySubject, of, toArray, withLatestFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import getSDK from '@akashaorg/awf-sdk';
import {
  genExtConfigs,
  genExtConfigsByMountPoint,
  genMountPoints,
  genWorldConfig,
  mockSDK,
} from '@akashaorg/af-testing';

import { pipelineEvents } from '../src/events';
import { initState, LoaderState } from '../src/state';
import { mountMatchingExtensionParcels } from '../src/extensions';

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK();
});

jest.mock('single-spa', () => {
  const orig = jest.requireActual('single-spa');
  const mountRootParcelMock = jest.requireMock('@akashaorg/af-testing').mountRootParcelMock;
  return {
    ...orig,
    mountRootParcel: mountRootParcelMock,
  };
});

describe('[AppLoader]: extensions.ts', () => {
  let scheduler: TestScheduler;
  let state$: Observable<LoaderState>;

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
  test('extension parcels are not mounted because there is no dom element to mount to', done => {
    const extConfigs = genExtConfigs();
    const marble = 'a|';
    const values = {
      a: {
        mountedExtPoints: genMountPoints(),
        extensionsByMountPoint: genExtConfigsByMountPoint(extConfigs),
        layoutConfig: {} as any,
      },
    };

    scheduler.run(({ cold }) => {
      const source$ = cold(marble, values).pipe(
        mergeMap(val => {
          pipelineEvents.next(val);
          return of(val);
        }),
        withLatestFrom(state$),
        map(([, state]) => state),
        mergeMap((newState: LoaderState) => {
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
          expect(v.parcels.length).toBe(0);
          // v.parcels.forEach(pData => {
          //   expect(pData).toHaveProperty('mountPoint');
          //   expect(pData).toHaveProperty('extID');
          //   expect(pData).toHaveProperty('parent');
          //   expect(pData).toHaveProperty('parcel');
          // });
        },
        complete() {
          done();
        },
      });
    });
  });
});
