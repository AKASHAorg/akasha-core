import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import BecomeModeratorIntro from '../components/moderator/become-moderator/intro';
import BMSelectReason from '../components/moderator/become-moderator/reason';
import BMContactInfo from '../components/moderator/become-moderator/contact-info';
import BMConfirmation from '../components/moderator/become-moderator/confirmation';
import BMSelectCategory from '../components/moderator/become-moderator/select-category';

import { HOME } from '../routes';
import { reasons, preSelectedReasons } from '../utils/reasons';

export interface IBecomeModeratorPageProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

export const BecomeModeratorPage: React.FC<IBecomeModeratorPageProps> = props => {
  const { navigateTo } = props;

  const [activeStep, setActiveStep] = useState(0);

  // const { t } = useTranslation('app-moderation-ewa');

  const stepLabels = ['intro', 'select_categories', 'contact_info'];

  const categories = reasons.map(reason => ({
    value: reason,
    label: reason,
  }));

  const selectedCategories = preSelectedReasons.map(el => ({
    value: el,
    label: el,
  }));

  const handleCodeOfConductClick = () => {
    navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: routes => routes.codeOfConduct,
    });
  };

  const handleFillFromProfileClick = () => {
    /** do something */
  };

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[HOME],
    });
  };

  const handleConfirmButtonClick = () => {
    if (activeStep === 4) {
      return navigateTo?.({
        appName: '@akashaorg/app-moderation-ewa',
        getNavigationUrl: routes => routes[HOME],
      });
    }
    setActiveStep(activeStep + 1);
  };

  return (
    <>
      {activeStep === 0 && (
        <BecomeModeratorIntro
          titleLabel="Becoming a moderator"
          subtitle1Label="Becoming a moderator means that you will be responsible to protect the community from harmful contents that violate our"
          codeOfConductLabel="Code of Conduct"
          subtitle2Label="Make sure that you have fully understood our values and our code of conduct before applying!"
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Continue"
          onCodeOfConductClick={handleCodeOfConductClick}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 1 && (
        <BMSelectReason
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel="Why you want to become a moderator?"
          subtitleLabel="Telling the admin why you want to become a moderator will make your application look stronger"
          reasonCaption="1000 words Max."
          reasonPlaceholderLabel="I would like to apply because..."
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Continue"
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 2 && (
        <BMSelectCategory
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel="Your Moderation Category"
          subtitleLabel="When you select any category, you will be able to moderate any reported content that belongs to that category."
          selectedCategories={selectedCategories}
          moderationCategories={categories}
          allCategoriesLabel="All categories"
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Continue"
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 3 && (
        <BMContactInfo
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel="Your Contact Information"
          subtitleLabel="AKASHA members will be able to contact you in case of a moderation incident"
          discordLabel="Discord Username"
          discordPlaceholderLabel="your discord username"
          emailLabel="Email"
          emailPlaceholderLabel="example@example.com"
          fillFromProfileLabel="Fill info from profile"
          checks={[
            'I have read and completely understood the code of conduct',
            'I understand that if I violate the rules, I will be revoked as a moderator.',
          ]}
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Submit"
          onFillFromProfileClick={handleFillFromProfileClick}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 4 && (
        <BMConfirmation
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel="Application Successfully Submitted"
          subtitle1Label="Your application will be reviewed by the admin and you will receive feedback shortly. To check your application status, you can click"
          hereLabel="here"
          subtitle2Label="or by visiting the"
          overviewPageLabel="moderation overview"
          subtitle3Label="page"
          confirmButtonLabel="Continue"
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}
    </>
  );
};
