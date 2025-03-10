import '@akashaorg/ui/main.css';
import '@akashaorg/ui/globals.css';

import { WorldConfig } from '@akashaorg/typings/lib/ui';
import { AkashaApp } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import defaultWorldConfig from './default-world-config';

declare const __DEV__: boolean;
declare const __LOAD_LOCAL_SOURCES__: boolean;

(async function bootstrap(System) {
  const { default: AppLoader } = await System.import('@akashaorg/ui-app-loader');
  const { default: getSDK } = await System.import('@akashaorg/core-sdk');

  let registryOverrides: (Partial<AkashaApp> & { source: string })[] = [];

  if (__DEV__ || __LOAD_LOCAL_SOURCES__) {
    registryOverrides = (await import('./registry-overrides')).default;
  }
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const previewWorldId = urlParams.get('previewWorldId');

  // GOAL ///
  // Get world config id if it persistet in session
  // if this id is found fetch the world config data from models formatted in world config
  // load the config with the widget that will show that they are previewing this
  // the widget should have the ability to return back

  // fetch config data and format it
  const sdk = getSDK();
  let loaderConfig: WorldConfig = defaultWorldConfig;
  const worldId = previewWorldId ? previewWorldId : sessionStorage.getItem('previewWorldId');
  if (worldId) {
    sessionStorage.setItem('previewWorldId', worldId);
    try {
      loaderConfig = await sdk.services.worldConfig.getWorldConfig(worldId);
      if (!loaderConfig) console.error(`The world with id ${worldId} not found`);
    } catch (e) {
      console.log(`Error: in fetching world: ${e}`);
    }
  }

  if (registryOverrides.length > 0) {
    loaderConfig.registryOverrides = registryOverrides;
  }

  const appLoader = new AppLoader(loaderConfig);
  appLoader.start();

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', sdk);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
})(globalThis.System);
