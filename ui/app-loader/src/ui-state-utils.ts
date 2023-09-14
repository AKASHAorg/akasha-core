import { Logger } from '@akashaorg/awf-sdk';
import type { WorldConfig } from '@akashaorg/typings/lib/ui';
import { EventTypes, INTEGRATION_TYPES } from '@akashaorg/typings/lib/ui';
import { combineLatest, filter, Observable, tap, withLatestFrom } from 'rxjs';
import { getStateSlice, LoaderState } from './state';
import * as singleSpa from 'single-spa';
import { uiEvents } from './events';

export const handleAppLoadingScreens = (
  worldConfig: WorldConfig,
  state$: Observable<LoaderState>,
  _logger: Logger,
) => {
  return state$
    .pipe(getStateSlice('spaEvents'))
    .pipe(filter(data => data?.eventName === 'single-spa:routing-event'))
    .pipe(
      withLatestFrom(
        combineLatest({
          manifests: state$.pipe(getStateSlice('manifests')),
          user: state$.pipe(getStateSlice('user')),
          integrationConfigs: state$.pipe(getStateSlice('integrationConfigs')),
          plugins: state$.pipe(getStateSlice('plugins')),
        }),
      ),
      tap(([, combined]) => {
        const { user, manifests, integrationConfigs, plugins } = combined;
        const defaultWidgets = worldConfig.defaultWidgets;
        const layout = worldConfig.layout;
        // const eventDetail = event.detail;
        const mountedApps = singleSpa
          .getMountedApps()
          .filter(
            name =>
              !defaultWidgets.includes(name) &&
              name !== layout &&
              !manifests.some(
                manifest =>
                  manifest.name === name &&
                  manifest.integrationType !== INTEGRATION_TYPES.APPLICATION,
              ),
          );
        if (!mountedApps.length) {
          if (location.pathname === '/') {
            const homeApp = worldConfig.homepageApp;
            const config = integrationConfigs.get(homeApp);
            if (config) {
              const { navigateTo } = plugins['@akashaorg/app-routing']?.routing as {
                navigateTo: (opts: unknown) => void;
              };
              navigateTo({
                appName: homeApp,
              });
            }
            return;
          }
          if (user.waitForAuth) {
            uiEvents.next({
              event: EventTypes.LayoutShowLoadingUser,
            });
          } else {
            uiEvents.next({
              event: EventTypes.LayoutShowAppLoading,
            });
          }
        }
      }),
    );
};
