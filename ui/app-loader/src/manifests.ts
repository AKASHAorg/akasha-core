import getSDK, { Logger } from '@akashaorg/awf-sdk';
import { ILoaderConfig } from '@akashaorg/typings/ui';
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

export const getLatestReleaseInfo = async (integrations: { name: string }[]) => {
  const sdk = getSDK();
  const data = await sdk.api.icRegistry.getLatestReleaseInfo(integrations);
  return data.getLatestRelease;
};

export const getIntegrationsData = async (
  integrationNames: string[],
  worldConfig: ILoaderConfig,
) => {
  const remote = integrationNames.filter(integrationName => {
    return !worldConfig.registryOverrides.find(int => int.name === integrationName);
  });
  const local = integrationNames
    .filter(integrationName => {
      return !remote.includes(integrationName);
    })
    .map(e => worldConfig.registryOverrides.find(int => int.name === e));
  const remotes = await getLatestReleaseInfo(remote.map(e => ({ name: e })));
  return remotes.concat(local as any);
};

/*
 * Get default integrations manifests from registry
 */
export const getDefaultIntegrationManifests = async (
  worldConfig: ILoaderConfig,
  logger: Logger,
) => {
  const defaultIntegrations = [
    worldConfig.layout,
    worldConfig.homepageApp,
    ...worldConfig.defaultApps,
    ...worldConfig.defaultWidgets,
  ];
  return getIntegrationsData(defaultIntegrations, worldConfig).then(manifests => {
    pipelineEvents.next({ manifests });
  });
};

export const getUserIntegrationManifests = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: Logger,
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
