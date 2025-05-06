import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import PageLayout from './base-layout';
import { ISettingsItem, settingsItems, SettingsOption } from '../../utils/settings-items';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation('app-settings-ewa');
  const { getCorePlugins } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;

  const settingsOptions: ISettingsItem[] = React.useMemo(() => {
    if (!isLoggedIn) return settingsItems.filter(item => item.label !== 'NSFW Content');
    return settingsItems;
  }, [isLoggedIn]);

  const handleSettingsOptionClick = (option: SettingsOption) => () => {
    return getCorePlugins().routing.navigateTo?.({
      appName: '@akashaorg/app-settings-ewa',
      getNavigationUrl: navRoutes => navRoutes[option],
    });
  };

  return (
    <PageLayout title={t('Settings')}>
      <Stack className="px-4">
        {settingsOptions.map((item: ISettingsItem, idx: number) => {
          const baseStyle = `flex py-4 justify-between items-center ${
            idx !== settingsOptions.length - 1
              ? 'border-b-1 border-solid border-grey8 dark:border-grey5'
              : 'border-none'
          }`;

          const children = (
            <>
              <Typography>{`${t('{{itemLabel}}', { itemLabel: item.label as string })}`}</Typography>
              {!item.isSubheading && <Icon icon={<ChevronRightIcon />} accentColor={true} />}
            </>
          );

          return (
            <React.Fragment key={`${idx}${item.label}`}>
              {item.clickable && (
                <button
                  onClick={handleSettingsOptionClick(item.label)}
                  className={`w-full ${baseStyle}`}
                >
                  {children}
                </button>
              )}
              {!item.clickable && <Stack className={baseStyle}>{children}</Stack>}
            </React.Fragment>
          );
        })}
      </Stack>
    </PageLayout>
  );
};

export default SettingsPage;
