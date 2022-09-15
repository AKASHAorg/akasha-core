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
        const { name, mod, plugins } = results;
        const plugin = await mod.getPlugin({
          worldConfig,
          logger,
          uiEvents,
          encodeAppName: encodeName,
          decodeAppName: decodeName,
        });
        const plugs = {};
        for (const [k, v] of Object.entries(plugin)) {
          if (!plugins[name] || !plugins[name].hasOwnProperty(k)) {
            plugs[k] = v;
          }
        }
        if (Object.keys(plugs).length) {
          pipelineEvents.next({
            plugins: { [name]: Object.assign({}, plugins[name] || {}, plugs), ...plugins },
          });
        }
      }),
    );
};
