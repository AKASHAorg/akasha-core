import { WorldConfig } from '@akashaorg/typings/lib/ui/app-loader.d';
import { TYPES } from '@akashaorg/typings/lib/sdk';
import { inject } from 'inversify';
import Gql from '../gql';
import { z } from 'zod';
import { validate } from '../common/validator';
import { hasOwn } from '../helpers/types';

class AWF_WORLD_CONFIG {
  private _gql: Gql;

  constructor(@inject(TYPES.Gql) gql: Gql) {
    this._gql = gql;
  }

  /**
   *
   * @param id - DID string of the World
   */
  @validate(z.string().min(3))
  async getWorldConfig(id: string): Promise<WorldConfig | null> {
    // GET world
    const worldInfoGqlObj = await this._gql.client.GetWorldByID({
      id: id,
    });
    if (!worldInfoGqlObj.node || !hasOwn(worldInfoGqlObj.node, 'id')) {
      return null;
    }
    const worldInfo = worldInfoGqlObj.node;

    // GET config of that world by worldId
    const worldConfigGqlObj = await this._gql.client.GetWorldConfig({
      worldID: worldInfo.id,
    });
    if (
      !worldConfigGqlObj.akashaWorldConfigIndex ||
      !hasOwn(worldConfigGqlObj.akashaWorldConfigIndex, 'edges')
    ) {
      return null;
    }
    // GET the first world config from the list
    const worlConfigInfoGqlObj = worldConfigGqlObj.akashaWorldConfigIndex.edges?.at(0);
    // check if it exists
    if (
      !worlConfigInfoGqlObj ||
      !worlConfigInfoGqlObj.node ||
      !hasOwn(worlConfigInfoGqlObj.node, 'id')
    ) {
      return null;
    }
    const worldConfigInfo = worlConfigInfoGqlObj.node;
    // get the extensions of the worldConfig
    const worldConfigExtensionsGqlObject = await this._gql.client.GetWorldConfigExtensions({
      configID: worldConfigInfo.id,
    });

    const extensions = worldConfigExtensionsGqlObject?.akashaWorldConfigExtensionIndex?.edges || [];
    // core extensions contains the ids of the homepageApp, layout and extensions/registry app.
    // the extensions recieved in akashaWorldConfigExtensionIndex array contain the ids of these coreExtensions that need to filter them out otherwise during AppLoader module initialisation it fetches the apps twice slowing the performance.
    const coreExtensions = [
      worldConfigInfo.layoutExtension,
      worldConfigInfo.homepageExtension,
      worldConfigInfo.registryExtension,
    ];
    const filteredExtensions = extensions.filter(
      edge =>
        edge && edge.node && edge.node.extension && typeof edge.node.extension.name === 'string',
    );
    // get name of the defaultApps
    const defaultApps: string[] = filteredExtensions
      .filter(edge => coreExtensions.indexOf(edge?.node?.extensionID) === -1)
      .map(edge => edge?.node?.extension?.name as string);
    // filter the layout the extensions and the homepageApp
    // get the extention name
    const layoutWidget = filteredExtensions.find(
      filterExtension => filterExtension?.node?.extensionID === worldConfigInfo.layoutExtension,
    );
    const homepageApp = filteredExtensions.find(
      filterExtension => filterExtension?.node?.extensionID === worldConfigInfo.homepageExtension,
    );
    const extensionsData = filteredExtensions.find(
      filterExtension => filterExtension?.node?.extensionID === worldConfigInfo.registryExtension,
    );
    return {
      title: worldInfo.name,
      extensionsApp: extensionsData?.node?.extension?.name as string,
      layout: layoutWidget?.node?.extension?.name as string,
      homepageApp: homepageApp?.node?.extension?.name as string,
      defaultApps: defaultApps,
      registryOverrides: [],
      // hard coded at the current phase of development
      defaultWidgets: [
        '@akashaorg/ui-widget-topbar',
        '@akashaorg/ui-widget-trending',
        '@akashaorg/ui-widget-analytics',
        '@akashaorg/ui-widget-sidebar',
        '@akashaorg/ui-widget-mini-profile',
        '@akashaorg/ui-widget-test-mode-notifier',
      ],
    };
  }
}
export default AWF_WORLD_CONFIG;
