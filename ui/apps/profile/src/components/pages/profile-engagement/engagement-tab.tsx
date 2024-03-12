import React, { useState, PropsWithChildren } from 'react';
import TabList from '@akashaorg/design-system-core/lib/components/TabList';
import routes, { FOLLOWERS, FOLLOWING } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { NavigateToParams } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';

export type EngagementTabProps = {
  profileId?: string;
  navigateTo?: (args: NavigateToParams) => void;
};

const TAB_INDEX_TO_ROUTE_MAP = {
  0: [routes[FOLLOWERS]],
  1: [routes[FOLLOWING]],
};

const ROUTE_TO_TAB_INDEX_MAP: Record<string, number> = {
  [routes[FOLLOWERS]]: 0,
  [routes[FOLLOWING]]: 1,
};

const EngagementTab: React.FC<PropsWithChildren<EngagementTabProps>> = props => {
  const { profileId, children, navigateTo } = props;
  const { t } = useTranslation('app-profile');

  const pathname = location.pathname.substring(location.pathname.lastIndexOf('/'));

  const [activeTab, setActiveTab] = useState(ROUTE_TO_TAB_INDEX_MAP[pathname] || 0);

  const onTabChange = (selectedIndex: number) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes =>
        `${navRoutes.rootRoute}/${profileId}${TAB_INDEX_TO_ROUTE_MAP[selectedIndex]}`,
    });
  };

  return (
    <>
      <TabList
        selected={activeTab}
        labels={[t('Followers'), t('Following')]}
        onChange={selectedIndex => {
          setActiveTab(selectedIndex);
          onTabChange(selectedIndex);
        }}
        customStyle="sticky bg(white dark:grey2) top-52 z-10"
      />
      <Stack padding="px-4 pb-4" customStyle="mt-4">
        {children}
      </Stack>
    </>
  );
};

export default EngagementTab;
