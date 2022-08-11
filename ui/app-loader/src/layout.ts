import { ILoaderConfig, RootComponentProps } from '@akashaorg/typings/ui';
import { Observable, mergeMap, from, filter, tap, catchError, map, withLatestFrom } from 'rxjs';
import { uiEvents, pipelineEvents } from './events';
import { LoaderState, getStateSlice } from './state';
import { getDomElement, parseQueryString } from './utils';
import * as singleSpa from 'single-spa';
import { ILogger } from '@akashaorg/typings/sdk';

export const loadLayout = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  const layout$ = state$.pipe(getStateSlice('modules')).pipe(
    withLatestFrom(state$.pipe(getStateSlice('manifests'))),
    mergeMap(([mod, man]) =>
      from(man).pipe(
        filter(m => m.name === worldConfig.layout && !singleSpa.getAppNames().includes(m.name)),
        map(man => {
          const layoutModule = mod.get(man.name);
          if (!layoutModule) {
            return null;
          }
          return {
            layoutModule,
            layoutManifest: man,
          };
        }),
      ),
    ),
    filter(res => Boolean(res)),
  );

  return layout$.pipe(
    mergeMap(({ layoutModule, layoutManifest }) => {
      if (layoutModule?.register && typeof layoutModule.register === 'function') {
        const registrationProps: any = {
          worldConfig,
          uiEvents,
        };
        return from(Promise.resolve(layoutModule.register({ ...registrationProps }))).pipe(
          map(config => ({
            config,
            layoutModule,
            layoutManifest,
          })),
        );
      } else {
        throw new Error('Layout module does not export a register function');
      }
    }),
    withLatestFrom(state$.pipe(getStateSlice('plugins'))),
    tap(([{ config, layoutManifest }, plugins]) => {
      if (singleSpa.getAppNames().includes(layoutManifest.name)) {
        return;
      }
      pipelineEvents.next({
        layoutConfig: config,
      });
      singleSpa.registerApplication<
        Partial<RootComponentProps> & { domElementGetter?: () => HTMLElement }
      >({
        name: layoutManifest.name,
        app: config.loadingFn,
        activeWhen: () => true,
        customProps: {
          domElementGetter: () => getDomElement(config, layoutManifest.name, logger),
          parseQueryString: parseQueryString,
          worldConfig: worldConfig,
          layoutConfig: config.extensions,
          uiEvents,
          logger,
          plugins,
        },
      });
    }),
    catchError(err => {
      logger.error(`[LoadLayout]: ${err.message}`);
      throw err;
    }),
  );
};
