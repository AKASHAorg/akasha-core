import { from, mergeMap, of, ReplaySubject } from 'rxjs';
import * as singleSpa from 'single-spa';
import getSDK from '@akashaorg/awf-sdk';
import { genAppConfig, genWorldConfig } from '@akashaorg/af-testing';
import { EventTypes, UIEventData, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { extensionMatcher } from '../src/extension-matcher';

jest.mock('single-spa', () => {
  const orig = jest.requireActual('single-spa');
  const mountRootParcelMock = jest.requireMock('@akashaorg/af-testing').mountRootParcelMock;
  return {
    ...orig,
    mountRootParcel: mountRootParcelMock,
  };
});

describe('[AppLoader]: extension-matcher.ts', () => {
  const sdk = getSDK();
  const logger = sdk.services.log.create();
  const uiEvents = new ReplaySubject<UIEventData>();
  const globalChannel = new ReplaySubject();

  test('should call load', done => {
    const spies = [jest.fn(), jest.fn(), jest.fn()];

    const event1Name = 'ext-mount-point_bafrydfea124';
    const event2Name = 'ext-mount-point-1-topbar';
    const event3Name = 'ext-mount-point';

    const vals = [
      { event: EventTypes.ExtensionPointMount, data: { name: event1Name } },
      { event: EventTypes.ExtensionPointMount, data: { name: event2Name } },
      { event: EventTypes.ExtensionPointMount, data: { name: event3Name } },
    ];

    const apps = [
      genAppConfig({ name: 'app1' }, ['ext-mount-point*', jest.fn()]),
      genAppConfig({ name: 'app2' }, ['ext-mount-point-1*', jest.fn()]),
      genAppConfig({ name: 'app3' }, ['ext-mount-point', jest.fn()]),
    ];

    const mockExtLoaders = spies.map(spy =>
      jest.fn().mockImplementation(() => ({
        load: spy,
        unmount: jest.fn(),
        update: jest.fn(),
      })),
    );

    for (const [idx, app] of apps.entries()) {
      const extProps: Omit<RootExtensionProps, 'extensionData' | 'domElement' | 'uiEvents'> = {
        layoutConfig: genAppConfig({ extensions: {} }).extensions,
        logger,
        singleSpa,
        navigateToModal: jest.fn(),
        parseQueryString: jest.fn(),
        worldConfig: genWorldConfig(),
      };

      app.extends(extensionMatcher(uiEvents, globalChannel, extProps, app), mockExtLoaders[idx]);
    }
    const source$ = from(vals);
    source$
      .pipe(
        mergeMap(eventData => {
          uiEvents.next(eventData);
          return of(eventData);
        }),
      )
      .subscribe({
        complete() {
          for (const extLoader of mockExtLoaders) {
            expect(extLoader).toHaveBeenCalledTimes(1);
          }
          for (const [idx, ev] of vals.entries()) {
            if (ev.data.name === event1Name) {
              expect(spies[idx]).toHaveBeenCalledTimes(3);
            }
            if (ev.data.name === event2Name) {
              expect(spies[idx]).toHaveBeenCalledTimes(1);
            }
            if (ev.data.name === event3Name) {
              expect(spies[idx]).toHaveBeenCalledTimes(1);
            }
          }
          done();
        },
      });
  });
});
