import { Logger } from '@akashaorg/awf-sdk';
import type { WorldConfig } from '@akashaorg/typings/lib/ui';
import { from, mergeMap, Observable, tap, withLatestFrom } from 'rxjs';
import { getStateSlice, LoaderState } from './state';
import { pipelineEvents, uiEvents } from './events';
import { decodeName, encodeName } from './utils';

export const loadPlugins = (
  worldConfig: WorldConfig,
  state$: Observable<LoaderState>,
  logger: Logger,
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
        if (!plugins[name]) {
          try {
            const plugin = await mod.getPlugin({
              worldConfig,
              logger,
              uiEvents,
              encodeAppName: encodeName,
              decodeAppName: decodeName,
            });
            if (Object.keys(plugin).length) {
              pipelineEvents.next({
                plugins: { [name]: Object.assign({}, plugin), ...plugins },
              });
            }
          } catch (err) {
            // from this point it's on, some of the apps
            // that are using this plugin {name} will not work!

            // @todo: show error in UI?

            logger.error(`Error while loading plugin ${name}`);
            logger.error(err.message ?? err);
          }
        }
      }),
    );
};
