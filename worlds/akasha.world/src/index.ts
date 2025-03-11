import '@akashaorg/ui/main.css';
import '@akashaorg/ui/globals.css';

import { getWorldConfig } from './get-world-config';
import { akashaWorldConfig } from './akasha-world.conf';
import { AkashaApp } from '@akashaorg/typings/lib/sdk/graphql-types-new';

/**
 * Replace this world id to permanently load
 * an existing configuration
 **/
const WORLD_ID = null;

declare const __LOAD_LOCAL_SOURCES__: boolean;

(async function bootstrap(System) {
  const { default: AppLoader } = await System.import('@akashaorg/ui-app-loader');
  const { default: getSDK } = await System.import('@akashaorg/core-sdk');
  const sdk = getSDK();
  console.log('initial sdk instance', sdk);

  let worldConfig = akashaWorldConfig;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const storageWorldId = sessionStorage.getItem('previewWorldId');

  // previewing a world always takes precedence over everything else
  const worldId = urlParams.get('previewWorldId') || storageWorldId || WORLD_ID;

  if (urlParams.has('previewWorldId') && worldId && worldId !== storageWorldId) {
    // save the world id to the session storage
    sessionStorage.setItem('previewWorldId', worldId);
  }

  if (worldId) {
    try {
      const previewConfig = await getWorldConfig(worldId);
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

  let registryOverrides: (Partial<AkashaApp> & { source: string })[] = [];
  if (__LOAD_LOCAL_SOURCES__) {
    registryOverrides = (await import('./registry-overrides')).default;
  }

  const appLoader = new AppLoader({
    ...worldConfig,
    isPreview: !!sessionStorage.getItem('previewWorldId'),
    registryOverrides,
  });

  console.log('Starting world:', worldId ?? 'default', 'with config:', {
    ...worldConfig,
    isPreview: !!sessionStorage.getItem('previewWorldId'),
  });

  appLoader.start();

  // @ts-expect-error Systemjs exists in the global scope
})(globalThis.System);
