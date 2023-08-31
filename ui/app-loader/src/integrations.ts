import type {
  RootComponentProps,
  RootExtensionProps,
  IAppConfig,
  WorldConfig,
  EventDataTypes,
} from '@akashaorg/typings/ui';
import { EventTypes } from '@akashaorg/typings/ui';
import { IntegrationReleaseInfoFragmentFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import {
  Observable,
  mergeMap,
  from,
  filter,
  combineLatest,
  of,
  tap,
  map,
  withLatestFrom,
  combineLatestAll,
  mergeAll,
  pairwise,
  combineLatestWith,
  catchError,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { LoaderState, getStateSlice } from './state';
import {
  checkActivityFn,
  encodeName,
  decodeName,
  getDomElement,
  navigateToModal,
  parseQueryString,
} from './utils';
import * as singleSpa from 'single-spa';
import getSDK, { Logger } from '@akashaorg/awf-sdk';
import { getIntegrationsData } from './manifests';
import { loadI18nNamespaces } from './i18n-utils';
import { extensionMatcher } from './extension-matcher';
import { extensionLoader } from './extension-loader';

export const getMountPoint = (appConfig: IAppConfig) => {
  let mountPoint: string;
  if (appConfig.mountsIn && typeof appConfig.mountsIn === 'string') {
    mountPoint = appConfig.mountsIn;
  }
  /*
   * Not used for now.
   * We'll probably need this in the future.
   */
  if (appConfig.mountsIn && typeof appConfig.mountsIn === 'function') {
    // mountPoint = appConfig.mountsIn(appConfig);
  }
  return mountPoint;
};

// exported for testing purposes
export const systemImport =
  (logger: Logger) => (manifests: IntegrationReleaseInfoFragmentFragment[]) => {
    return from(manifests).pipe(
      filter(manifest => (manifest.hasOwnProperty('enabled') ? manifest.enabled : true)),
      mergeMap(manifest => {
        if (manifest.sources.length === 0) {
          logger.warn(`No source path was found for integration ${manifest.name}. Skipping!`);
          return;
        }
        const source = manifest.sources[0];
        if (manifest.sources.length > 1) {
          logger.info(`Multiple sources found for integration ${manifest.name}. Using ${source}`);
        }
        return from(System.import(source)).pipe(map(module => ({ manifest, module })));
      }),
      catchError(err => {
        logger.error(
          `[integrations]: processSystemModules: ${err.message ?? JSON.stringify(err)} ${
            err.stack
          }`,
        );
        throw err;
      }),
    );
  };

/*
 * Get the integration manifest and import the source
 * store the resulting integrationConfig in state
 */
export const importIntegrationModules = (state$: Observable<LoaderState>, logger: Logger) => {
  return state$.pipe(getStateSlice('manifests')).pipe(
    mergeMap(systemImport(logger)),
    withLatestFrom(state$.pipe(getStateSlice('modules'))),
    tap(([imported, modules]) => {
      const importedModules = new Map();
      if (!modules.has(imported.manifest.name)) {
        importedModules.set(imported.manifest.name, imported.module);
        pipelineEvents.next({
          modules: new Map([...importedModules, ...modules]),
        });
      }
    }),
    catchError(err => {
      logger.error(
        `[integrations]: importIntegrations: ${err.message ?? JSON.stringify(err)} ${err.stack}`,
      );
      throw err;
    }),
  );
};

export const processSystemModules = (
  worldConfig: WorldConfig,
  state$: Observable<LoaderState>,
  logger: Logger,
) => {
  const globalChannel = getSDK().api.globalChannel;
  const layoutConfig$ = state$.pipe(getStateSlice('layoutConfig'));
  const modules$ = state$.pipe(getStateSlice('modules'));
  const integrationConfigs$ = state$.pipe(getStateSlice('integrationConfigs'));
  const integrationsByMountPoint$ = state$.pipe(getStateSlice('integrationsByMountPoint'));
  const manifests$ = state$.pipe(getStateSlice('manifests'));
  const plugins$ = state$.pipe(getStateSlice('plugins'));

  return modules$
    .pipe(
      combineLatestWith(layoutConfig$),
      withLatestFrom(integrationConfigs$, integrationsByMountPoint$, manifests$, plugins$),
      map(
        ([
          [modules, layoutConfig],
          integrationConfigs,
          integrationsByMountPoint,
          manifests,
          plugins,
        ]) => ({
          modules,
          layoutConfig,
          integrationConfigs,
          integrationsByMountPoint,
          manifests,
          plugins,
        }),
      ),
    )
    .pipe(filter(({ layoutConfig }) => !!layoutConfig))
    .pipe(
      mergeMap(results => {
        const { layoutConfig, modules, integrationConfigs, integrationsByMountPoint } = results;

        const registrationProps = {
          layoutConfig: layoutConfig.extensions,
          worldConfig,
          logger,
          uiEvents,
        };
        return from(modules)
          .pipe(filter(([name]) => !integrationConfigs.has(name)))
          .pipe(
            map(async ([moduleName, mod]) => {
              let appConf: IAppConfig;

              if (mod?.register && typeof mod.register === 'function') {
                appConf = await Promise.resolve(mod.register(registrationProps));
                // each app must have menuItems exposed in config, widgets do not
                uiEvents.next({
                  event: EventTypes.RegisterIntegration,
                  data: {
                    name: moduleName,
                    menuItems: appConf?.menuItems,
                    navRoutes: appConf?.routes,
                  },
                });
                console.log(appConf, '<<< app conf');
                if (appConf?.editorBlocks)
                  uiEvents.next({
                    event: EventTypes.RegisterEditorBlock,
                    data: appConf.editorBlocks,
                  });
              }
              return {
                ...appConf,
                name: moduleName,
              };
            }),
          )
          .pipe(
            combineLatestAll(),
            map(configs => ({
              configs,
              integrationConfigs,
              integrationsByMountPoint,
              layoutConfig,
            })),
          );
      }),
    )
    .pipe(
      withLatestFrom(state$.pipe(getStateSlice('plugins'))),
      mergeMap(([results, plugins]) => {
        const { configs, layoutConfig } = results;
        for (const config of configs) {
          if (!config.extends || typeof config.extends !== 'function') {
            continue;
          }
          const extProps: Omit<
            RootExtensionProps,
            'uiEvents' | 'extensionData' | 'domElement' | 'baseRouteName'
          > = {
            layoutConfig: layoutConfig.extensions,
            logger,
            singleSpa,
            navigateToModal,
            worldConfig,
            parseQueryString,
            plugins,
            encodeAppName: encodeName,
            decodeAppName: decodeName,
          };

          const extMatcher = extensionMatcher(uiEvents, globalChannel, extProps, config);

          config.extends(extMatcher, extensionLoader);
        }
        return of({ results });
      }),
    )
    .pipe(
      tap(({ results }) => {
        const { configs, integrationConfigs, integrationsByMountPoint } = results;
        const byMount = new Map(integrationsByMountPoint);
        const intConfigs = new Map(integrationConfigs);
        configs.forEach(config => {
          if (intConfigs.has(config.name)) {
            return;
          }

          intConfigs.set(config.name, config);
          if (byMount.has(config.mountsIn)) {
            byMount.set(config.mountsIn, byMount.get(config.mountsIn).concat(config));
          } else {
            byMount.set(config.mountsIn, [config]);
          }
        });
        if (integrationConfigs.size !== intConfigs.size) {
          pipelineEvents.next({
            integrationConfigs: intConfigs,
            integrationsByMountPoint: byMount,
          });
        }
      }),
      catchError(err => {
        logger.error(
          `[integrations]: processSystemModules: ${err.message ?? JSON.stringify(err)} ${
            err.stack
          }`,
        );
        throw err;
      }),
    );
};

export const handleExtPointMountOfApps = (
  worldConfig: WorldConfig,
  state$: Observable<LoaderState>,
  logger: Logger,
) => {
  const sdk = getSDK();
  const mountedExtPoints$ = state$.pipe(getStateSlice('mountedExtPoints'));
  const integrationsByMountPoint$ = state$.pipe(getStateSlice('integrationsByMountPoint'));

  return combineLatest({
    mountedExtPoints: mountedExtPoints$,
    integrationsByMountPoint: integrationsByMountPoint$,
  })
    .pipe(
      filter(({ mountedExtPoints }) => mountedExtPoints.size > 0),
      pairwise(),
      map(([prevMounted, nextMounted]) => {
        const {
          mountedExtPoints: prevMountedExtPoints,
          integrationsByMountPoint: prevIntegrations,
        } = prevMounted;
        const { mountedExtPoints, integrationsByMountPoint } = nextMounted;
        // pairwise skips the first emitted value
        if (prevMountedExtPoints.size === 1) {
          return {
            mountedExtPoints,
            integrationsByMountPoint,
          };
        }

        const unique = Array.from(mountedExtPoints).filter(([name]) => {
          const _prevIntegrationsCount = prevIntegrations.get(name)?.length || 0;
          const _nextIntegrationsCount = integrationsByMountPoint.get(name)?.length || 0;

          return !(
            prevMountedExtPoints.has(name) && _prevIntegrationsCount === _nextIntegrationsCount
          );
        });
        return {
          mountedExtPoints: new Map(unique),
          integrationsByMountPoint,
        };
      }),
      map(({ mountedExtPoints, integrationsByMountPoint }) =>
        from(mountedExtPoints).pipe(
          map(([, data]) => ({
            extData: data,
            integrations: integrationsByMountPoint.get(data.name),
          })),
          filter(({ integrations }) => !!integrations),
        ),
      ),
      mergeAll(),
      map(({ extData, integrations }) =>
        from(integrations).pipe(map(config => ({ config, extData }))),
      ),
      mergeAll(),
      filter(({ config }) => !singleSpa.getAppNames().includes(config.name)),
      withLatestFrom(
        state$.pipe(getStateSlice('manifests')),
        state$.pipe(getStateSlice('layoutConfig')),
        state$.pipe(getStateSlice('integrationConfigs')),
        state$.pipe(getStateSlice('plugins')),
        state$.pipe(getStateSlice('modules')),
      ),
    )
    .pipe(
      mergeMap(([data, manifests, layoutConfig, integrationConfigs, plugins, modules]) =>
        from(loadI18nNamespaces(plugins, data.config.i18nNamespace)).pipe(
          map(() => ({
            data,
            manifests,
            layoutConfig,
            integrationConfigs,
            plugins,
            modules,
          })),
        ),
      ),
      tap(results => {
        const {
          data: { config },
          layoutConfig,
          integrationConfigs,
        } = results;
        const { manifests, plugins, modules } = results;
        const manifest = manifests.find(m => m.name === config.name);

        logger.info(`Registering app ${config.name}`);

        const domElement = getDomElement(config, manifest.name, logger);

        if (!domElement) {
          logger.info(`${config.name} - no dom element found, skipping registration`);
          return;
        }
        singleSpa.registerApplication<
          Omit<RootComponentProps, 'singleSpa' | 'mountParcel' | 'domElement'> & {
            domElementGetter?: () => HTMLElement;
          }
        >({
          name: manifest.name,
          app: config.loadingFn,
          activeWhen: location =>
            checkActivityFn({
              config,
              encodedAppName: encodeName(manifest.name),
              manifest,
              location,
            }),
          customProps: {
            plugins,
            name: manifest.name,
            baseRouteName: `/${encodeName(manifest.name)}`,
            parseQueryString: parseQueryString,
            worldConfig: worldConfig,
            uiEvents: uiEvents,
            layoutConfig: layoutConfig.extensions,
            logger: sdk.services.log.create(manifest.name),
            domElementGetter: () => domElement,
            navigateToModal: navigateToModal,
            getAppRoutes: appName => integrationConfigs.get(appName).routes,
            encodeAppName: encodeName,
            decodeAppName: decodeName,
          },
        });
        const intModule = modules.get(config.name);
        if (intModule.initialize && typeof intModule.initialize === 'function') {
          Promise.resolve(
            intModule.initialize({
              uiEvents,
              plugins,
              worldConfig,
              layoutConfig: results.layoutConfig.extensions,
              logger: sdk.services.log.create(`${manifest.name}/initFn`),
            }),
          );
        }
      }),
      catchError(err => {
        logger.error(
          `[integrations]: Error mounting app: ${err.message ?? JSON.stringify(err)}, ${err.stack}`,
        );
        throw err;
      }),
    );
};

export const handleIntegrationUninstall = (state$: Observable<LoaderState>, logger: Logger) => {
  const uninstallRequest$ = state$.pipe(getStateSlice('uninstallAppRequest'));
  return uninstallRequest$
    .pipe(
      filter(Boolean),
      mergeMap(async uninstallApp => {
        if (singleSpa.getAppNames().includes(uninstallApp.name)) {
          try {
            await singleSpa.unregisterApplication(uninstallApp.name);
            return uninstallApp;
          } catch (err) {
            logger.warn(`Uninstall failed for ${uninstallApp.name}`);
            logger.warn(err);
            return uninstallApp;
          }
        }
        logger.warn(`No application registered as ${uninstallApp.name}`);
        return null;
      }),
      filter(Boolean),
      withLatestFrom(state$.pipe(getStateSlice('integrationConfigs'))),
      map(([uninstalledApp, integrationConfigs]) => ({
        uninstalledApp,
        integrationConfigs,
      })),
    )
    .pipe(
      mergeMap(props => {
        const { integrationConfigs, uninstalledApp } = props;
        return of({
          uninstalledApp,
          integrationConfigs,
        });
      }),
    )
    .pipe(
      withLatestFrom(
        state$.pipe(getStateSlice('integrationsByMountPoint')),
        state$.pipe(getStateSlice('modules')),
        state$.pipe(getStateSlice('manifests')),
      ),
      map(([res, integrationsByMountPoint, modules, manifests]) => ({
        ...res,
        integrationsByMountPoint,
        modules,
        manifests,
      })),
      map(results => {
        const { uninstalledApp, integrationConfigs, integrationsByMountPoint } = results;
        const intByMountPoint = new Map(
          Array.from(integrationsByMountPoint).map(([name, integrations]) => {
            const _integrations = integrations.filter(i => i.name !== uninstalledApp.name);
            return [name, _integrations];
          }),
        );
        const modules = new Map(
          Array.from(results.modules).filter(([name]) => name !== uninstalledApp.name),
        );

        const intConfigs = new Map(integrationConfigs);
        intConfigs.delete(uninstalledApp.name);

        const manifests = results.manifests.filter(manifest => {
          return manifest.name !== uninstalledApp.name;
        });
        return {
          uninstalledApp,
          integrationsByMountPoint: intByMountPoint,
          integrationConfigs: intConfigs,
          modules,
          manifests,
        };
      }),
      tap(results => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { uninstalledApp, ...rest } = results;
        pipelineEvents.next({
          ...rest,
          uninstallAppRequest: null,
        });
      }),
      catchError(err => {
        logger.error(
          `[integrations]: handleIntegrationUninstall: ${err.message ?? JSON.stringify(err)}, ${
            err.stack
          }`,
        );
        throw err;
      }),
    );
};

/**
 * Disable integration (by user)
 */
export const handleDisableIntegration = (
  worldConfig: WorldConfig,
  state$: Observable<LoaderState>,
) => {
  return state$
    .pipe(getStateSlice('disableIntegrationRequest'))
    .pipe(filter(Boolean))
    .pipe(mergeMap(intName => getIntegrationsData([intName], worldConfig)))
    .pipe(
      withLatestFrom(
        combineLatest({
          manifests: state$.pipe(getStateSlice('manifests')),
        }),
      ),
      tap(([disableIntegration, props]) => {
        if (!disableIntegration.length) {
          return;
        }

        const config = disableIntegration[0];
        const manifests = props.manifests.slice();
        const manifest = manifests.find(man => man.name === config.name);
        manifests.splice(manifests.indexOf(manifest), 1, { ...manifest, enabled: false });

        pipelineEvents.next({
          manifests,
        });
      }),
    );
};
/**
 * Enable integration (by user)
 * TODO:
 */
export const handleEnableIntegration = (state$: Observable<LoaderState>) => {
  return state$.pipe(getStateSlice('enableIntegrationRequest')).pipe(filter(Boolean));
};
