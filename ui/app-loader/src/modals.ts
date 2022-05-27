import { ILogger } from '@akashaorg/sdk-typings/lib/interfaces/log';
import { EventTypes, ILoaderConfig } from '@akashaorg/ui-awf-typings/lib/app-loader';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { getStateSlice, LoaderState } from './state';
import * as singleSpa from 'single-spa';

const unmountActiveModalParcel = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  const mountedExtPoints$ = state$.pipe(getStateSlice('mountedExtPoints'));
  const extensionParcels$ = state$.pipe(getStateSlice('extensionParcels'));
  const extensionsByMountPoint$ = state$.pipe(getStateSlice('extensionsByMountPoint'));
  const activeModal$ = state$.pipe(getStateSlice('activeModal'));
  const layoutConfig$ = state$.pipe(getStateSlice('layoutConfig'));
  const integrationConfigs$ = state$.pipe(getStateSlice('integrationConfigs'));
  const manifests$ = state$.pipe(getStateSlice('manifests'));

  return activeModal$.pipe(
    withLatestFrom(
      mountedExtPoints$,
      extensionParcels$,
      extensionsByMountPoint$,
      layoutConfig$,
      integrationConfigs$,
      manifests$,
    ),
    filter(([activeModal]) => !!activeModal.name),
    distinctUntilChanged((prev, current) => prev[0].name === current[0].name),
    mergeMap(
      ([
        activeModal,
        mountedExtPoints,
        extensionParcels,
        extensionsByMountPoint,
        layoutConfig,
        integrationConfigs,
        manifests,
      ]) => {
        const modalExtensions = extensionsByMountPoint.get(activeModal.name);
        return from(modalExtensions).pipe(
          filter(Boolean),
          map(extension => {
            let extensionMountPoint = extension.mountsIn;
            if (typeof extensionMountPoint === 'function') {
              extensionMountPoint = extensionMountPoint({
                uiEvents,
                worldConfig: worldConfig,
                layoutConfig: layoutConfig.extensions,
                extensionData: activeModal,
                integrations: {
                  configs: Object.fromEntries(integrationConfigs),
                  manifests: manifests,
                },
              });
            }
            return extensionParcels
              .get(extensionMountPoint)
              .filter(parcel => parcel.parent === extension.parent);
          }),
          filter(Boolean),
          mergeMap(parcels => {
            for (const parcelData of parcels) {
              if (parcelData.parcel.getStatus() === singleSpa.NOT_MOUNTED) {
                return of(parcelData);
              }
              const p = parcelData.parcel.unmount();
              return from(p).pipe(map(() => parcelData));
            }
            return of(null);
          }),
          toArray(),
          map(res => {
            console.log('unmountActiveModalParcel', res, activeModal);
            const extParcels = new Map(extensionParcels);
            extParcels.delete(activeModal.name);
            return {
              unmounted: res,
              mountedExtPoints,
              activeModal,
              extensionParcels: extParcels,
            };
          }),
        );
      },
    ),
    tap(res => {
      const mountedExtPoints = new Map(res.mountedExtPoints);
      mountedExtPoints.delete(res.activeModal.name);
      pipelineEvents.next({
        extensionParcels: res.extensionParcels,
        mountedExtPoints: mountedExtPoints,
      });
    }),
    catchError(err => {
      logger.error(`[modals] Error in unmountActiveModalParcel: ${err.message}`);
      throw err;
    }),
  );
};

export const handleModalRequest = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  const modalRequest$ = state$.pipe(getStateSlice('modalRequest'));
  const activeModal$ = state$.pipe(getStateSlice('activeModal'));
  const layoutReady$ = state$.pipe(getStateSlice('layoutReady'));

  return combineLatest([modalRequest$, layoutReady$], (modalRequest, layoutReady) => ({
    modalRequest,
    layoutReady,
  }))
    .pipe(
      filter(({ layoutReady }) => layoutReady),
      distinctUntilChanged((prev, current) => prev.modalRequest.name === current.modalRequest.name),
      withLatestFrom(activeModal$),
    )
    .pipe(
      map(([{ modalRequest }, activeModal]) => ({
        modalRequest,
        activeModal,
      })),
    )
    .pipe(
      filter(({ modalRequest, activeModal }) => modalRequest.name !== activeModal.name),
      tap(results => {
        const { modalRequest, activeModal } = results;
        if (modalRequest.name && modalRequest.name !== activeModal.name) {
          // unmount the modal parcel
          if (activeModal.name) {
            unmountActiveModalParcel(worldConfig, state$, logger).subscribe({
              next: () => {
                uiEvents.next({
                  event: EventTypes.ModalUnmountRequest,
                  data: activeModal,
                });
              },
            });
          }
          // mount modal
          uiEvents.next({
            event: EventTypes.ModalMountRequest,
            data: modalRequest,
          });
        }
        if (activeModal.name && !modalRequest.name) {
          // only unmount the active modal;
          unmountActiveModalParcel(worldConfig, state$, logger).subscribe({
            next: () => {
              uiEvents.next({
                event: EventTypes.ModalUnmountRequest,
                data: activeModal,
              });
            },
          });
        }
      }),
      catchError(err => {
        logger.error(`[modals]: Error in handleModalRequest: ${err.message ?? err.toString()}`);
        throw err;
      }),
    );
};
export const handleModalMount = (state$: Observable<LoaderState>, logger: ILogger) => {
  return state$
    .pipe(getStateSlice('activeModal'))
    .pipe(filter(activeModal => !!activeModal.name))
    .pipe(
      tap(activeModal => {
        console.log(`[modals] Modal mount request received for ${activeModal.name}`);
      }),
      withLatestFrom(state$.pipe(getStateSlice('mountedExtPoints'))),
      filter(([activeModal, mountedExtPoints]) => !mountedExtPoints.has(activeModal.name)),
    )
    .pipe(
      tap(([activeModal, mountedExtPoints]) => {
        console.log(`[handleModalMount]: Mounting modal ${activeModal.name}`);
        const mounted = new Map(mountedExtPoints);

        pipelineEvents.next({
          mountedExtPoints: mounted.set(activeModal.name, activeModal),
        });
      }),
      catchError(err => {
        logger.error(`[modals]: Error in handleModalMount: ${err.message}`);
        throw err;
      }),
    );
};
