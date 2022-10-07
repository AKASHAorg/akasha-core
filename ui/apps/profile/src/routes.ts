export const PROFILE_LIST = 'ProfileList';
export const MY_PROFILE = 'MyProfile';
export const DEV_DASHBOARD = 'DevDashboard';
export const ONBOARDING = 'Onboarding';
export const ONBOARDING_STEP_ONE = 'OnboardingStepOne';
export const ONBOARDING_STEP_TWO = 'OnboardingStepTwo';
export const ONBOARDING_STEP_THREE = 'OnboardingStepThree';
export const ONBOARDING_STEP_FOUR = 'OnboardingStepFour';
export const DEV_KEYS = 'DevKeys';
export const ADD_DEV_KEY = 'AddDevKey';
export const EDIT_MESSAGE_NAME = 'EditMessageName';
export const REMOVE_DEV_KEY = 'RemoveDevKey';
export const PUBLISHED_APPS = 'PublishedApps';
export const SIGN_MESSAGE = 'SignMessage';
export const VERIFY_SIGNATURE = 'VerifySignature';

export const baseDeveloperRoute = '/my-profile/developer';
export const rootRoute = '';

export default {
  [MY_PROFILE]: `/my-profile`,
  [DEV_DASHBOARD]: `${baseDeveloperRoute}`,
  [ONBOARDING]: `${baseDeveloperRoute}/onboarding`,
  [ONBOARDING_STEP_ONE]: `${baseDeveloperRoute}/onboarding/terms-and-conditions`,
  [ONBOARDING_STEP_TWO]: `${baseDeveloperRoute}/onboarding/download-cli-tool`,
  [ONBOARDING_STEP_THREE]: `${baseDeveloperRoute}/onboarding/message`,
  [ONBOARDING_STEP_FOUR]: `${baseDeveloperRoute}/onboarding/dev-key-confirmation`,
  [DEV_KEYS]: `${baseDeveloperRoute}/dev-keys`,
  [ADD_DEV_KEY]: `${baseDeveloperRoute}/dev-keys/add`,
  [EDIT_MESSAGE_NAME]: `${baseDeveloperRoute}/dev-keys/:pubKey/edit`,
  [REMOVE_DEV_KEY]: `${baseDeveloperRoute}/dev-keys/:pubKey/delete`,
  [PUBLISHED_APPS]: `${baseDeveloperRoute}/published-apps`,
  [SIGN_MESSAGE]: `${baseDeveloperRoute}/sign-message`,
  [VERIFY_SIGNATURE]: `${baseDeveloperRoute}/verify-signature`,
};
