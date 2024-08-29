import { TFunction } from 'i18next';

export const getReportedProgress = (
  reportedStatus: symbol,
  statusCodes: { [key: string]: symbol },
  tFunc: TFunction,
) => {
  switch (reportedStatus) {
    case statusCodes.FETCHING_EXTENSION_DATA:
      return tFunc('Fetching extension data');
    case statusCodes.IMPORTING_MODULE:
      return tFunc('Importing module');
    case statusCodes.INITIALIZING_EXTENSION:
      return tFunc('Initializing extension');
    case statusCodes.REGISTERING_EXTENSION:
      return tFunc('Registering extension');
    case statusCodes.SAVING_EXTENSION_INFO:
      return tFunc('Saving extension info');
    case statusCodes.FINALIZING_INSTALL:
      return tFunc('Finalizing install');
    case statusCodes.REGISTERING_RESOURCES:
      return tFunc('Registering resources');
    case statusCodes.REGISTERING_RESOURCES_SUCCESS:
      return tFunc('Registering resources success');
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
      errorMessage = tFunc('You need to login.');
      break;
    case statusCodes.EXTENSION_NOT_FOUND:
      errorMessage = tFunc('Extension was not found in the Extensions Registry.');
      break;
    case statusCodes.EXTENSION_FETCH_ERROR:
      errorMessage = tFunc('Cannot fetch extension information. Please try again.');
      break;
    case statusCodes.EXTENSION_DATA_INVALID:
      errorMessage = tFunc('Extension is not valid.');
      break;
    case statusCodes.EXTENSION_IMPORT_ERROR:
      errorMessage = tFunc('Failed to import the extension. Please try again.');
      break;
    case statusCodes.EXTENSION_INITIALIZATION_FAILED:
      errorMessage = tFunc('Failed to initialize extension. Please try again.');
      break;
    case statusCodes.EXTENSION_REGISTER_RESOURCES_FAILED:
      errorMessage = tFunc('Failed to register new resources for the extension. Please try again.');
      break;
    case statusCodes.EXTENSION_REGISTRATION_FAILED:
      errorMessage = tFunc('Failed to register the extension. Please try again.');
      break;
    case statusCodes.EXTENSION_INFO_SAVE_FAILED:
      errorMessage = tFunc(
        'Failed to save extension information to local database. Please try again.',
      );
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
