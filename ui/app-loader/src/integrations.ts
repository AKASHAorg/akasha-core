import { ILogger } from '@akashaorg/sdk-typings/lib/interfaces/log';
import { RootComponentProps, RootExtensionProps } from '@akashaorg/ui-awf-typings';
import {
  BaseIntegrationInfo,
  EventTypes,
  IAppConfig,
  ILoaderConfig,
  PluginConf,
} from '@akashaorg/ui-awf-typings/lib/app-loader';
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
import { checkActivityFn, getDomElement, navigateToModal, parseQueryString } from './utils';
import * as singleSpa from 'single-spa';
import getSDK from '@akashaorg/awf-sdk';
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
export const systemImport = (logger: ILogger) => (manifests: BaseIntegrationInfo[]) => {
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
        `[integrations]: processSystemModules: ${err.message ?? JSON.stringify(err)} ${err.stack}`,
      );
      throw err;
    }),
  );
};

/*
 * Get the integration manifest and import the source
 * store the resulting integrationConfig in state
 */
export const importIntegrations = (state$: Observable<LoaderState>, logger: ILogger) => {
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
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
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
      // @TODO: load plugins exported from modules
      mergeMap(results => {
        const { modules, layoutConfig, integrationConfigs, integrationsByMountPoint } = results;

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
              let plugin: PluginConf;
              let appConf: IAppConfig;

              if (mod?.getPlugin && typeof mod.getPlugin === 'function') {
                plugin = await mod.getPlugin(registrationProps);
              }

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
              }
              return {
                plugin,
                ...appConf,
                name: moduleName,
              };
            }),
          )
          .pipe(
            combineLatestAll(),
            map(configs => ({
              configs,
              plugins: configs.reduce((acc, conf) => ({ ...acc, ...conf.plugin }), {}),
              integrationConfigs,
              integrationsByMountPoint,
              layoutConfig: results.layoutConfig,
            })),
          );
      }),
    )
    .pipe(
      mergeMap(results => {
        const { configs, layoutConfig } = results;
        for (const config of configs) {
          if (!config.extends) {
            continue;
          }
          const extProps: Omit<RootExtensionProps, 'uiEvents' | 'extensionData' | 'domElement'> = {
            layoutConfig: layoutConfig.extensions,
            logger,
            singleSpa,
            navigateToModal,
            worldConfig,
            parseQueryString,
            plugins: results.plugins,
          };
          config.extends(
            extensionMatcher(uiEvents, globalChannel, extProps, config),
            extensionLoader,
          );
        }
        return of(results);
      }),
    )
    .pipe(
      tap(result => {
        const { configs, integrationConfigs, integrationsByMountPoint, plugins } = result;
        const byMount = new Map(integrationsByMountPoint);
        const intConfigs = new Map(integrationConfigs);
        let appPlugins = Object.assign({}, plugins);
        configs.forEach(config => {
          if (intConfigs.has(config.name)) {
            return;
          }

          if (config.plugin) {
            appPlugins = Object.assign(appPlugins, config.plugin);
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
            plugins: appPlugins,
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
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  const sdk = getSDK();
  const mountedExtPoints$ = state$.pipe(getStateSlice('mountedExtPoints'));
  const integrationsByMountPoint$ = state$.pipe(getStateSlice('integrationsByMountPoint'));

  return combineLatest({
    mountedExtPoints: mountedExtPoints$,
    integrationsByMountPoint: integrationsByMountPoint$,
  }).pipe(
    filter(({ mountedExtPoints }) => mountedExtPoints.size > 0),
    pairwise(),
    map(([prevMounted, nextMounted]) => {
      const { mountedExtPoints: prevMountedExtPoints, integrationsByMountPoint: prevIntegrations } =
        prevMounted;
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
      state$.pipe(getStateSlice('activeModal')),
      state$.pipe(getStateSlice('layoutConfig')),
      state$.pipe(getStateSlice('integrationConfigs')),
      state$.pipe(getStateSlice('plugins')),
    ),
    map(([data, manifests, activeModal, layoutConfig, integrationConfigs, plugins]) => ({
      data,
      manifests,
      activeModal,
      layoutConfig,
      integrationConfigs,
      plugins,
    })),
    tap(async results => {
      const { config } = results.data;
      const { manifests, plugins } = results;
      const manifest = manifests.find((m: BaseIntegrationInfo) => m.name === config.name);
      try {
        await loadI18nNamespaces(plugins, config.i18nNamespace);
      } catch (err) {
        logger.error(`[integrations]: loadI18nNamespaces: ${err.message ?? JSON.stringify(err)}`);
      }

      logger.info(`Registering app ${config.name}`);
      singleSpa.registerApplication<
        Omit<RootComponentProps, 'singleSpa' | 'mountParcel' | 'domElement'> & {
          domElementGetter: () => HTMLElement;
        }
      >({
        name: manifest.name,
        app: config.loadingFn,
        activeWhen: location => checkActivityFn(config, manifest, location),
        customProps: {
          plugins,
          name: manifest.name,
          parseQueryString: parseQueryString,
          activeModal: results.activeModal,
          worldConfig: worldConfig,
          uiEvents: uiEvents,
          layoutConfig: results.layoutConfig.extensions,
          logger: sdk.services.log.create(manifest.name),
          domElementGetter: () => getDomElement(config, manifest.name, logger),
          navigateToModal: navigateToModal,
          getAppRoutes: appName => results.integrationConfigs.get(appName).routes,
        },
      });
    }),
    catchError(err => {
      logger.error(
        `[integrations]: Error mounting app: ${err.message ?? JSON.stringify(err)}, ${err.stack}`,
      );
      throw err;
    }),
  );
};

export const handleIntegrationUninstall = (state$: Observable<LoaderState>, logger: ILogger) => {
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
      withLatestFrom(
        state$.pipe(getStateSlice('integrationConfigs')),
        // state$.pipe(getStateSlice('extensionParcels')),
      ),
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
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  _logger: ILogger,
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

        const config = disableIntegration[0] as BaseIntegrationInfo;
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
export const handleEnableIntegration = (state$: Observable<LoaderState>, _logger: ILogger) => {
  return state$.pipe(getStateSlice('enableIntegrationRequest')).pipe(filter(Boolean));
};
