export const HOME = 'General';
export const MY_ARTICLES = 'My Articles';
export const ONBOARDING = 'Onboarding';
export const ONBOARDING_STEP_ONE = 'OnboardingStepOne';
export const ONBOARDING_STEP_TWO = 'OnboardingStepTwo';
export const ONBOARDING_STEP_THREE = 'OnboardingStepThree';
export const SETTINGS = 'Settings';
export const ARTICLE = 'Article';

export const baseOnboardingRoute = '/onboarding';

export default {
  [HOME]: '/all',
  [MY_ARTICLES]: '/my-articles',
  [ONBOARDING_STEP_ONE]: `${baseOnboardingRoute}/writing-your-first-article`,
  [ONBOARDING_STEP_TWO]: `${baseOnboardingRoute}/installing-apps-for-blocks`,
  [ONBOARDING_STEP_THREE]: `${baseOnboardingRoute}/select-topics`,
  [SETTINGS]: '/settings',
  [ARTICLE]: '/article/:id',
};
