import getSDK from '@akashaproject/awf-sdk';
import { ILoaderConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { hidePageSplash, showPageSplash } from './splash-screen';
import { catchError, merge } from 'rxjs';
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
import { handleModalMount, handleModalRequest } from './modals';
import { handleExtPointMountOfExtensions } from './extensions';
import { handleAppLoadingScreens } from './ui-state-utils';

/**
 * App loader is the central module for micro-frontends (apps)
 * Built as a layer over the single-spa library, it provides the required functionality
 * to install/uninstall, load/unload apps, widgets and plugins.
 * @example
 * ```
 * import startLoader from '@akashaproject/ui-app-loader';
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
    // get integration info from registry
    getDefaultIntegrationManifests(worldConfig, logger),

    // get user installed integrations after login
    getUserIntegrationManifests(worldConfig, state$, logger),

    // import+register+singleSpaRegister layout
    loadLayout(worldConfig, state$, logger),

    // import integrations just after we have the layout config
    // aka. after calling the register on layout
    importIntegrations(state$, logger),

    // call the exported `register` method on all integrations
    // extract extensions
    processSystemModules(worldConfig, state$, logger),

    // register apps to single-spa
    // based on mountedExtensionPoints from state
    handleExtPointMountOfApps(worldConfig, state$, logger),

    // register extensions to single-spa
    // based on mountedExtensionPoints from state
    handleExtPointMountOfExtensions(worldConfig, state$, logger),

    handleModalRequest(worldConfig, state$, logger),
    handleModalMount(state$, logger),

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
