import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { SETTINGS } from '../routes';

const { BasicCardBox, Box, Icon, Text } = DS;

const InboxPage = (props: RootComponentProps) => {
  const { t } = useTranslation('app-messaging');

  const navigateTo = props.plugins.routing?.navigateTo;

  const handleSettingsClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes[SETTINGS],
    });
  };

  return (
    <BasicCardBox style={{ maxHeight: '92vh' }}>
      <Box pad="medium" gap="small">
        <Box direction="row" justify="between">
          <Text size="large" weight={'bold'}>
            {t('Messaging App')}
          </Text>
          <Icon type="settings" onClick={handleSettingsClick} />
        </Box>
        <Text>{t('An encrypted end to end messaging app 🔒.')}</Text>
      </Box>
    </BasicCardBox>
  );
};

export default InboxPage;
