import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import { ISharedModerationProps } from '../interfaces';

import routes, { GUEST, HOME } from '../routes';

const { ModerationIntroCard } = DS;

const IntroPage: React.FC<ISharedModerationProps & RootComponentProps> = props => {
  const { user, isAuthorised, plugins } = props;
  const { t } = useTranslation('app-moderation-ewa');

  const routing = plugins['@akashaorg/app-routing']?.routing;

  React.useEffect(() => {
    if (user && isAuthorised) {
      // if authenticated and authorised, navigate to dashboard
      routing.navigateTo({
        appName: '@akashaorg/app-moderation-ewa',
        getNavigationUrl: () => routes[HOME],
      });
    }
    if (user && !isAuthorised) {
      // if authenticated and !authorised, navigate to guest page
      routing.navigateTo({
        appName: '@akashaorg/app-moderation-ewa',
        getNavigationUrl: () => routes[GUEST],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAuthorised]);

  const handleCodeOfConductClick = () => {
    routing.navigateTo({
      appName: 'Legal',
      getNavigationUrl: () => '/legal/code-of-conduct',
    });
  };

  return (
    <ModerationIntroCard
      titleLabel={t('Moderating')}
      subtitleLabel={t('Welcome to the Dashboard')}
      isIntro={true}
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

export default IntroPage;
