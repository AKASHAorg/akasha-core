import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  BaseIntegrationInfo,
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
  distinct,
  mergeAll,
  pairwise,
  toArray,
  concatMap,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { LoaderState, getStateSlice } from './state';
import {
  checkActivityFn,
  getDomElement,
  navigateTo,
  navigateToModal,
  parseQueryString,
} from './utils';
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

const systemImport = (logger: ILogger) => (manifests: BaseIntegrationInfo[]) => {
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
      }
      pipelineEvents.next({
        modules: new Map([...importedModules, ...modules]),
      });
    }),
  );
};

const extractExtensionsFromApps = (
  config: IAppConfig & { name: string },
  state$: Observable<LoaderState>,
) => {
  return from(config.extends)
    .pipe(
      withLatestFrom(
        combineLatest({
          extensionsByParent: state$.pipe(getStateSlice('extensionsByParent')),
          extensionsByMountPoint: state$.pipe(getStateSlice('extensionsByMountPoint')),
        }),
      ),
    )
    .pipe(
      tap(([extConfig, { extensionsByMountPoint, extensionsByParent }]) => {
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
          return pipelineEvents.next({
            extensionsByParent: byParent.set(
              extension.parent,
              byParent.get(extension.parent).concat(extension.extConfig),
            ),
            extensionsByMountPoint: byMount,
          });
        } else {
          return pipelineEvents.next({
            extensionsByParent: byParent.set(extension.parent, [extension.extConfig]),
            extensionsByMountPoint: byMount,
          });
        }
      }),
    );
};

const extractMenuItemsFromApps = (
  config: IAppConfig & { name: string },
  state$: Observable<LoaderState>,
) => {
  return of(config)
    .pipe(
      filter(conf => !!conf.menuItems),
      withLatestFrom(state$.pipe(getStateSlice('menuItems'))),
    )
    .pipe(
      tap(([appConfig, menuItems]) => {
        const currentIdx = menuItems.nextIndex;
        const items = menuItems.items.concat({ ...appConfig.menuItems, index: currentIdx });
        return pipelineEvents.next({
          menuItems: {
            items,
            nextIndex: currentIdx + 1,
          },
        });
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

  return combineLatest({
    layoutConfig: layoutConfig$,
    modules: modules$,
    integrationConfigs: integrationConfigs$,
    integrationsByMountPoint: integrationsByMountPoint$,
    manifests: manifests$,
    plugins: plugins$,
  })
    .pipe(
      filter(({ layoutConfig }) => !!layoutConfig),
      distinct(res => res.modules.size),
    )
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
            tap(config => extractMenuItemsFromApps(config, state$).subscribe()),
            filter(conf => conf.extends && Array.isArray(conf.extends)),
            tap(config => extractExtensionsFromApps(config, state$).subscribe()),
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
      combineLatest({
        manifests: state$.pipe(getStateSlice('manifests')),
        activeModal: state$.pipe(getStateSlice('activeModal')),
        layoutConfig: state$.pipe(getStateSlice('layoutConfig')),
        integrationConfigs: state$.pipe(getStateSlice('integrationConfigs')),
        plugins: state$.pipe(getStateSlice('plugins')),
      }),
    ),
    tap(async ([data, props]) => {
      const { config } = data;
      const { manifests, plugins } = props;
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
          activeModal: props.activeModal,
          worldConfig: worldConfig,
          uiEvents: uiEvents,
          layoutConfig: props.layoutConfig.extensions,
          logger: sdk.services.log.create(manifest.name),
          domElementGetter: () => getDomElement(config, manifest.name, logger),
          navigateTo: navigateTo(props.integrationConfigs, logger),
          navigateToModal: navigateToModal,
          getAppRoutes: appName => props.integrationConfigs.get(appName).routes,
          getMenuItems: () => state$.pipe(getStateSlice('menuItems')),
        },
      });
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
      withLatestFrom(state$.pipe(getStateSlice('manifests'))),
      tap(([uninstalled, manifests]) => {
        pipelineEvents.next({
          manifests: manifests.filter(man => man.name === uninstalled.name),
        });
      }),
      map(([uninstalled]) => uninstalled),
      withLatestFrom(
        combineLatest({
          integrationConfigs: state$.pipe(getStateSlice('integrationConfigs')),
          extensionParcels: state$.pipe(getStateSlice('extensionParcels')),
        }),
      ),
    )
    .pipe(
      mergeMap(([uninstalledApp, props]) => {
        const { integrationConfigs, extensionParcels } = props;
        const config = integrationConfigs.get(uninstalledApp.name);
        if (config.extends) {
          const parcels = Array.from(extensionParcels).map(([, extensionParcels]) =>
            extensionParcels.filter(ext => ext.parent === config.name),
          );
          if (parcels.length) {
            return unmountParcels(parcels.flat()).pipe(
              map(unmountedExtensions => ({
                uninstalledApp,
                unmountedExtensions,
                integrationConfigs,
                extensionParcels,
              })),
            );
          }
        }
        return of(null);
      }),
    )
    .pipe(
      filter(Boolean),
      withLatestFrom(
        combineLatest({
          integrationsByMountPoint: state$.pipe(getStateSlice('integrationsByMountPoint')),
          extensionsByMountPoint: state$.pipe(getStateSlice('extensionsByMountPoint')),
          extensionsByParent: state$.pipe(getStateSlice('extensionsByParent')),
        }),
      ),
      tap(([results, props]) => {
        const { uninstalledApp, integrationConfigs, extensionParcels } = results;
        const { integrationsByMountPoint, extensionsByMountPoint, extensionsByParent } = props;
        const intByMountPoint = new Map(
          Array.from(integrationsByMountPoint).map(([name, integrations]) => {
            const _integrations = integrations.filter(i => i.name !== uninstalledApp.name);
            return [name, _integrations];
          }),
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

        pipelineEvents.next({
          integrationsByMountPoint: intByMountPoint,
          extensionsByMountPoint: extByMountPoint,
          extensionsByParent: extByParent,
          integrationConfigs: intConfigs,
          extensionParcels: parcels,
        });
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
 */
export const handleEnableIntegration = (state$: Observable<LoaderState>, _logger: ILogger) => {
  return state$.pipe(getStateSlice('enableIntegrationRequest')).pipe(filter(Boolean));
};

const unmountParcels = (
  parcels: { parcel: singleSpa.Parcel<RootComponentProps>; id: string; parent: string }[],
) => {
  return from(parcels).pipe(
    concatMap(async parcelData => {
      try {
        await parcelData.parcel.unmount();
        return parcelData;
      } catch (err) {
        // show a warn but don't throw an error
        console.warn(err);
        return parcelData;
      }
    }),
    toArray(),
  );
};
