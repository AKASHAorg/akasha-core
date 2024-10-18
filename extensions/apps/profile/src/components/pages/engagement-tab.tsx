import React, { PropsWithChildren, useMemo } from 'react';
import TabList from '@akashaorg/design-system-core/lib/components/TabList';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { useTranslation } from 'react-i18next';
import { useMatchRoute, useNavigate } from '@tanstack/react-router';

export type EngagementTabProps = {
  profileDID?: string;
};

const EngagementTab: React.FC<PropsWithChildren<EngagementTabProps>> = props => {
  const { profileDID, children } = props;
  const { t } = useTranslation('app-profile');

  const navigate = useNavigate();

  const matchRoute = useMatchRoute();

  const activeTab = useMemo(() => {
    if (matchRoute({ from: '/$profileDID/followers' })) {
      return 0;
    }
    if (matchRoute({ from: '/$profileDID/following' })) {
      return 1;
    }
    return 0;
  }, [matchRoute]);

  const onTabChange = (selectedIndex: number) => {
    switch (selectedIndex) {
      case 0:
        navigate({ to: '/$profileDID/followers', params: { profileDID } });
        break;
      case 1:
        navigate({ to: '/$profileDID/following', params: { profileDID } });
        break;
    }
  };

  return (
    <>
      <TabList
        selected={activeTab}
        labels={[t('Followers'), t('Following')]}
        onChange={selectedIndex => onTabChange(selectedIndex)}
        customStyle="sticky bg(white dark:grey2) top-52 z-10"
      />
      <Stack padding="px-4 pb-4" customStyle="mt-4">
        {children}
      </Stack>
    </>
  );
};

export default EngagementTab;
