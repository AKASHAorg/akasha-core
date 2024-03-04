import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import BMIntro from '../components/applications/become-moderator/intro';
import { BMIntroSubtitles } from '../utils';

export const BecomeModerator: React.FC<unknown> = () => {
  const [step, setStep] = useState(0);

  const { t } = useTranslation('vibes-console');
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const handleCodeOfConductClick = () => {
    navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: routes => routes.codeOfConduct,
    });
  };

  const handleConfirmButtonClick = () => {
    setStep(1);
  };

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-vibes-console',
      getNavigationUrl: () => `/applications-center`,
    });
  };

  return (
    <>
      {step === 0 && (
        <BMIntro
          titleLabel={t('Before You Apply')}
          subtitleLabels={BMIntroSubtitles.map(subtitle => ({
            ...subtitle,
            label: t('{{label}}', { label: subtitle.label }),
          }))}
          onLinkClick={handleCodeOfConductClick}
          confirmButtonLabel={t('Apply now')}
          cancelButtonLabel={t('Cancel')}
          onConfirmButtonClick={handleConfirmButtonClick}
          onCancelButtonClick={handleCancelButtonClick}
        />
      )}
    </>
  );
};
