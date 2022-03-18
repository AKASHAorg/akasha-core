import getSDK from '@akashaproject/awf-sdk';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { BaseIntegrationInfo, ILoaderConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  Observable,
  mergeMap,
  tap,
  forkJoin,
  from,
  map,
  partition,
  toArray,
  catchError,
  switchMap,
  filter,
  withLatestFrom,
} from 'rxjs';
import { pipelineEvents } from './events';
import { getStateSlice, LoaderState } from './state';

export const getLatestReleaseInfo = (
  integrations: { name: string }[],
): Observable<BaseIntegrationInfo[]> => {
  const sdk = getSDK();
  return sdk.api.icRegistry.getLatestReleaseInfo(integrations).pipe(
    map(resp => {
      if (!resp) {
        throw new Error('[getLatestReleaseInfo] Response is missing');
      }
      if (!resp.data) {
        throw new Error(
          `[getLatestReleaseInfo] data property is missing in response: ${JSON.stringify(resp)}`,
        );
      }
      return resp.data.getLatestRelease;
    }),
    catchError(err => {
      throw new Error(err);
    }),
  );
};

export const getIntegrationsData = (integrationNames: string[], worldConfig: ILoaderConfig) => {
  const [local$, remote$] = partition(
    from(integrationNames),
    integrationName => !!worldConfig.registryOverrides.find(int => int.name === integrationName),
  );

  //get package info from remote registry
  const remoteIntegrations = remote$
    .pipe(
      map(name => ({ name })),
      toArray(),
    )
    .pipe(mergeMap(getLatestReleaseInfo));

  //get package info from local registry (overrides)
  const localIntegrations = local$
    .pipe(map(name => worldConfig.registryOverrides.find(int => int.name === name)))
    .pipe(toArray());

  return forkJoin([remoteIntegrations, localIntegrations]).pipe(
    map(([remote, local]) => [...remote, ...local]),
  );
};

/*
 * Get default integrations manifests from registry
 */
export const getDefaultIntegrationManifests = (worldConfig: ILoaderConfig, logger: ILogger) => {
  const defaultIntegrations = [
    worldConfig.layout,
    worldConfig.homepageApp,
    ...worldConfig.defaultApps,
    ...worldConfig.defaultWidgets,
  ];
  return getIntegrationsData(defaultIntegrations, worldConfig).pipe(
    tap(manifests => pipelineEvents.next({ manifests })),
    catchError(err => {
      logger.error(
        `[getDefaultIntegrationManifests]: Error fetching manifests ${err.message ?? err}`,
      );
      throw err;
    }),
  );
};

export const getUserIntegrationManifests = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  const sdk = getSDK();
  return state$
    .pipe(getStateSlice('user'))
    .pipe(filter(user => !!user.ethAddress))
    .pipe(
      switchMap(() => {
        return sdk.services.appSettings.getAll();
      }),
      mergeMap(userApps => {
        const userIntegrations = userApps.data.map(app => app.name);
        return getIntegrationsData(userIntegrations, worldConfig);
      }),
      withLatestFrom(state$.pipe(getStateSlice('manifests'))),
      tap(([userManifests, manifests]) => {
        // additional filtering.
        // use case: worldConfig update includes an app that was previously not defined as default
        const newManifests = userManifests.filter(man => !manifests.some(m => m.name === man.name));
        pipelineEvents.next({
          manifests: [...manifests, ...newManifests],
        });
      }),
    )
    .pipe(
      catchError(err => {
        logger.error(err);
        logger.error('[getUserIntegrations]: There was an error getting user integration infos');
        throw new Error(`Error loading integrations data`);
      }),
    );
};
