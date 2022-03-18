import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import {
  combineLatest,
  filter,
  from,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  pairwise,
  switchMap,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { getStateSlice, LoaderState } from './state';
import {
  checkActivityFn,
  createRootNode,
  navigateTo,
  navigateToModal,
  parseQueryString,
} from './utils';
import * as singleSpa from 'single-spa';
import getSDK from '@akashaproject/awf-sdk';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';
import {
  EventDataTypes,
  IAppConfig,
  ILoaderConfig,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
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
    mergeMap(props => {
      return mountMatchingExtensionParcels(props);
    }),
    toArray(),
    withLatestFrom(state$),
    tap(([parcelsData, state]) => {
      const parcels = new Map(state.extensionParcels);
      parcelsData.forEach(parcelData => {
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
      });
      pipelineEvents.next({
        extensionParcels: parcels,
      });
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
        navigateTo: navigateTo(state.integrationConfigs, extLogger),
        parseQueryString: parseQueryString,
        plugins: state.plugins,
      };

      const parcel = singleSpa.mountRootParcel<RootExtensionProps>(
        extInfo.extension.loadingFn,
        extensionProps,
      );

      await parcel.mountPromise;

      return {
        parcel,
        mountPoint: extInfo.mountPoint,
        extID: extInfo.extID,
        parent: extInfo.extension.parent,
      };
    }),
    filter(parcelData => !!parcelData),
  );
};

/*
 * Handle extension point unmount event
 */
export const handleExtensionPointUnmount = (state: LoaderState, eventData: EventDataTypes) => {
  return from(state.mountedExtPoints)
    .pipe(filter(([name]) => name === eventData.name))
    .pipe(
      map(([, data]) => {
        const parcels = state.extensionParcels.get(data.name);
        if (parcels && parcels.length) {
          return of(state.extensionParcels.get(data.name)).pipe(
            filter(parcels => !!parcels && parcels.length > 0),
            map(parcels =>
              from(
                parcels.map(parcelData => {
                  if (parcelData.parcel.getStatus() === singleSpa.MOUNTED) {
                    return parcelData.parcel.unmount();
                  }
                  return Promise.resolve();
                }),
              ),
            ),
            map(() => {
              const remainingParcels = new Map(state.extensionParcels);
              remainingParcels.delete(eventData.name);
              return {
                extData: data,
                extensionParcels: remainingParcels,
              };
            }),
          );
        }
        return of({ extData: data, extensionParcels: new Map() });
      }),
      mergeAll(),
      map(res => {
        const { extData, extensionParcels } = res;
        const mountedExtPoints = new Map(state.mountedExtPoints);
        mountedExtPoints.delete(extData.name);
        return {
          ...state,
          extensionParcels,
          mountedExtPoints,
        };
      }),
    );
};
