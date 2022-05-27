import { ILogger } from '@akashaorg/sdk-typings/lib/interfaces/log';
import {
  catchError,
  exhaustMap,
  filter,
  from,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { getStateSlice, LoaderState } from './state';
import { checkActivityFn, createRootNode, navigateToModal, parseQueryString } from './utils';
import * as singleSpa from 'single-spa';
import getSDK from '@akashaorg/awf-sdk';
import { RootExtensionProps } from '@akashaorg/ui-awf-typings';
import {
  EventDataTypes,
  IAppConfig,
  ILoaderConfig,
} from '@akashaorg/ui-awf-typings/lib/app-loader';
import { loadI18nNamespaces } from './i18n-utils';

const getMatchingExtensionConfigs =
  (opts: {
    extensionsByMountPoint: LoaderState['extensionsByMountPoint'];
    worldConfig: ILoaderConfig;
    layoutConfig: LoaderState['layoutConfig'];
    logger: ILogger;
    integrations: {
      manifests: LoaderState['manifests'];
      configs: Record<string, IAppConfig>;
    };
  }) =>
  ([name, extData]: [string, EventDataTypes]) => {
    return from(opts.extensionsByMountPoint).pipe(
      map(([mountsIn, configs]) => {
        let mountPoint = mountsIn;
        if (typeof mountPoint === 'function') {
          mountPoint = mountPoint({
            uiEvents,
            worldConfig: opts.worldConfig,
            layoutConfig: opts.layoutConfig.extensions,
            extensionData: extData,
            integrations: opts.integrations,
          });
        }
        return {
          mountPoint,
          extensionConfigs: configs,
        };
      }),
      filter(({ mountPoint }) => mountPoint === name),
      mergeMap(({ extensionConfigs, mountPoint }) => {
        return from(extensionConfigs).pipe(
          filter(conf => checkActivityFn(conf)),
          map((conf, index) => ({ extension: conf, mountPoint, index })),
        );
      }),
      map(({ extension, mountPoint, index }) => {
        const extID = `${extension.parent}-${mountPoint}_${index}`;
        const rootNode = document.getElementById(mountPoint);
        const wrapperNode = createRootNode(rootNode, extID);
        if (!wrapperNode) {
          return null;
        }
        return {
          extID,
          wrapperNode,
          extension,
          mountPoint,
          extData,
        };
      }),
      filter(Boolean),
      catchError(err => {
        opts.logger.error(
          `[extensions]: getMatchingExtensionConfigs ${err.message ?? JSON.stringify(err)}, ${
            err.stack
          }`,
        );
        throw err;
      }),
    );
  };

// exported for testing purposes
export const mountMatchingExtensionParcels = (opts: {
  worldConfig: ILoaderConfig;
  state: LoaderState;
  logger: ILogger;
}) => {
  const { state, worldConfig, logger } = opts;

  const sdk = getSDK();
  return from(state.mountedExtPoints).pipe(
    mergeMap(
      getMatchingExtensionConfigs({
        extensionsByMountPoint: state.extensionsByMountPoint,
        worldConfig,
        layoutConfig: state.layoutConfig,
        logger,
        integrations: {
          manifests: state.manifests,
          configs: Object.fromEntries(state.integrationConfigs),
        },
      }),
    ),
    mergeMap(async extInfo => {
      const extLogger = sdk.services.log.create(extInfo.extID);

      const parentConfig = state.integrationConfigs.get(extInfo.extension.parent);

      if (parentConfig) {
        // ensure that the i18n namespaces are loaded
        await loadI18nNamespaces(state.plugins, parentConfig.i18nNamespace);
      }

      const extensionProps: RootExtensionProps = {
        domElement: extInfo.wrapperNode,
        worldConfig: worldConfig,
        singleSpa,
        uiEvents: uiEvents,
        navigateToModal: navigateToModal,
        layoutConfig: state.layoutConfig.extensions,
        activeModal: state.activeModal,
        logger: extLogger,
        extensionData: extInfo.extData,
        parseQueryString: parseQueryString,
        plugins: state.plugins,
      };
      let parcel: singleSpa.Parcel;
      // check if the extension is already loaded
      if (state.extensionParcels.has(extInfo.mountPoint)) {
        const parcels = state.extensionParcels.get(extInfo.mountPoint) || [];
        if (parcels.some(parcel => parcel.id === extInfo.extID)) {
          const spaParcel = parcels.find(parcel => parcel.id === extInfo.extID);
          if (spaParcel) {
            parcel = spaParcel.parcel;
            // if the parcel is not mounted don't asign it to parcel var.
            // Forcing a remount will break the modals
            if (parcel.getStatus() === singleSpa.NOT_MOUNTED) {
              parcel = undefined;
            }
          }
        }
      }
      if (!parcel && parentConfig) {
        try {
          console.log(`[extensions]: Mounting parcel: ${extInfo.extID}`, state.extensionParcels);
          parcel = singleSpa.mountRootParcel<RootExtensionProps>(
            extInfo.extension.loadingFn,
            extensionProps,
          );
          await parcel.mountPromise;
        } catch (err) {
          logger.error(
            `[extensions]: mountMatchExtensionParcels:mountRootParcel: cannot mount ${
              extInfo.extID
            } into ${extInfo.mountPoint}: ${err.message ?? JSON.stringify(err)}, ${err.stack}`,
          );
        }
      }

      return {
        parcel,
        mountPoint: extInfo.mountPoint,
        extID: extInfo.extID,
        parent: extInfo.extension.parent,
      };
    }),
    filter(({ parcel }) => !!parcel),
    catchError(err => {
      logger.error(
        `[extensions]: mountMatchingExtensionParcels ${err.message ?? JSON.stringify(err)}, ${
          err.stack
        }`,
      );
      throw err;
    }),
  );
};

export const handleExtPointMountOfExtensions = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  return state$.pipe(
    getStateSlice('mountedExtPoints'),
    filter(mounted => mounted.size > 0),
    withLatestFrom(state$),
    map(([mountedExtPoints, state]) => ({
      state,
      worldConfig,
      logger,
      mountedExtPoints,
    })),
    exhaustMap(props => {
      return mountMatchingExtensionParcels(props);
    }),
    withLatestFrom(state$),
    tap(([parcelData, state]) => {
      const parcels = new Map(state.extensionParcels);

      if (parcels.has(parcelData.mountPoint)) {
        const parcelList = parcels.get(parcelData.mountPoint);
        if (!parcelList.some(parcel => parcel.id === parcelData.extID)) {
          parcels.set(
            parcelData.mountPoint,
            parcels.get(parcelData.mountPoint).concat({
              parcel: parcelData.parcel,
              id: parcelData.extID,
              parent: parcelData.parent,
            }),
          );
        }
      } else {
        parcels.set(parcelData.mountPoint, [
          { parcel: parcelData.parcel, id: parcelData.extID, parent: parcelData.parent },
        ]);
      }
      pipelineEvents.next({
        extensionParcels: parcels,
      });
    }),
    catchError(err => {
      logger.error(
        `[extensions]: handleExtPointMountOfExtensions ${err.message ?? JSON.stringify(err)}, ${
          err.stack
        }`,
      );
      throw err;
    }),
  );
};

