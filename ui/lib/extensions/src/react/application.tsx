import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useRoutingEvents } from './use-routing-events';
import { IAppConfig, InstalledAppStorePlugin } from '@akashaorg/typings/lib/ui';
import { IntegrationReleaseInfoFragmentFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';
import getSDK from '@akashaorg/awf-sdk';
import { createRoot } from 'react-dom/client';

export type CheckActivityOptions = {
  config: IAppConfig;
  encodedAppName: string;
  manifest?: IntegrationReleaseInfoFragmentFragment;
  location?: Location;
};

export const checkActivityFn = (opts: CheckActivityOptions, singleSpa) => {
  const { config, encodedAppName, manifest } = opts;
  let { location } = opts;

  if (!location) {
    location = window.location;
  }

  if (manifest && manifest.hasOwnProperty('enabled') && manifest.enabled === false) {
    return false;
  }

  if (config.hasOwnProperty('activeWhen') && typeof config.activeWhen === 'function') {
    return config.activeWhen(location, (path, exact?: boolean) => {
      // path can contain the app name;
      return singleSpa.pathToActiveWhen(path, exact);
    });
  }

  return singleSpa.pathToActiveWhen(`/${encodedAppName}`)(location);
};

export const Application = () => {
  const { getExtensionsPlugin, getContext } = useRootComponentProps();
  const { singleSpa, layoutConfig } = getContext();
  const installedAppStore = React.useRef<InstalledAppStorePlugin>(
    getExtensionsPlugin().installedAppStore,
  );

  const location = useRoutingEvents();

  React.useEffect(() => {
    for (const app of installedAppStore.current.getInstalledApps()) {
      if (typeof app.config.loadingFn === 'undefined') continue;
      const appsNode = document.getElementById(layoutConfig.pluginSlotId);
      const appNode = appsNode.querySelector(`#${nameToId(app.manifest.name)}`);

      if (!appNode) {
        const rootNode = document.createElement('div');
        rootNode.id = nameToId(app.manifest.name);
        appsNode.appendChild(rootNode);
      }

      const appCustomProps = {
        ...getContext(),
        name: app.manifest.name,
        baseRouteName: `/${app.manifest.name}`,
        domElementGetter: () => appNode,
      };

      singleSpa.registerApplication({
        name: app.manifest.name,
        app: app.config.loadingFn,
        activeWhen: (location: Location) =>
          checkActivityFn(
            {
              config: app.config,
              encodedAppName: decodeURIComponent(app.manifest.name),
              manifest: app.manifest,
              location,
            },
            singleSpa,
          ),
        customProps: appCustomProps,
      });
    }
  }, [getContext, singleSpa]);

  return null;
};

const nameToId = (name: string) => name.replace('@', '').replace('/', '-');
