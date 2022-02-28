import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import {
  combineLatest,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  pairwise,
  switchMap,
  tap,
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
import { EventDataTypes, ILoaderConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';

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
      }),
    ),
    switchMap(([result, props]) => {
      const { mountedExtPoints, extensionsByMountPoint } = result;
      const { layoutConfig, integrationConfigs, activeModal } = props;
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
          })),
        )
        .pipe(
          mergeMap(
            async ({ matchingExtensionData, integrationConfigs, layoutConfig, activeModal }) => {
              const extLogger = sdk.services.log.create(matchingExtensionData.extID);
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
                navigateTo: navigateTo(integrationConfigs, extLogger),
                parseQueryString: parseQueryString,
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
