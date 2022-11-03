import { Logger } from '@akashaorg/awf-sdk';
import { EventTypes, ILoaderConfig, INTEGRATION_TYPES } from '@akashaorg/typings/ui';
import { combineLatest, filter, Observable, tap, withLatestFrom } from 'rxjs';
import { getStateSlice, LoaderState } from './state';
import * as singleSpa from 'single-spa';
import { uiEvents } from './events';

export const handleAppLoadingScreens = (
  worldConfig: ILoaderConfig,
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
        const { user, manifests } = combined;
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
            const config = combined.integrationConfigs.get(homeApp);
            if (config) {
              const { navigateTo } = combined.plugins['@akashaorg/app-routing']?.routing as {
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
