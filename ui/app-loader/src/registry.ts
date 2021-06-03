import { integrationsData } from './integration-data';
import { WidgetRegistryInfo, AppRegistryInfo } from '@akashaproject/ui-awf-typings/lib/app-loader';

/**
 * Get info about the integrations
 *
 * First it should look in a local registry
 *  if not found (eg: first time user) look into a remote registry
 *  and then store it locally
 *
 */
export const getIntegrationInfos = (
  integrations: { name: string; version: string }[],
): Promise<(WidgetRegistryInfo | AppRegistryInfo)[]> => {
  // get integration infos from somewhere
  const resp: (WidgetRegistryInfo | AppRegistryInfo)[] = integrations
    .map(integration => {
      if (integrationsData[integration.name]) {
        if (integration.version === 'latest') {
          const registryIntegration = integrationsData[integration.name];
          return {
            ...registryIntegration,
            src: registryIntegration.versions[registryIntegration.lastVersion],
          };
        }
        return {
          ...integrationsData[integration.name],
          src: integrationsData[integration.name].versions[integration.version],
        };
      }
      return null;
    })
    .filter(i => i !== null);

  return Promise.resolve(resp);
};
