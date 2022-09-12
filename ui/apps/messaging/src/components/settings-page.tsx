import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { MESSAGING } from '../routes';
import { getTextileUsage } from '../api/message';
import { LoginState, useUninstallApp } from '@akashaorg/ui-awf-hooks';

const { BasicCardBox, Box, Icon, Text, TextLine, Button } = DS;

export interface SettingsPageProps extends RootComponentProps {
  loginState: LoginState;
}

const InboxPage = (props: SettingsPageProps) => {
  const { t } = useTranslation('app-messaging');

  const navigateTo = props.plugins.routing?.navigateTo;

  const uninstallAppReq = useUninstallApp();

  const onChevronLeftClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes[MESSAGING],
    });
  };

  const [storageInfo, setStorageInfo] = React.useState(null);
  React.useEffect(() => {
    getTextileUsage().then(resp => {
      setStorageInfo(resp);
    });
  }, []);

  const storageData = storageInfo?.data?.usage?.usageMap.find(a => a[0] === 'stored_data')[1];
  const storageUsed = storageData?.total;
  const storageTotal = storageData?.free;

  const convertFromBytes = val => {
    if (val) {
      const k = val > 0 ? Math.floor(Math.log2(val) / 10) : 0;
      const rank = (k > 0 ? 'KMGT'[k - 1] : '') + 'b';
      const count = (val / Math.pow(1024, k)).toFixed(2);
      return `${count} ${rank}`;
    }
    if (val == 0) {
      return `${val} Kb`;
    }
  };

  const handleUninstall = () => {
    uninstallAppReq.mutate('@akashaorg/app-messaging');
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => routes.defaultRoute,
    });
  };

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
        pad={{ horizontal: 'xlarge', vertical: 'medium' }}
        direction="row"
        justify="between"
      >
        <Text weight={'bold'}>{t('Message storage')}</Text>
        {!storageTotal && <TextLine title="textileStorage" animated={false} width="80px" />}
        {storageTotal && (
          <Text>{`${convertFromBytes(storageUsed)} of ${convertFromBytes(
            storageTotal,
          )} used`}</Text>
        )}
      </Box>
      <Box border={{ side: 'bottom', color: 'lightBorder' }} pad="medium">
        <Text weight={'bold'}>{t('Ethereum Public Key')}</Text>
      </Box>
      <Box
        border={{ side: 'bottom', color: 'lightBorder' }}
        pad={{ horizontal: 'xlarge', vertical: 'medium' }}
        direction="row"
        justify="between"
      >
        <Text>{props.loginState.ethAddress}</Text>
      </Box>
      <Box direction="row" justify="end" pad="medium">
        <Button
          label={t('Uninstall')}
          icon={<Icon type="close" accentColor={true} onClick={handleUninstall} />}
        />
      </Box>
    </BasicCardBox>
  );
};

export default InboxPage;
