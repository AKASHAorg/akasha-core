import '@akashaorg/ui/main.css';
import '@akashaorg/ui/globals.css';

import { getWorldConfig } from './get-world-config';
import { akashaWorldConfig } from './akasha-world.conf';


/**
 * Replace this world id to permanently load
 * an existing configuration
 **/
const WORLD_ID = null;

// declare const __DEV__: boolean;
// declare const __LOAD_LOCAL_SOURCES__: boolean;

(async function bootstrap(System) {
  const { default: AppLoader } = await System.import('@akashaorg/ui-app-loader');
  const { default: getSDK } = await System.import('@akashaorg/core-sdk');
  const sdk = getSDK();
  console.log('initial sdk instance', sdk);

  let worldConfig = akashaWorldConfig;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // previewing a world always takes precedence over everything else
  const previewWorldId = urlParams.get('previewWorldId') || WORLD_ID;

  if (previewWorldId) {
    try {
      const previewConfig = await getWorldConfig(previewWorldId);
      if (!previewConfig) {
        // show an error message?
        console.error('World config not found.');
        return;
      }
      worldConfig = previewConfig;
    } catch (err) {
      console.error('cannot load preview', err);
    }
  }

  const appLoader = new AppLoader(worldConfig);
  console.log('Starting world:', WORLD_ID, 'with config:', worldConfig);
  appLoader.start();

  // @TODO: add back the registry overrides ??
  // let registryOverrides: (Partial<AkashaApp> & { source: string })[] = [];
  // if (__DEV__ || __LOAD_LOCAL_SOURCES__) {
  //   registryOverrides = (await import('./registry-overrides')).default;
  // }

  // @ts-ignore-next-line
})(globalThis.System);
