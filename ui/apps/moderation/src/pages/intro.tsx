import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import { ISharedModerationProps } from '../interfaces';

import routes, { GUEST, HOME, APP_NAME } from '../routes';

const { ModerationIntroCard } = DS;

const IntroPage: React.FC<ISharedModerationProps & RootComponentProps> = props => {
  const {
    user,
    isAuthorised,
    plugins: { routing },
  } = props;
  const { t } = useTranslation('app-moderation-ewa');

  React.useEffect(() => {
    if (user && isAuthorised) {
      // if authenticated and authorised, navigate to dashboard
      routing.navigateTo({
        appName: APP_NAME,
        getNavigationUrl: () => routes[HOME],
      });
    }
    if (user && !isAuthorised) {
      // if authenticated and !authorised, navigate to guest page
      routing.navigateTo({
        appName: APP_NAME,
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
      introLabel={t('Welcome to the Moderation App')}
      descriptionLine1Label={t(
        'Here you will find the moderated posts, replies, and accounts of Ethereum World. We do not reveal any personal information of the author or submitter(s) to protect their privacy.',
      )}
      descriptionLine2IntroLabel={t('Visit our')}
      codeOfConductLabel={t('Code of Conduct')}
      descriptionLine2Label={t('to learn more about our moderation criteria')}
      onCodeOfConductClick={handleCodeOfConductClick}
    />
  );
};

export default IntroPage;
