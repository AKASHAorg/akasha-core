import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  BaseIntegrationInfo,
  EventTypes,
  IAppConfig,
  ILoaderConfig,
  PluginConf,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
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
  toArray,
  concatMap,
  combineLatestWith,
  catchError,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { LoaderState, getStateSlice } from './state';
import { checkActivityFn, getDomElement, navigateToModal, parseQueryString } from './utils';
import * as singleSpa from 'single-spa';
import getSDK from '@akashaproject/awf-sdk';
import { getIntegrationsData } from './manifests';
import { loadI18nNamespaces } from './i18n-utils';

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
        logger.warn(`Multiple sources found for integration ${manifest.name}. Using ${source}`);
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

export const extractExtensionsFromApps = (
  config: IAppConfig & { name: string },
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  return from(config.extends)
    .pipe(
      withLatestFrom(
        state$.pipe(getStateSlice('extensionsByParent')),
        state$.pipe(getStateSlice('extensionsByMountPoint')),
      ),
      map(([extConfig, extensionsByParent, extensionsByMountPoint]) => ({
        extConfig,
        extensionsByParent,
        extensionsByMountPoint,
      })),
    )
    .pipe(
      mergeMap(({ extConfig, extensionsByMountPoint, extensionsByParent }) => {
        const extension = { extConfig, parent: config.name };
        const byMount = new Map(extensionsByMountPoint);
        const byParent = new Map(extensionsByParent);
        if (byMount.has(extension.extConfig.mountsIn)) {
          byMount.set(
            extension.extConfig.mountsIn,
            byMount
              .get(extension.extConfig.mountsIn)
              .concat({ ...extension.extConfig, parent: extension.parent }),
          );
        } else {
          byMount.set(extension.extConfig.mountsIn, [
            { ...extension.extConfig, parent: extension.parent },
          ]);
        }
        if (byParent.has(extension.parent)) {
          return of({
            extensionsByParent: byParent.set(
              extension.parent,
              byParent.get(extension.parent).concat(extension.extConfig),
            ),
            extensionsByMountPoint: byMount,
          });
        } else {
          return of({
            extensionsByParent: byParent.set(extension.parent, [extension.extConfig]),
            extensionsByMountPoint: byMount,
          });
        }
      }),
    )
    .pipe(
      tap(values => {
        pipelineEvents.next(values);
      }),
      catchError(err => {
        logger.error(
          `[integrations]: extractExtensionsFromApps: ${err.message ?? JSON.stringify(err)} ${
            err.stack
          }`,
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
                plugin = await Promise.resolve(mod.getPlugin(registrationProps));
              }

              if (mod?.register && typeof mod.register === 'function') {
                appConf = await Promise.resolve(mod.register(registrationProps));
                // each app must have menuItems exposed in config, widgets do not
                if (appConf.menuItems) {
                  uiEvents.next({
                    event: EventTypes.RegisterIntegration,
                    data: {
                      name: moduleName,
                      menuItems: appConf.menuItems,
                      navRoutes: appConf.routes,
                    },
                  });
                }
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
              plugins: results.plugins,
              integrationConfigs,
              integrationsByMountPoint,
            })),
          );
      }),
      tap(({ configs }) => {
        from(configs)
          .pipe(
            filter(conf => conf.extends && Array.isArray(conf.extends)),
            tap(config => extractExtensionsFromApps(config, state$, logger).subscribe()),
          )
          .subscribe();
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

        if (prevMountedExtPoints.has(name) && _prevIntegrationsCount === _nextIntegrationsCount) {
          return false;
        }
        return true;
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

      await loadI18nNamespaces(plugins, config.i18nNamespace);

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
        state$.pipe(getStateSlice('extensionParcels')),
      ),
      map(([uninstalledApp, integrationConfigs, extensionParcels]) => ({
        uninstalledApp,
        integrationConfigs,
        extensionParcels,
      })),
    )
    .pipe(
      mergeMap(props => {
        const { integrationConfigs, extensionParcels, uninstalledApp } = props;
        const config = integrationConfigs.get(uninstalledApp.name);
        if (config?.extends) {
          const parcels = Array.from(extensionParcels).map(([, extensionParcels]) =>
            extensionParcels.filter(ext => ext.parent === config.name),
          );
          if (parcels.length) {
            return unmountParcels(parcels.flat(), logger).pipe(
              map(unmountedExtensions => ({
                uninstalledApp,
                unmountedExtensions,
                integrationConfigs,
                extensionParcels,
              })),
            );
          }
        }
        return of({
          uninstalledApp,
          integrationConfigs,
          extensionParcels,
        });
      }),
    )
    .pipe(
      withLatestFrom(
        state$.pipe(getStateSlice('integrationsByMountPoint')),
        state$.pipe(getStateSlice('extensionsByMountPoint')),
        state$.pipe(getStateSlice('extensionsByParent')),
        state$.pipe(getStateSlice('modules')),
        state$.pipe(getStateSlice('manifests')),
      ),
      map(
        ([
          res,
          integrationsByMountPoint,
          extensionsByMountPoint,
          extensionsByParent,
          modules,
          manifests,
        ]) => ({
          ...res,
          integrationsByMountPoint,
          extensionsByMountPoint,
          extensionsByParent,
          modules,
          manifests,
        }),
      ),
      map(results => {
        const {
          uninstalledApp,
          integrationConfigs,
          extensionParcels,
          integrationsByMountPoint,
          extensionsByMountPoint,
          extensionsByParent,
        } = results;
        const intByMountPoint = new Map(
          Array.from(integrationsByMountPoint).map(([name, integrations]) => {
            const _integrations = integrations.filter(i => i.name !== uninstalledApp.name);
            return [name, _integrations];
          }),
        );
        const modules = new Map(
          Array.from(results.modules).filter(([name]) => name !== uninstalledApp.name),
        );
        const extByMountPoint = new Map(
          Array.from(extensionsByMountPoint).map(([name, extensions]) => {
            const exts = extensions.filter(i => i.parent !== uninstalledApp.name);
            return [name, exts];
          }),
        );
        const extByParent = new Map(
          Array.from(extensionsByParent).filter(([parent]) => {
            return parent !== uninstalledApp.name;
          }),
        );

        const intConfigs = new Map(integrationConfigs);
        intConfigs.delete(uninstalledApp.name);

        const parcels = new Map(
          Array.from(extensionParcels).map(([extPointName, parcels]) => {
            const _parcels = parcels.filter(parcel => parcel.parent !== uninstalledApp.name);
            return [extPointName, _parcels];
          }),
        );
        const manifests = results.manifests.filter(manifest => {
          return manifest.name !== uninstalledApp.name;
        });
        return {
          uninstalledApp,
          integrationsByMountPoint: intByMountPoint,
          extensionsByMountPoint: extByMountPoint,
          extensionsByParent: extByParent,
          integrationConfigs: intConfigs,
          extensionParcels: parcels,
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

const unmountParcels = (
  parcels: { parcel: singleSpa.Parcel<RootComponentProps>; id: string; parent: string }[],
  logger: ILogger,
) => {
  return from(parcels).pipe(
    concatMap(async parcelData => {
      try {
        if (parcelData.parcel.getStatus() === singleSpa.MOUNTED) {
          await parcelData.parcel.unmount();
        }
        return parcelData;
      } catch (err) {
        // show a warn but don't throw an error
        logger.warn(err);
        return parcelData;
      }
    }),
    toArray(),
  );
};
