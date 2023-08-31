import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';

import DevProfileCard from '../components/profile/dev-profile-card';
import { ONBOARDING_STATUS } from './intro-card';

import menuRoute, {
  DEV_KEYS,
  ONBOARDING,
  PUBLISHED_APPS,
  SIGN_MESSAGE,
  VERIFY_SIGNATURE,
} from '../routes';
import { sampleDevKeys } from '../utils/dummy-data';

export const DevDashboard = () => {
  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

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
    <Box customStyle="w-full">
      <Helmet>
        <title>Dev Dashboard | AKASHA World</title>
      </Helmet>

      <>
        <DevProfileCard
          titleLabel={t('Your Developer Dashboard')}
          subtitleLabels={[
            t('Not sure where to start? Check our'),
            t('developer documentation'),
            '✨',
          ]}
          cardMenuItems={[
            {
              label: t('Dev Keys'),
              route: DEV_KEYS,
              value: sampleDevKeys,
            },
            {
              label: t('Published Apps'),
              route: PUBLISHED_APPS,
              value: 30,
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
