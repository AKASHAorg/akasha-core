import React, { useEffect, useState } from 'react';
import TabList from '@akashaorg/design-system-core/lib/components/TabList';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import MessageCard from '@akashaorg/design-system-core/lib/components/MessageCard';
import routes, { INSTALLED, EXTENSIONS, MY_APPS, MY_WIDGETS } from '../../routes';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Outlet, useMatchRoute } from '@tanstack/react-router';
import { useDismissedCard, useRootComponentProps, useAkashaStore } from '@akashaorg/ui-awf-hooks';

const TAB_INDEX_TO_ROUTE_MAP = {
  0: [routes[EXTENSIONS]],
  1: [routes[MY_APPS]],
  2: [routes[INSTALLED]],
  3: [routes[MY_WIDGETS]],
};

const ROUTE_TO_TAB_INDEX_MAP: Record<string, number> = {
  [routes[EXTENSIONS]]: 0,
  [routes[MY_APPS]]: 1,
  [routes[INSTALLED]]: 2,
  [routes[MY_WIDGETS]]: 3,
};

export const MainPage: React.FC = () => {
  const { t } = useTranslation('app-extensions');
  const { navigateToModal } = useRootComponentProps();
  const navigate = useNavigate();

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const [activeTab, setActiveTab] = useState(
    authenticatedDID ? ROUTE_TO_TAB_INDEX_MAP[location.pathname] || 0 : 0,
  );

  const [dismissed, dismissCard] = useDismissedCard('@akashaorg/app-akasha-verse_welcome-message');

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const handleTabChange = (selectedIndex: number) => {
    navigate({ to: TAB_INDEX_TO_ROUTE_MAP[selectedIndex] });
  };
  const matchRoute = useMatchRoute();
  useEffect(() => {
    if (!authenticatedDID && !matchRoute({ to: routes[EXTENSIONS] })) {
      navigate({ to: routes[EXTENSIONS] });
    }
  }, [authenticatedDID, navigate, matchRoute]);

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
      <Card radius={20}>
        <TabList
          selected={activeTab}
          onChange={(selectedIndex, previousIndex) => {
            if (selectedIndex !== previousIndex) {
              if (selectedIndex === 0 || authenticatedDID) {
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
        <Stack padding={'p-4'}>
          <Outlet />
        </Stack>
      </Card>
    </Stack>
  );
};
