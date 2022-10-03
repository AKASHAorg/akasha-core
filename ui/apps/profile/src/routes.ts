export const PROFILE_LIST = 'ProfileList';
export const MY_PROFILE = 'MyProfile';
export const DEV_DASHBOARD = 'DevDashboard';
export const ONBOARDING = 'Onboarding';
export const ONBOARDING_STEP_ONE = 'OnboardingStepOne';
export const ONBOARDING_STEP_TWO = 'OnboardingStepTwo';
export const ONBOARDING_STEP_THREE = 'OnboardingStepThree';
export const ONBOARDING_STEP_FOUR = 'OnboardingStepFour';
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
};
