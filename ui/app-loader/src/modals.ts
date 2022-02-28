import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { EventTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  catchError,
  combineLatest,
  filter,
  Observable,
  of,
  pairwise,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { pipelineEvents, uiEvents } from './events';
import { getStateSlice, LoaderState } from './state';

export const handleModalRequest = (state$: Observable<LoaderState>, logger: ILogger) => {
  const modalRequest$ = state$.pipe(getStateSlice('modalRequest'));
  const layoutLoaded$ = state$.pipe(
    getStateSlice('layoutConfig'),
    filter(conf => !!conf),
  );

  return modalRequest$
    .pipe(pairwise())
    .pipe(
      switchMap(([prev, next]) => {
        return combineLatest({
          prev: of(prev),
          next: of(next),
          layoutLoaded: layoutLoaded$,
        });
      }),
    )
    .pipe(
      tap(({ prev, next }) => {
        if (prev.name && prev.name !== next.name) {
          logger.info(`[app-loader]: unmounting modal ${prev.name}`);
          uiEvents.next({
            event: EventTypes.ModalUnmountRequest,
            data: prev,
          });
        }
        if (next.name && next.name !== prev.name) {
          logger.info(`[app-loader]: mounting modal ${next.name}`);
          uiEvents.next({
            event: EventTypes.ModalMountRequest,
            data: next,
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
        pipelineEvents.next({
          mountedExtPoints: new Map(mountedExtPoints).set(activeModal.name, activeModal),
        });
      }),
    );
};
export const handleModalUnmount = (state$: Observable<LoaderState> /*, logger: ILogger */) => {
  return state$;
};
