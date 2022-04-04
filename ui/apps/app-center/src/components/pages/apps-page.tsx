import * as React from 'react';

import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Box, InfoCard } = DS;

const AppsPage: React.FC<RootComponentProps> = () => {
  const { t } = useTranslation('app-integration-center');
  return (
    <Box margin="medium">
      <InfoCard
        icon="appCenter"
        title={t('Welcome to the Integration Centre!')}
        suggestion={t(
          'Here you will be able to find your installed Apps, you will be able to explore new apps to add to Ethereum World.',
        )}
        noBorder={true}
      />
    </Box>
  );
};

export default AppsPage;
