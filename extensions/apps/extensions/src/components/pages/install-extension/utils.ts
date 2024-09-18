import { TFunction } from 'i18next';
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
    return respData?.node?.akashaAppList.edges[0]?.node.displayName;
  }
};

export const selectAppPublisher = (respData: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(respData)) {
    return respData?.node?.akashaAppList.edges[0]?.node.author;
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

export const getReportedProgress = (
  reportedStatus: symbol,
  statusCodes: { [key: string]: symbol },
  tFunc: TFunction,
) => {
  switch (reportedStatus) {
    case statusCodes.FETCHING_EXTENSION_DATA:
      return tFunc('Retrieving latest release info...');
    case statusCodes.IMPORTING_MODULE:
      return tFunc('Importing extension modules...');
    case statusCodes.INITIALIZING_EXTENSION:
      return tFunc('Initializing extension...');
    case statusCodes.REGISTERING_EXTENSION:
      return tFunc('Registering extension and it`s plugins...');
    case statusCodes.SAVING_EXTENSION_INFO:
      return tFunc('Saving configuration...');
    case statusCodes.FINALIZING_INSTALL:
      return tFunc('Finalizing install...');
    case statusCodes.REGISTERING_RESOURCES:
      return tFunc(
        'Click the button below to authorise access to new resources. You will be prompted with 1 signature.',
      );
    case statusCodes.REGISTERING_RESOURCES_SUCCESS:
      return tFunc('You have authorised new resources. Continuing installation...');
  }
  return '';
};

export const getReportedError = (
  reportedError: { code: symbol; retryable: boolean },
  statusCodes: { [key: string]: symbol },
  tFunc: TFunction,
) => {
  let errorMessage = '';
  switch (reportedError.code) {
    case statusCodes.USER_NOT_CONNECTED:
      errorMessage = tFunc('You need to login to install new extensions.');
      break;
    case statusCodes.EXTENSION_NOT_FOUND:
      errorMessage = tFunc('Extension was not found in the Extensions Registry.');
      break;
    case statusCodes.EXTENSION_FETCH_ERROR:
      errorMessage = tFunc('Failed to retrieve release info.');
      break;
    case statusCodes.EXTENSION_DATA_INVALID:
      errorMessage = tFunc('Extension or release data is not valid.');
      break;
    case statusCodes.EXTENSION_IMPORT_ERROR:
      errorMessage = tFunc('Failed to import the extension.');
      break;
    case statusCodes.EXTENSION_INITIALIZATION_FAILED:
      errorMessage = tFunc('Failed to initialize extension.');
      break;
    case statusCodes.EXTENSION_REGISTER_RESOURCES_FAILED:
      errorMessage = tFunc('Failed to register new resources for the extension.');
      break;
    case statusCodes.EXTENSION_REGISTRATION_FAILED:
      errorMessage = tFunc('Failed to register the extension.');
      break;
    case statusCodes.EXTENSION_INFO_SAVE_FAILED:
      errorMessage = tFunc('Failed to save extension information to local database.');
      break;
    case statusCodes.EXTENSION_FINALIZATION_FAILED:
      errorMessage = tFunc(
        'There was a problem in finalizing installation. This might cause the extension return an error or to not display anything.',
      );
      break;
  }
  if (reportedError.retryable) {
    errorMessage += tFunc('Please try again..');
  }
  return errorMessage;
};
