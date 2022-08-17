import { ILogger } from '@akashaorg/typings/sdk';
import { ILoaderConfig } from '@akashaorg/typings/ui';
import { from, mergeMap, Observable, tap, withLatestFrom } from 'rxjs';
import { getStateSlice, LoaderState } from './state';
import { pipelineEvents, uiEvents } from './events';
import { decodeName, encodeName } from './utils';

export const loadPlugins = (
  worldConfig: ILoaderConfig,
  state$: Observable<LoaderState>,
  logger: ILogger,
) => {
  return state$
    .pipe(getStateSlice('modules'), withLatestFrom(state$.pipe(getStateSlice('plugins'))))
    .pipe(
      mergeMap(([mods, plugins]) => {
        const pluginMods = [];
        for (const [name, mod] of mods) {
          if (mod.getPlugin && typeof mod.getPlugin === 'function') {
            pluginMods.push({
              name,
              mod,
              plugins,
            });
          }
        }
        return from(pluginMods);
      }),
      tap(async results => {
        const { mod, plugins } = results;
        const plugin = await mod.getPlugin({
          worldConfig,
          logger,
          uiEvents,
          encodeAppName: encodeName,
          decodeAppName: decodeName,
        });
        for (const [k, v] of Object.entries(plugin)) {
          if (plugins.hasOwnProperty(k)) {
            // plugin already loaded
            // @TODO: the plugin's namespace should be inferred
            // from it's parent app name or the plugin's name
            continue;
          }
          plugins[k] = v;
        }
        pipelineEvents.next({
          plugins,
        });
      }),
    );
};
