import { GetAppsByPublisherDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { AkashaAppEdge } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const isEdgeList = (
  resp: GetAppsByPublisherDidQuery,
): resp is { node: { akashaAppList: { edges: AkashaAppEdge[] } } } => {
  return (
    resp?.node !== undefined &&
    'akashaAppList' in resp.node &&
    resp?.node.akashaAppList.edges !== undefined &&
    Array.isArray(resp?.node.akashaAppList.edges)
  );
};

export const selectAppDisplayName = (respData: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(respData)) {
    return respData.node.akashaAppList.edges[0]?.node.displayName;
  }
};

export const selectAppPublisher = (respData: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(respData)) {
    return respData.node.akashaAppList.edges[0]?.node.author;
  }
};

export const selectAppType = (respData: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(respData)) {
    return respData.node.akashaAppList.edges[0]?.node.applicationType;
  }
};

export const selectPublisherName = (data: GetAppsByPublisherDidQuery) => {
  const author = selectAppPublisher(data);
  if (!author) {
    return 'Unknown';
  }
  if (author.akashaProfile) {
    return author.akashaProfile.name;
  }
  return author.id;
};

export const selectAppLogoImage = (data: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(data)) {
    const firstEdge = data.node.akashaAppList.edges[0];
    if (firstEdge?.node.logoImage) {
      return firstEdge.node.logoImage;
    }
    return null;
  }
  return null;
};

export const selectAkashaApp = (data: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(data)) {
    return data.node.akashaAppList.edges[0]?.node;
  }
};

export const selectAppVersion = (appInfo: GetAppsByPublisherDidQuery) => {
  return selectAkashaApp(appInfo).version;
};
