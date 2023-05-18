import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NavigateToParams } from '@akashaorg/typings/ui';
import { useModerationCategory } from '@akashaorg/ui-awf-hooks';

import BMIntro from '../components/moderator/become-moderator/intro';
import BMSelectReason from '../components/moderator/become-moderator/reason';
import BMSelectCategory from '../components/moderator/become-moderator/select-category';
import BMContactInfo from '../components/moderator/become-moderator/contact-info';
import BMConfirmation from '../components/moderator/become-moderator/confirmation';

import { HOME } from '../routes';
import { reasons } from '../utils/reasons';
import { BMConfirmationSubtitles, BMIntroSubtitles } from '../utils';

export interface IBecomeModeratorPageProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

export const BecomeModeratorPage: React.FC<IBecomeModeratorPageProps> = props => {
  const { navigateTo } = props;

  const [activeStep, setActiveStep] = useState(0);

  const checks = [
    'I have read and completely understood the code of conduct',
    'I understand that if I violate the rules, I will be revoked as a moderator.',
  ];

  const [checkedState, setCheckedState] = React.useState(Array(checks.length).fill(false));

  const { t } = useTranslation('app-moderation-ewa');

  const stepLabels = ['intro', 'select_categories', 'contact_info'];

  const moderationCategories = reasons.map(({ title }) => ({
    value: title,
    label: t('{{title}}', { title }),
  }));

  const allCategoriesLabel = t('All Categories');

  const { categories, handleCategoryClick } = useModerationCategory({
    moderationCategories,
    allCategoriesLabel,
  });

  const handleCodeOfConductClick = () => () => {
    navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: routes => routes.codeOfConduct,
    });
  };

  const handleFillFromProfileClick = () => {
    /** do something */
  };

  const handleCheckBoxClick = pos => () => {
    const updatedCheckedState = checkedState.map((item, idx) => (idx === pos ? !item : item));
    setCheckedState(updatedCheckedState);
  };

  const handleLinkClick = (link: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[link],
    });
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
        <BMIntro
          titleLabel={t('Becoming a moderator')}
          subtitleLabels={BMIntroSubtitles.map(subtitle => ({
            ...subtitle,
            label: t('{{label}}', { label: subtitle.label }),
          }))}
          cancelButtonLabel={t('Cancel')}
          confirmButtonLabel={t('Continue')}
          onLinkClick={handleCodeOfConductClick}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 1 && (
        <BMSelectReason
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel={t('Why do you want to become a moderator?')}
          subtitleLabel={t(
            'Telling the admin why you want to become a moderator will make your application look stronger',
          )}
          reasonCaption={`${t('1000 words Max')}.`}
          reasonPlaceholderLabel={`${t('I would like to apply because')}...`}
          cancelButtonLabel={t('Cancel')}
          confirmButtonLabel={t('Continue')}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 2 && (
        <BMSelectCategory
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel={t('Your Moderation Category')}
          subtitleLabel={t(
            'When you select any category, you will be able to moderate any reported content that belongs to that category.',
          )}
          categories={categories}
          moderationCategories={moderationCategories}
          allCategoriesLabel={allCategoriesLabel}
          allCategoriesSelected={categories.length === moderationCategories.length}
          cancelButtonLabel={t('Cancel')}
          confirmButtonLabel={t('Continue')}
          onPillClick={handleCategoryClick}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 3 && (
        <BMContactInfo
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel={t('Your Contact Information')}
          subtitleLabel={t(
            'AKASHA members will be able to contact you in case of a moderation incident',
          )}
          discordLabel={t('Discord Username')}
          discordPlaceholderLabel={t('your discord username')}
          emailLabel={t('Email')}
          emailPlaceholderLabel={t('example@example.com')}
          fillFromProfileLabel={t('Fill info from profile')}
          checks={checks.map(check => t('{{check}}', { check }))}
          checkedState={checkedState}
          cancelButtonLabel={t('Cancel')}
          confirmButtonLabel={t('Submit')}
          onFillFromProfileClick={handleFillFromProfileClick}
          onCheckBoxClick={handleCheckBoxClick}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 4 && (
        <BMConfirmation
          stepLabels={stepLabels}
          activeIndex={activeStep - 1}
          titleLabel={t('Application Successfully Submitted')}
          subtitleLabels={BMConfirmationSubtitles.map(subtitle => ({
            ...subtitle,
            label: t('{{label}}', { label: subtitle.label }),
          }))}
          confirmButtonLabel={t('Continue')}
          onLinkClick={handleLinkClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}
    </>
  );
};
