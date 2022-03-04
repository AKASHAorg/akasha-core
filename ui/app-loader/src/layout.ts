import { BaseIntegrationInfo, ILoaderConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { Observable, mergeMap, from, filter, zip, of, tap, catchError, switchMap, map } from 'rxjs';
import { uiEvents, pipelineEvents } from './events';
import { LoaderState, getStateSlice } from './state';
import { getDomElement, parseQueryString } from './utils';
import * as singleSpa from 'single-spa';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';

export const loadLayout = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  const layoutManifest$ = state$.pipe(getStateSlice('manifests')).pipe(
    mergeMap(m => from(m)),
    filter(m => m.name === worldConfig.layout && !singleSpa.getAppNames().includes(m.name)),
  );

  return layoutManifest$.pipe(
    switchMap(manifest =>
      zip(of(manifest), from(System.import(manifest.sources[0])), (layoutManifest, mod) => ({
        layoutManifest,
        mod,
      })),
    ),
    mergeMap((result: { layoutManifest: BaseIntegrationInfo; mod: System.Module }) => {
      const { mod, layoutManifest } = result;
      if (mod?.register && typeof mod.register === 'function') {
        return from(Promise.resolve(mod.register({ worldConfig, uiEvents }))).pipe(
          map(config => ({
            config,
            mod,
            layoutManifest,
          })),
        );
      } else {
        throw new Error('Layout module does not export a register function');
      }
    }),
    tap(({ config, layoutManifest }) => {
      pipelineEvents.next({
        layoutConfig: config,
      });
      singleSpa.registerApplication({
        name: layoutManifest.name,
        app: config.loadingFn,
        activeWhen: () => true,
        customProps: {
          domElementGetter: () => getDomElement(config, layoutManifest.name, logger),
          parseQueryString: parseQueryString,
          activeModal: null,
          worldConfig: worldConfig,
          layoutConfig: config.extensions,
          uiEvents,
          logger,
        },
      });
    }),
    catchError(err => {
      logger.error(`[LoadLayout]: ${err.message}`);
      throw err;
    }),
  );
};
