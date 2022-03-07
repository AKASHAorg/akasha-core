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
      if (!resp.data) {
        throw new Error(`Error loading integrations from registry ${resp}`);
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
  const remoteInterations = remote$
    .pipe(
      map(name => ({ name })),
      toArray(),
    )
    .pipe(mergeMap(getLatestReleaseInfo))
    .pipe(mergeMap(from), toArray());

  //get package info from local registry (overrides)
  const localIntegrations = local$
    .pipe(map(name => worldConfig.registryOverrides.find(int => int.name === name)))
    .pipe(toArray());

  return forkJoin([remoteInterations, localIntegrations]).pipe(
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
        pipelineEvents.next({
          manifests: [...manifests, ...userManifests],
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
