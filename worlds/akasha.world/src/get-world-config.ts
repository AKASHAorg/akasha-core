import { WorldConfig } from '@akashaorg/typings/lib/ui';
import type { Sdk } from '@akashaorg/composedb-models/lib/__generated__/graphql-api';
import { selectWorldData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-by-id-query';
import { selectWorldConfigData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-query';
import {
  selectApplicationType,
  selectAppName,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-by-id-query';
import { GetWorldConfigQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const getExtensionInfo = async (extensionId: string, gqlClient: Sdk) => {
  const extRes = await gqlClient.GetAppsByID({
    id: extensionId,
  });
  return {
    name: selectAppName(extRes),
    applicationType: selectApplicationType(extRes),
  };
};

const selectExtensionIdsFromEdges = (resp: GetWorldConfigQuery) => {
  const config = selectWorldConfigData(resp);
  if (config.extensions.edges && config.extensions.edges.length > 0) {
    return config.extensions.edges
      .map(edge => {
        if (edge && edge.node && 'id' in edge.node) {
          return edge.node.extensionID;
        }
        return null;
      })
      .filter(Boolean);
  }
};

export const getWorldConfig = async (id: string): Promise<WorldConfig | null> => {
  const { default: getSDK } = await System.import('@akashaorg/core-sdk');

  const gqlClient: Sdk = getSDK().services.gql.client;
  // GET world
  const worldInfoRes = await gqlClient.GetWorldByID({
    id: id,
  });

  const worldInfo = selectWorldData(worldInfoRes);
  if (!worldInfo) {
    return null;
  }
  const formattedWorldConfig: WorldConfig = {
    title: worldInfo.name,
    defaultApps: [],
    defaultWidgets: [],
    extensionsApp: '',
    homepageApp: '',
    layout: '',
  };

  const worldConfigRes = await gqlClient.GetWorldConfig({
    worldID: worldInfo.id,
  });

  const worldConfig = selectWorldConfigData(worldConfigRes);

  if (!worldConfig) {
    return null;
  }

  formattedWorldConfig.homepageApp = (
    await getExtensionInfo(worldConfig.homepageExtension, gqlClient)
  ).name;
  formattedWorldConfig.layout = (
    await getExtensionInfo(worldConfig.layoutExtension, gqlClient)
  ).name;
  formattedWorldConfig.extensionsApp = (
    await getExtensionInfo(worldConfig.registryExtension, gqlClient)
  ).name;

  if (worldConfig.extensions.edges && worldConfig.extensions.edges.length === 0) {
    return formattedWorldConfig;
  }

  const extensionIds = selectExtensionIdsFromEdges(worldConfigRes);

  if (!extensionIds || extensionIds.length === 0) {
    return formattedWorldConfig;
  }

  for (const extensionId of extensionIds) {
    const extData = await getExtensionInfo(extensionId, gqlClient);
    if (!extData) {
      continue;
    }
    if (extData.applicationType === AkashaAppApplicationType.App) {
      formattedWorldConfig.defaultApps.push(extData.name);
    } else if (extData.applicationType === AkashaAppApplicationType.Widget) {
      formattedWorldConfig.defaultWidgets.push(extData.name);
    }
  }

  return formattedWorldConfig;
};
