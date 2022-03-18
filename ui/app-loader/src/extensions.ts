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
  withLatestFrom,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { getStateSlice, LoaderState } from './state';
import { checkActivityFn, createRootNode, navigateToModal, parseQueryString } from './utils';
import * as singleSpa from 'single-spa';
import getSDK from '@akashaproject/awf-sdk';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';
import { EventDataTypes, ILoaderConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { loadI18nNamespaces } from './i18n-utils';

const getMatchingExtensionConfigs =
  (opts: {
    extensionsByMountPoint: LoaderState['extensionsByMountPoint'];
    worldConfig: ILoaderConfig;
    layoutConfig: LoaderState['layoutConfig'];
    logger: ILogger;
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
        return {
          extID,
          wrapperNode,
          extension,
          mountPoint,
          extData,
        };
      }),
    );
  };

export const handleExtPointMountOfExtensions = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  const mountedExtPoints$ = state$.pipe(getStateSlice('mountedExtPoints'));
  const extensionsByMountPoint$ = state$.pipe(getStateSlice('extensionsByMountPoint'));
  const extensionParcels$ = state$.pipe(getStateSlice('extensionParcels'));
  const layoutConfig$ = state$.pipe(getStateSlice('layoutConfig'));
  const activeModal$ = state$.pipe(getStateSlice('activeModal'));

  // keep a reference to the <same> parcel between updates
  const processed = new Map<string, singleSpa.Parcel>();

  const sdk = getSDK();

  return combineLatest({
    mountedExtPoints: mountedExtPoints$,
    extensionsByMountPoint: extensionsByMountPoint$,
  }).pipe(
    filter(({ mountedExtPoints }) => mountedExtPoints.size > 0),
    pairwise(),
    map(([prevMounted, nextMounted]) => {
      const { mountedExtPoints: prevMountedExtPoints, extensionsByMountPoint: prevExtensions } =
        prevMounted;
      const { mountedExtPoints, extensionsByMountPoint } = nextMounted;
      // pairwise skips the first emitted value
      if (prevMountedExtPoints.size === 1) {
        return {
          mountedExtPoints,
          extensionsByMountPoint,
        };
      }

      const unique = Array.from(mountedExtPoints).filter(([name]) => {
        const _prevExtensionsCount = prevExtensions.size || 0;
        const _nextExtensionsCount = extensionsByMountPoint.size || 0;

        if (prevMountedExtPoints.has(name) && _prevExtensionsCount === _nextExtensionsCount) {
          return false;
        }
        return true;
      });
      return {
        mountedExtPoints: new Map(unique),
        extensionsByMountPoint,
      };
    }),
    withLatestFrom(
      combineLatest({
        layoutConfig: layoutConfig$,
        activeModal: activeModal$,
        integrationConfigs: state$.pipe(getStateSlice('integrationConfigs')),
        plugins: state$.pipe(getStateSlice('plugins')),
      }),
    ),
    switchMap(([result, props]) => {
      const { mountedExtPoints, extensionsByMountPoint } = result;
      const { layoutConfig, integrationConfigs, activeModal, plugins } = props;
      return from(mountedExtPoints)
        .pipe(
          mergeMap(
            getMatchingExtensionConfigs({
              extensionsByMountPoint,
              worldConfig,
              layoutConfig,
              logger,
            }),
          ),
          map(extData => ({
            matchingExtensionData: extData,
            integrationConfigs,
            activeModal,
            layoutConfig,
            plugins,
          })),
        )
        .pipe(
          mergeMap(
            async ({
              matchingExtensionData,
              integrationConfigs,
              layoutConfig,
              activeModal,
              plugins,
            }) => {
              const extLogger = sdk.services.log.create(matchingExtensionData.extID);

              const parentConfig = integrationConfigs.get(matchingExtensionData.extension.parent);

              if (parentConfig) {
                // ensure that the i18n namespaces are loaded
                await loadI18nNamespaces(plugins, parentConfig.i18nNamespace);
              }

              const extensionProps: RootExtensionProps = {
                domElement: matchingExtensionData.wrapperNode,
                worldConfig: worldConfig,
                singleSpa,
                uiEvents: uiEvents,
                navigateToModal: navigateToModal,
                layoutConfig: layoutConfig.extensions,
                activeModal: activeModal,
                logger: extLogger,
                extensionData: matchingExtensionData.extData,
                parseQueryString: parseQueryString,
                plugins,
              };

              let parcel: singleSpa.Parcel;
              if (processed.get(matchingExtensionData.extID)) {
                parcel = processed.get(matchingExtensionData.extID);
              } else {
                parcel = singleSpa.mountRootParcel<RootExtensionProps>(
                  matchingExtensionData.extension.loadingFn,
                  extensionProps,
                );
                processed.set(matchingExtensionData.extID, parcel);
              }
              await parcel.mountPromise;
              return {
                parcel,
                mountPoint: matchingExtensionData.mountPoint,
                extID: matchingExtensionData.extID,
                parent: matchingExtensionData.extension.parent,
              };
            },
          ),
          withLatestFrom(extensionParcels$),
          tap(([parcelData, extensionParcels]) => {
            if (!parcelData) {
              return;
            }
            const parcels = new Map(extensionParcels);
            if (parcels.has(parcelData.mountPoint)) {
              parcels.set(
                parcelData.mountPoint,
                parcels.get(parcelData.mountPoint).concat({
                  parcel: parcelData.parcel,
                  id: parcelData.extID,
                  parent: parcelData.parent,
                }),
              );
            } else {
              parcels.set(parcelData.mountPoint, [
                { parcel: parcelData.parcel, id: parcelData.extID, parent: parcelData.parent },
              ]);
            }
            pipelineEvents.next({
              extensionParcels: parcels,
            });
            processed.delete(parcelData.extID);
          }),
        );
    }),
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
