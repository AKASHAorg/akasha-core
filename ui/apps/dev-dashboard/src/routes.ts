export const DASHBOARD = 'Dashboard';
export const ONBOARDING = 'Onboarding';
export const ONBOARDING_STEP_ONE = 'OnboardingStepOne';
export const ONBOARDING_STEP_TWO = 'OnboardingStepTwo';
export const ONBOARDING_STEP_THREE = 'OnboardingStepThree';
export const ONBOARDING_STEP_FOUR = 'OnboardingStepFour';
export const DEV_KEYS = 'DevKeys';
export const ADD_DEV_KEY = 'AddDevKey';
export const EDIT_MESSAGE_NAME = 'EditMessageName';
export const PUBLISHED_APPS = 'PublishedApps';
export const SIGN_MESSAGE = 'SignMessage';
export const VERIFY_SIGNATURE = 'VerifySignature';

export const rootRoute = '';

export default {
  [DASHBOARD]: `/dashboard`,
  [ONBOARDING]: `/onboarding`,
  [ONBOARDING_STEP_ONE]: `/onboarding/terms-and-conditions`,
  [ONBOARDING_STEP_TWO]: `/onboarding/download-cli-tool`,
  [ONBOARDING_STEP_THREE]: `/onboarding/message`,
  [ONBOARDING_STEP_FOUR]: `/onboarding/dev-key-confirmation`,
  [DEV_KEYS]: `/dev-keys`,
  [ADD_DEV_KEY]: `/dev-keys/add`,
  [EDIT_MESSAGE_NAME]: `/dev-keys/:keyId/edit`,
  [PUBLISHED_APPS]: `/published-apps`,
  [SIGN_MESSAGE]: `/sign-message`,
  [VERIFY_SIGNATURE]: `/verify-signature`,
};
