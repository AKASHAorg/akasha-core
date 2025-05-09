import React, { PropsWithChildren, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@akashaorg/ui/lib/components/tabs';

import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { useTranslation } from 'react-i18next';
import { useMatchRoute, useNavigate, useRouterState } from '@tanstack/react-router';

export type EngagementTabProps = {
  profileDID: string;
};

const EngagementTab: React.FC<PropsWithChildren<EngagementTabProps>> = props => {
  const { profileDID, children } = props;
  const { t } = useTranslation('app-profile');

  const navigate = useNavigate();

  const matchRoute = useMatchRoute();

  const state = useRouterState();

  const activeTab = useMemo(() => {
    if (matchRoute({ to: '/$profileDID/followers', pending: !!state.pendingMatches })) {
      return '0';
    }
    if (matchRoute({ to: '/$profileDID/following', pending: !!state.pendingMatches })) {
      return '1';
    }
  }, [matchRoute, state]);

  const onTabChange = (selectedIndex: string) => {
    switch (selectedIndex) {
      case '0':
        navigate({ to: '/$profileDID/followers', params: { profileDID } });
        break;
      case '1':
        navigate({ to: '/$profileDID/following', params: { profileDID } });
        break;
    }
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full mx-4">
        <TabsList className="px-4 justify-between w-[95%]">
          {[t('Followers'), t('Following')].map((item, index) => (
            <TabsTrigger key={item} value={`${index}`} className="grow">
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Stack className="my-4">{children}</Stack>
    </>
  );
};

export default EngagementTab;
