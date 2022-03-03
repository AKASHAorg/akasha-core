import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { EventTypes, ILoaderConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  catchError,
  combineLatest,
  combineLatestWith,
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

const umountActiveModalParcel = (state$: Observable<LoaderState>, logger: ILogger) => {
  const mountedExtPoints$ = state$.pipe(getStateSlice('mountedExtPoints'));
  const extensionParcels$ = state$.pipe(getStateSlice('extensionParcels'));
  const extensionsByMountPoint$ = state$.pipe(getStateSlice('extensionsByMountPoint'));
  const activeModal$ = state$.pipe(getStateSlice('activeModal'));

  return activeModal$.pipe(
    combineLatestWith(mountedExtPoints$, extensionParcels$, extensionsByMountPoint$),
    filter(([activeModal]) => !!activeModal.name),
    distinctUntilChanged((prev, current) => prev[0].name === current[0].name),
    mergeMap(([activeModal, mountedExtPoints, extensionParcels, extensionsByMountPoint]) => {
      const modalExtensions = extensionsByMountPoint.get(activeModal.name);
      return from(modalExtensions).pipe(
        filter(Boolean),
        map(extension => {
          for (const [, parcels] of Array.from(extensionParcels)) {
            return parcels.filter(p => p.parent === extension.parent);
          }
        }),
        filter(Boolean),
        mergeMap(parcels => {
          for (const parcelData of parcels) {
            const p = parcelData.parcel.unmount();

            return from(p).pipe(map(() => parcelData));
          }
          return of(null);
        }),
        toArray(),
        map(res => {
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
    }),
    tap(res => {
      const mountedExtPoints = new Map(res.mountedExtPoints);
      mountedExtPoints.delete(res.activeModal.name);
      pipelineEvents.next({
        extensionParcels: res.extensionParcels,
        mountedExtPoints: mountedExtPoints,
      });
    }),
    catchError(err => {
      logger.error(err);
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
      combineLatestWith(activeModal$),
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
            umountActiveModalParcel(state$, logger).subscribe({
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
          umountActiveModalParcel(state$, logger).subscribe({
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
        logger.error(
          `[handleModalRequest]: Error requesting modal mount${err.message ?? err.toString()}`,
        );
        throw err;
      }),
    );
};
export const handleModalMount = (state$: Observable<LoaderState>, logger: ILogger) => {
  return state$
    .pipe(getStateSlice('activeModal'))
    .pipe(filter(activeModal => !!activeModal.name))
    .pipe(
      withLatestFrom(state$.pipe(getStateSlice('mountedExtPoints'))),
      filter(([activeModal, mountedExtPoints]) => !mountedExtPoints.has(activeModal.name)),
    )
    .pipe(
      tap(([activeModal, mountedExtPoints]) => {
        logger.info(`[handleModalMount]: Mounting modal ${activeModal.name}`);
        const mounted = new Map(mountedExtPoints);

        pipelineEvents.next({
          mountedExtPoints: mounted.set(activeModal.name, activeModal),
        });
      }),
    );
};
