import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import PageLayout from './base-layout';
import { ISettingsItem, settingsItems, SettingsOption } from '../../utils/settings-items';
import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation('app-settings-ewa');
  const { getRoutingPlugin } = useRootComponentProps();
  const { data: loginData } = useGetLogin();
  const isLoggedIn = !!loginData?.id;

  const settingsOptions: ISettingsItem[] = React.useMemo(() => {
    if (!isLoggedIn) return settingsItems.filter(item => item.label !== 'NSFW Content');
    return settingsItems;
  }, [isLoggedIn]);

  const handleSettingsOptionClick = (option: SettingsOption) => () => {
    return getRoutingPlugin().navigateTo?.({
      appName: '@akashaorg/app-settings-ewa',
      getNavigationUrl: navRoutes => navRoutes[option],
    });
  };

  return (
    <PageLayout title={t('Settings')}>
      <Stack padding="px-4">
        {settingsOptions.map((item: ISettingsItem, idx: number) => {
          const baseStyle = `flex py-4 justify-between items-center ${
            idx !== settingsOptions.length - 1
              ? 'border(b-1 solid grey8 dark:grey5)'
              : 'border-none'
          }`;

          const children = (
            <>
              <Text>{`${t('{{itemLabel}}', { itemLabel: item.label as string })}`}</Text>
              {!item.isSubheading && <Icon icon={<ChevronRightIcon />} accentColor={true} />}
            </>
          );

          return (
            <React.Fragment key={`${idx}${item.label}`}>
              {item.clickable && (
                <Button
                  plain={true}
                  customStyle={`w-full ${baseStyle}`}
                  onClick={handleSettingsOptionClick(item.label)}
                >
                  {children}
                </Button>
              )}
              {!item.clickable && <Stack customStyle={baseStyle}>{children}</Stack>}
            </React.Fragment>
          );
        })}
      </Stack>
    </PageLayout>
  );
};

export default SettingsPage;
