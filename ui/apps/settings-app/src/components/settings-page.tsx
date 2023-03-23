import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import PageLayout from './base-layout';
import { ISettingsItem, settingsItems, SettingsOption } from '../utils/settings-items';

export interface BaseOption {
  titleLabel: string;
}

const SettingsPage: React.FC<BaseOption & RootComponentProps> = props => {
  const { t } = useTranslation('app-settings-ewa');

  const handleSettingsOptionClick = (option: SettingsOption) => () => {
    return props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-settings-ewa',
      getNavigationUrl: navRoutes => navRoutes[option],
    });
  };

  return (
    <PageLayout title={t('Settings')}>
      <Box customStyle="px-4">
        {settingsItems.map((item: ISettingsItem, idx: number) => {
          const baseStyle = `flex py-4 justify-between items-center ${
            idx !== settingsItems.length - 1 ? 'border(b-1 solid grey8)' : 'border-none'
          }`;

          const children = (
            <>
              <Text>{`${t('{{itemLabel}}', { itemLabel: item.label as string })}`}</Text>
              {!item.isSubheading && <Icon type="ChevronRightIcon" accentColor={true} />}
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
              {!item.clickable && <Box customStyle={baseStyle}>{children}</Box>}
            </React.Fragment>
          );
        })}
      </Box>
    </PageLayout>
  );
};

export default SettingsPage;
