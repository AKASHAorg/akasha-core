import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetDevKeys } from '@akashaorg/ui-awf-hooks';

import DevProfileCard from './profile/dev-profile-card';
import { ONBOARDING_STATUS } from './onboarding/intro-card';

import menuRoute, {
  DEV_KEYS,
  ONBOARDING,
  PUBLISHED_APPS,
  SIGN_MESSAGE,
  VERIFY_SIGNATURE,
} from '../routes';

const { Box, Helmet } = DS;

const DevDashboard = (props: RootComponentProps) => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  const getKeysQuery = useGetDevKeys(true);

  const devKeys = getKeysQuery.data || [];

  const isOnboarded = React.useMemo(() => {
    return Boolean(window.localStorage.getItem(ONBOARDING_STATUS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOnboarded) {
    // if user has not been onboarded, navigate to onboarding
    return navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[ONBOARDING],
    });
  }

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Dev Dashboard | Ethereum World</title>
      </Helmet>

      <>
        <DevProfileCard
          titleLabel={t('Welcome to your developer Dashboard')}
          subtitleLabels={[
            t('Not sure where to start? Check our'),
            t('developer documentation'),
            '✨',
          ]}
          cardMenuItems={[
            {
              label: t('Dev Keys'),
              route: DEV_KEYS,
              value: devKeys,
            },
            {
              label: t('Published Apps'),
              route: PUBLISHED_APPS,
            },
            { label: t('Sign a Message'), route: SIGN_MESSAGE },
            { label: t('Verify a Signature'), route: VERIFY_SIGNATURE },
          ]}
          ctaUrl="https://akasha-docs.pages.dev"
          navigateTo={navigateTo}
        />
      </>
    </Box>
  );
};

export default DevDashboard;
