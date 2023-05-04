import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation('app-moderation-ewa');

  const categories = reasons.map(reason => ({
    value: reason,
    label: t('{{label}}', { label: reason }),
  }));

  const selectedCategories = preSelectedReasons.map(el => ({
    value: el ?? '',
    label: t('{{el}}', { el: el ?? '' }),
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
          titleLabel={t('Becoming a moderator')}
          subtitle1Label={t(
            'Becoming a moderator means that you will be responsible to protect the community from harmful contents that violate our',
          )}
          codeOfConductLabel={t('Code of Conduct')}
          subtitle2Label={t(
            'Make sure that you have fully understood our values and our code of conduct before applying!',
          )}
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Continue"
          onCodeOfConductClick={handleCodeOfConductClick}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 1 && (
        <BMSelectReason
          titleLabel={t('Why you want to become a moderator?')}
          subtitleLabel={t(
            'Telling the admin why you want to become a moderator will make your application look stronger',
          )}
          reasonCaption={t('1000 words Max.')}
          reasonPlaceholderLabel={t('I would like to apply because...')}
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Continue"
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 2 && (
        <BMSelectCategory
          titleLabel={t('Your Moderation Category')}
          subtitleLabel={t(
            'When you select any category, you will be able to moderate any reported content that belongs to that category.',
          )}
          selectedCategories={selectedCategories}
          moderationCategories={categories}
          allCategoriesLabel={t('All categories')}
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Continue"
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 3 && (
        <BMContactInfo
          titleLabel={t('Your Contact Information')}
          subtitleLabel={t(
            'AKASHA members will be able to contact you in case of a moderation incident',
          )}
          discordLabel={t('Discord Username')}
          discordPlaceholderLabel={t('your discord username')}
          emailLabel={t('Email')}
          emailPlaceholderLabel={t('example@example.com')}
          fillFromProfileLabel={t('Fill info from profile')}
          checks={[
            'I have read and completely understood the code of conduct',
            'I understand that if I violate the rules, I will be revoked as a moderator.',
          ].map(check => t('{{check}}', { check }))}
          cancelButtonLabel="Cancel"
          confirmButtonLabel="Submit"
          onFillFromProfileClick={handleFillFromProfileClick}
          onCancelButtonClick={handleCancelButtonClick}
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}

      {activeStep === 4 && (
        <BMConfirmation
          titleLabel={t('Application Successfully Submitted')}
          subtitle1Label={t(
            'Your application will be reviewed by the admin and you will receive feedback shortly. To check your application status, you can click',
          )}
          hereLabel={t('here')}
          subtitle2Label={t('or by visiting the')}
          overviewPageLabel={t('moderation overview')}
          subtitle3Label={t('page')}
          confirmButtonLabel="Continue"
          onConfirmButtonClick={handleConfirmButtonClick}
        />
      )}
    </>
  );
};
