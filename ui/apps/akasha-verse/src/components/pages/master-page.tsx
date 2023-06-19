import React, { useEffect, useState } from 'react';
import TabList from '@akashaorg/design-system-core/lib/components/TabList';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import MessageCard from '@akashaorg/design-system-core/lib/components/MessageCard';
import routes, { APPS, EXPLORE, MY_APPS, MY_WIDGETS } from '../../routes';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';
import { useLocation } from 'react-router';
import { useDismissedCard } from '@akashaorg/ui-awf-hooks';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type MasterPageProps = {
  isLoggedIn: boolean;
  onConnect: () => void;
  navigateTo: (args: NavigateToParams) => void;
};

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

const dismissedCardId = 'welcome-message';

const MasterPage: React.FC<React.PropsWithChildren<MasterPageProps>> = props => {
  const { isLoggedIn, onConnect, navigateTo, children } = props;

  const { t } = useTranslation('app-akasha-verse');
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    isLoggedIn ? ROUTE_TO_TAB_INDEX_MAP[location.pathname] || 0 : 0,
  );
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useDismissedCard();

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
    <Stack direction="column" spacing="gap-y-2">
      {!dismissed.includes(dismissedCardId) && (
        <MessageCard
          title={t('Welcome to AKASHAVerse')}
          message={t(
            'You can get great additions and new apps from here, you can also develop and make your own apps! ',
          )}
          background="secondaryLight/30"
          elevation="none"
          onClose={() => {
            setDismissed(dismissedCardId);
          }}
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
              setShowModal(true);
            }
          }}
          labels={[t('Explore'), t('My Apps'), t('Apps'), t('Widgets')]}
          tabListDivider
        />
        <Box customStyle="p-4">{children}</Box>
        <Modal
          title={{ label: t('Members only action'), variant: 'h5' }}
          show={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          actions={[
            {
              variant: 'secondary',
              label: t('Cancel'),
              onClick: () => {
                setShowModal(false);
              },
            },
            {
              variant: 'primary',
              label: 'Connect',
              onClick: onConnect,
            },
          ]}
        >
          <Text variant="body1">
            {t('Sorry! but you need to be connected in order to preform that action')}
          </Text>
        </Modal>
      </Card>
    </Stack>
  );
};

export default MasterPage;
