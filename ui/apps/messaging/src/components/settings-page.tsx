import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { MESSAGING } from '../routes';

const { BasicCardBox, Box, Icon, Text } = DS;

const InboxPage = (props: RootComponentProps) => {
  const { t } = useTranslation('app-messaging');

  const navigateTo = props.plugins.routing?.navigateTo;

  const onChevronLeftClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes[MESSAGING],
    });
  };

  // @TODO: get used storage
  const storageUsed = 0;

  return (
    <BasicCardBox style={{ maxHeight: '92vh' }}>
      <Box
        direction="row"
        pad="medium"
        align="center"
        border={{ side: 'bottom', color: 'lightBorder' }}
      >
        <Icon type="chevronLeft" onClick={onChevronLeftClick} />
        <Text weight="bold" size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
          {t('Message App Settings')}
        </Text>
      </Box>
      <Box border={{ side: 'bottom', color: 'lightBorder' }} pad="medium">
        <Text weight={'bold'}>{t('Storage and data')}</Text>
      </Box>
      <Box
        border={{ side: 'bottom', color: 'lightBorder' }}
        pad="medium"
        margin={{ left: 'small' }}
        direction="row"
        justify="between"
      >
        <Text weight={'bold'}>{t('Message storage')}</Text>
        <Text>{`${storageUsed} GB of 5 GB used`}</Text>
      </Box>
    </BasicCardBox>
  );
};

export default InboxPage;