/*
 * Handle extension point unmount event
 */
export const handleExtensionPointUnmount = (state$: Observable<LoaderState>, logger: ILogger) => {
  return state$
    .pipe(getStateSlice('unmountingExtensionPoints'))
    .pipe(
      filter(unmount => unmount.length > 0),
      mergeMap(unmountingExtensionPoints => {
        return from(unmountingExtensionPoints);
      }),
      withLatestFrom(state$.pipe(getStateSlice('mountedExtPoints'))),
      map(([unmounting, mounted]) => mounted.get(unmounting.name)),
      filter(Boolean),
    )
    .pipe(
      withLatestFrom(
        state$.pipe(getStateSlice('extensionParcels')),
        state$.pipe(getStateSlice('unmountingExtensionPoints')),
      ),
      map(([data, extensionParcels, unmountingExtensionPoints]) => {
        const parcels = extensionParcels.get(data.name);
        if (parcels && parcels.length) {
          return of(extensionParcels.get(data.name)).pipe(
            filter(parcels => !!parcels && parcels.length > 0),
            map(parcels =>
              from(
                parcels.map(parcelData => {
                  if (parcelData.parcel?.getStatus() === singleSpa.MOUNTED) {
                    return parcelData.parcel.unmount();
                  }
                  return Promise.resolve();
                }),
              ),
            ),
            map(() => {
              const remainingParcels = new Map(extensionParcels);
              const unmounting = unmountingExtensionPoints.filter(ext => ext.name !== data.name);

              remainingParcels.delete(data.name);
              return {
                extData: data,
                extensionParcels: remainingParcels,
                unmountingExtensionPoints: unmounting,
              };
            }),
          );
        }
        return of({ extData: data, extensionParcels: new Map(), unmountingExtensionPoints });
      }),
      mergeAll(),
      withLatestFrom(state$.pipe(getStateSlice('mountedExtPoints'))),
      map(([res, mountedExtPoints]) => {
        const { extData, extensionParcels, unmountingExtensionPoints } = res;
        const mountedExts = new Map(mountedExtPoints);
        mountedExtPoints.delete(extData.name);
        return {
          extensionParcels,
          mountedExtPoints: mountedExts,
          unmountingExtensionPoints,
        };
      }),
      tap(({ extensionParcels, mountedExtPoints, unmountingExtensionPoints }) => {
        pipelineEvents.next({
          extensionParcels,
          mountedExtPoints,
          unmountingExtensionPoints,
        });
      }),
      catchError(err => {
        logger.error(
          `[extensions]: handleExtensionPointUnmount ${err.message ?? JSON.stringify(err)}, ${
            err.stack
          }`,
        );
        throw err;
      }),
    );
};
