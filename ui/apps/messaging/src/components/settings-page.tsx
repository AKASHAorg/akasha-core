import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  ChevronLeftIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

import { getTextileUsage } from '../api/message';
import { MESSAGING } from '../routes';

export type SettingsPageProps = {
  loggedProfileData: Profile;
};

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

const InboxPage = (props: SettingsPageProps) => {
  const { t } = useTranslation('app-messaging');
  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const uninstallAppReq = null;

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

  const handleUninstall = () => {
    uninstallAppReq.mutate('@akashaorg/app-messaging');
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => routes.defaultRoute,
    });
  };

  return (
    <Card customStyle="max-h-[92vh]">
      <Stack direction="row" align="center" customStyle="p-4 border(b grey8 dark:grey3)">
        <button onClick={onChevronLeftClick}>
          <Icon icon={<ChevronLeftIcon />} />
        </button>

        <Text variant="h5" customStyle="mx-auto">
          {t('Message App Settings')}
        </Text>
      </Stack>
      <Stack direction="row" align="center" customStyle="p-4 border(b grey8 dark:grey3)">
        <Text variant="h6">{t('Storage and data')}</Text>
      </Stack>
      <Stack direction="row" justify="between" customStyle="py-4 px-8 border(b grey8 dark:grey3)">
        <Text variant="h6">{t('Message storage')}</Text>
        {!storageTotal && <TextLine title="textileStorage" animated={false} width="80px" />}
        {storageTotal && (
          <Text>{`${convertFromBytes(storageUsed)} of ${convertFromBytes(
            storageTotal,
          )} used`}</Text>
        )}
      </Stack>
      <Stack direction="row" align="center" customStyle="p-4 border(b grey8 dark:grey3)">
        <Text weight={'bold'}>{t('Ethereum Public Key')}</Text>
      </Stack>
      <Stack direction="row" justify="between" customStyle="py-4 px-8 border(b grey8 dark:grey3)">
        <Text>{props.loggedProfileData?.did?.id}</Text>
      </Stack>
      <Stack direction="row" justify="end" customStyle="p-4">
        <Button label={t('Uninstall')} onClick={handleUninstall} icon={<XMarkIcon />} />
      </Stack>
    </Card>
  );
};

export default InboxPage;
