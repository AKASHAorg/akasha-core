import React, { useEffect, useState } from 'react';
import TabList from '@akashaorg/design-system-core/lib/components/TabList';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import MessageCard from '@akashaorg/design-system-core/lib/components/MessageCard';
import routes, { APPS, EXPLORE, MY_APPS, MY_WIDGETS } from '../../routes';
import { useTranslation } from 'react-i18next';
import { NavigateToParams, RootComponentProps } from '@akashaorg/typings/ui';

import { useLocation } from 'react-router';
import { useDismissedCard } from '@akashaorg/ui-awf-hooks';

export interface MasterPageProps extends RootComponentProps {
  isLoggedIn: boolean;
  navigateTo: (args: NavigateToParams) => void;
}

const TAB_INDEX_TO_ROUTE_MAP = {
  0: [routes[EXPLORE]],
  1: [routes[MY_APPS]],
  2: [routes[APPS]],
  3: [routes[MY_WIDGETS]],
};

const ROUTE_TO_TAB_INDEX_MAP: Record<string, number> = {
  [routes[EXPLORE]]: 0,
  [routes[MY_APPS]]: 1,
  [routes[APPS]]: 2,
  [routes[MY_WIDGETS]]: 3,
};

const MasterPage: React.FC<React.PropsWithChildren<MasterPageProps>> = props => {
  const { isLoggedIn, navigateTo, navigateToModal, children } = props;

  const { t } = useTranslation('app-akasha-verse');
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    isLoggedIn ? ROUTE_TO_TAB_INDEX_MAP[location.pathname] || 0 : 0,
  );

  const [dismissed, dismissCard] = useDismissedCard('@akashaorg/app-akasha-verse_welcome-message');

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const handleTabChange = (selectedIndex: number) => {
    if (navigateTo) {
      navigateTo({
        appName: '@akashaorg/app-akasha-verse',
        getNavigationUrl: () => TAB_INDEX_TO_ROUTE_MAP[selectedIndex],
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== routes[EXPLORE]) {
      if (navigateTo) {
        navigateTo({
          appName: '@akashaorg/app-akasha-verse',
          getNavigationUrl: () => routes[EXPLORE],
        });
      }
    }
  }, [isLoggedIn, location.pathname, navigateTo]);

  return (
    <Stack spacing="gap-y-2">
      {!dismissed && (
        <MessageCard
          title={t('Welcome to AKASHAVerse')}
          message={t(
            'You can get great additions and new apps from here, you can also develop and make your own apps! ',
          )}
          background="secondaryLight/30"
          elevation="none"
          onClose={dismissCard}
        />
      )}
      <Card elevation="1" radius={20}>
        <TabList
          selected={activeTab}
          onChange={(selectedIndex, previousIndex) => {
            if (selectedIndex !== previousIndex) {
              if (selectedIndex === 0 || isLoggedIn) {
                handleTabChange(selectedIndex);
                setActiveTab(selectedIndex);
                return;
              }
              showLoginModal();
            }
          }}
          labels={[t('Explore'), t('My Apps'), t('Apps'), t('Widgets')]}
          tabListDivider
        />
        <Stack padding={'p-4'}>{children}</Stack>
      </Card>
    </Stack>
  );
};

export default MasterPage;
