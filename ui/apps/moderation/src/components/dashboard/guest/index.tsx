import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { NavigateToParams } from '@akashaorg/typings/ui';

const { ModerationIntroCard } = DS;

export interface IGuestProps {
  navigateTo: (args: NavigateToParams) => void;
}

const GuestDashboard: React.FC<IGuestProps> = props => {
  const { navigateTo } = props;
  const { t } = useTranslation('app-moderation-ewa');

  const handleCodeOfConductClick = () => {
    navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: routes => routes.codeOfConduct,
    });
  };

  return (
    <ModerationIntroCard
      titleLabel={t('Moderating')}
      subtitleLabel={t('Welcome to the Dashboard')}
      introLabel={t('Are you interested in Moderating?')}
      descriptionLine1Label={t(
        "We are currently creating new Moderating Systems for Ethereum World. If you'd like to join us click",
      )}
      ctaLabel="here"
      ctaUrl="https://www.notion.so/akasha-foundation/The-AKASHA-Moderating-Open-Design-Challenge-15cb49cf57e740be92534958828ca210"
      descriptionLine2IntroLabel={t('Visit our')}
      codeOfConductLabel={t('Code of Conduct')}
      descriptionLine2Label={t('to learn more about our moderation criteria')}
      onCodeOfConductClick={handleCodeOfConductClick}
    />
  );
};

export default GuestDashboard;
