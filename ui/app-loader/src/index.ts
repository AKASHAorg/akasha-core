import getSDK from '@akashaorg/awf-sdk';
import { ILoaderConfig } from '@akashaorg/typings/ui';
import { hidePageSplash, showPageSplash } from './splash-screen';
import { merge } from 'rxjs';
import * as singleSpa from 'single-spa';
import { initState } from './state';

import { getDefaultIntegrationManifests, getUserIntegrationManifests } from './manifests';
import { loadLayout } from './layout';
import {
  handleDisableIntegration,
  handleEnableIntegration,
  handleExtPointMountOfApps,
  handleIntegrationUninstall,
  importIntegrations,
  processSystemModules,
} from './integrations';
import { handleAppLoadingScreens } from './ui-state-utils';

/**
 * App loader is the central module for micro-frontends (apps)
 * Built as a layer over the single-spa library, it provides the required functionality
 * to install/uninstall, load/unload apps, widgets and plugins.
 * @example
 * ```
 * import startLoader from '@akashaorg/ui-app-loader';
 * startLoader(worldConfig);
 * ```
 * @param worldConfig - {@link ILoaderConfig}
 */

const startLoader = (worldConfig: ILoaderConfig) => {
  showPageSplash();

  singleSpa.start({
    urlRerouteOnly: true,
  });

  const sdk = getSDK();
  const logger = sdk.services.log.create('AppLoader');
  const globalChannel = sdk.api.globalChannel;

  const state$ = initState(worldConfig, globalChannel);
  merge(
    /**
     * get integration info from registry
     * @internal
     */
    getDefaultIntegrationManifests(worldConfig, logger),

    /**
     * get user installed integrations after login
     * @internal
     */
    getUserIntegrationManifests(worldConfig, state$, logger),

    /**
     * import, register and singleSpaRegister the layout
     * @internal
     */
    loadLayout(worldConfig, state$, logger),

    /**
     * import integrations just after we have the layout config
     * aka. after calling the register on layout
     * @internal
     */
    importIntegrations(state$, logger),

    /**
     * call the exported `register` method on all integrations
     * extract extensions
     * @internal
     */
    processSystemModules(worldConfig, state$, logger),

    /**
     * register apps to single-spa
     * based on mountedExtensionPoints from state
     * @internal
     */
    handleExtPointMountOfApps(worldConfig, state$, logger),

    handleIntegrationUninstall(state$, logger),

    handleEnableIntegration(state$, logger),
    handleDisableIntegration(worldConfig, state$, logger),

    handleAppLoadingScreens(worldConfig, state$, logger),
  ).subscribe({
    error: err => {
      logger.error(`[index] error: ${err.message}, ${err.stack}`);
      hidePageSplash();
    },
  });
};

export default startLoader;
