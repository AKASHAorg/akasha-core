import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { BMConfirmation, BMDetails, BMIntro } from '../components/applications/become-moderator';
import { BMConfirmationSubtitles, BMIntroSubtitles } from '../utils';

export const BecomeModerator: React.FC<unknown> = () => {
  const [step, setStep] = useState(0);
  const [hasExp, setHasExp] = useState(null);
  const [footerChecked, setFooterChecked] = useState(false);

  const { t } = useTranslation('vibes-console');
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const handleLinkClick = (link: string) => {
    if (link.includes('values')) {
      navigateTo({
        appName: '@akashaorg/app-vibes',
        getNavigationUrl: (routes: Record<string, string>) => routes['Overview'],
      });
    } else if (link.includes('antenna')) {
      navigateTo({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: (routes: Record<string, string>) => routes.defaultRoute,
      });
    } else {
      navigateTo({
        appName: '@akashaorg/app-legal',
        getNavigationUrl: () => link,
      });
    }
  };

  const handleConfirmButtonClick = () => {
    setStep(step + 1);
  };

  const handleCancelButtonClick = () => {
    if (step === 0 || step === 2) {
      navigateTo?.({
        appName: '@akashaorg/app-vibes-console',
        getNavigationUrl: () => `/applications-center`,
      });
    } else {
      setStep(0);
    }
  };

  const handleRadioButtonClick = (value: string) => {
    setHasExp(value);
  };

  const handleCheckboxClick = () => {
    setFooterChecked(!footerChecked);
  };

  if (step === 2) {
    return (
      <BMConfirmation
        titleLabel={t('Your application has been successfully submitted')}
        descriptionLabels={[
          t('Your application is currently under review'),
          t('Keep an eye out for new notifications'),
        ]}
        subtitleLabels={BMConfirmationSubtitles.map(subtitle => ({
          ...subtitle,
          label: t('{{label}}', { label: subtitle.label }),
        }))}
        onLinkClick={handleLinkClick}
        cancelButtonLabel={t('Go back to the Application Center')}
        onCancelButtonClick={handleCancelButtonClick}
      />
    );
  }

  return (
    <>
      {step === 0 && (
        <BMIntro
          titleLabel={t('Before You Apply')}
          subtitleLabels={BMIntroSubtitles.map(subtitle => ({
            ...subtitle,
            label: t('{{label}}', { label: subtitle.label }),
          }))}
          onLinkClick={handleLinkClick}
          confirmButtonLabel={t('Apply now')}
          cancelButtonLabel={t('Cancel')}
          onConfirmButtonClick={handleConfirmButtonClick}
          onCancelButtonClick={handleCancelButtonClick}
        />
      )}
      {step === 1 && (
        <BMDetails
          label={t('Become a Moderator')}
          selectedButton={hasExp}
          footerChecked={footerChecked}
          section1={{
            title: t('Have you moderated before'),
            subtitle: t("if you have no experience, you won't be disqualified"),
            radioButtons: [
              {
                label: t('Yes'),
                value: 'Yes',
              },
              {
                label: t('No'),
                value: 'No',
              },
            ],
            extra: t('If yes, please tell us where'),
            placeholder: t('I was a moderator at'),
            caption: t('100 characters max'),
          }}
          section2={{
            title: t('In a few sentences, tell us why you want to become a moderator'),
            placeholder: t('I want to become a moderator because'),
            caption: t('200 characters max'),
          }}
          subtitleLabels={[
            {
              label: t('I commit to upholding AKASHA World'),
            },
            {
              label: t('Code of Conduct'),
              link: '/code-of-conduct',
            },
            {
              label: t('as a responsible moderator during content review.'),
            },
          ]}
          confirmButtonLabel={t('Submit')}
          cancelButtonLabel={t('Cancel')}
          confirmButtonDisabled={!(hasExp && footerChecked)}
          onLinkClick={handleLinkClick}
          onRadioButtonChange={handleRadioButtonClick}
          onCheckboxChange={handleCheckboxClick}
          onConfirmButtonClick={handleConfirmButtonClick}
          onCancelButtonClick={handleCancelButtonClick}
        />
      )}
    </>
  );
};
