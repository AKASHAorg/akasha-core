import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { RootComponentProps, EventTypes, MenuItemAreaType, IMenuItem } from '@akashaorg/typings/ui';
import { AUTH_EVENTS, WEB3_EVENTS } from '@akashaorg/typings/sdk/events';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import {
  getProfileImageVersionsWithMediaUrl,
  useGetLogin,
  useLogout,
  LOGIN_STATE_KEY,
  useDismissedCard,
} from '@akashaorg/ui-awf-hooks';
import getSDK from '@akashaorg/awf-sdk';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import { startMobileSidebarHidingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';

import ListSidebarApps from './list-sidebar-apps';
import SidebarCTACard from './cta-card';

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const {
    uiEvents,
    plugins,
    worldConfig: { defaultApps, socialLinks },
  } = props;

  const [isMobile, setIsMobile] = useState(
    window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );
  const [routeData, setRouteData] = useState(null);
  const [activeOption, setActiveOption] = useState<IMenuItem | null>(null);
  const [clickedOptions, setClickedOptions] = useState<{ name: string; route: IMenuItem }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState('Guest');

  const { t } = useTranslation('ui-widget-sidebar');

  const loginQuery = useGetLogin();
  const logoutQuery = useLogout();
  const queryClient = useQueryClient();
  const [dismissed, dismissCard] = useDismissedCard('@akashaorg/ui-widget-sidebar_cta-card');
  const myProfileQuery = useGetMyProfileQuery(null, {
    enabled: !!loginQuery.data?.id,
    select: data => data.viewer,
    onSuccess: data => {
      if (data) setIsLoading(false);
    },
  });

  const sdk = getSDK();
  const routing = plugins['@akashaorg/app-routing']?.routing;

  useEffect(() => {
    const mql = window.matchMedia(startMobileSidebarHidingBreakpoint);

    const resize = () => {
      setIsMobile(mql.matches);
    };

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const subSDK = sdk.api.globalChannel.subscribe({
      next: (eventData: { data: { name: string }; event: AUTH_EVENTS | WEB3_EVENTS }) => {
        if (eventData.event === AUTH_EVENTS.CONNECT_ADDRESS) {
          if (!isLoading) setIsLoading(true);
          return;
        }
        if (eventData.event === AUTH_EVENTS.READY) {
          setIsLoading(false);
          return;
        }

        if (eventData.event === WEB3_EVENTS.DISCONNECTED) {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          return;
        }
      },
    });

    return () => {
      subSDK.unsubscribe();
    };
  }, [sdk.api.globalChannel]);

  useEffect(() => {
    const invalidateQuery = async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetMyProfileQuery.getKey(),
      });
    };

    if (!loginQuery.data?.id) {
      invalidateQuery();
      myProfileQuery.refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginQuery.data?.id]);

  useEffect(() => {
    let sub;
    if (routing) {
      sub = routing.routeObserver.subscribe({
        next: routeData => {
          setRouteData({ ...routeData.byArea });
        },
      });
    }
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [routing]);

  useEffect(() => {
    if (myProfileQuery.data?.akashaProfile?.did?.id) {
      setProfileName(myProfileQuery.data?.akashaProfile?.name);
    } else if (loginQuery.data?.id) {
      setProfileName('');
    } else {
      setProfileName(t('Guest'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoading,
    loginQuery.data?.id,
    myProfileQuery.data?.akashaProfile?.did?.id,
    myProfileQuery.data?.akashaProfile?.name,
  ]);

  // sort according to worldConfig index
  const worldApps = useMemo(() => {
    return routeData?.[MenuItemAreaType.AppArea]?.sort(
      (a: { name: string }, b: { name: string }) => {
        if (defaultApps.indexOf(a.name) < defaultApps.indexOf(b.name)) {
          return -1;
        } else if (defaultApps.indexOf(a.name) > defaultApps.indexOf(b.name)) {
          return 1;
        }
        return 0;
      },
    );
  }, [defaultApps, routeData]);

  const userInstalledApps = useMemo(() => {
    return routeData?.[MenuItemAreaType.UserAppArea];
  }, [routeData]);

  const handleNavigation = (appName: string, route: string) => {
    routing?.navigateTo({
      appName,
      getNavigationUrl: () => route,
    });
  };

  const handleAvatarClick = function (did: string) {
    if (!did) {
      return;
    }
    routing?.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${did}`,
    });

    if (isMobile) {
      handleSidebarClose();
    }
  };

  const handleClickExplore = () => {
    routing?.navigateTo({
      appName: '@akashaorg/app-akasha-verse',
      getNavigationUrl: routes => routes.explore,
    });

    if (isMobile) {
      handleSidebarClose();
    }
  };

  const handleSidebarClose = () => {
    // emit HideSidebar event to trigger corresponding action in associated widgets
    uiEvents.next({
      event: EventTypes.HideSidebar,
    });
  };

  function handleLoginClick() {
    handleNavigation('@akashaorg/app-auth-ewa', '/');

    if (isMobile) {
      handleSidebarClose();
    }
  }

  async function handleLogout() {
    await logoutQuery.mutateAsync();
    await queryClient.invalidateQueries({
      queryKey: [LOGIN_STATE_KEY],
    });
  }

  const handleLogoutClick = () => {
    handleLogout();
  };

  const handleAppIconClick = (menuItem: IMenuItem) => () => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      setActiveOption(null);
      handleNavigation(menuItem.name, menuItem.route);
      if (isMobile) {
        handleSidebarClose();
      }
    }
  };

  const handleOptionClick = (menuItem: IMenuItem, subrouteMenuItem: IMenuItem) => {
    setClickedOptions(oldClickedOptions => [
      ...oldClickedOptions,
      { name: menuItem.name, route: subrouteMenuItem },
    ]);
    setActiveOption(subrouteMenuItem);
    handleNavigation(menuItem.name, subrouteMenuItem.route);
    if (isMobile) {
      handleSidebarClose();
    }
  };

  const handleBackNavEvent = () => {
    const matchedRoute = clickedOptions.find(option =>
      location.pathname.includes(`${option.name}${option.route?.route}`),
    );

    if (matchedRoute) setActiveOption(matchedRoute.route);
    else setActiveOption(null);
  };

  useEffect(() => {
    window.addEventListener('popstate', handleBackNavEvent);
    return () => window.removeEventListener('popstate', handleBackNavEvent);
  });

  return (
    <Card
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h(screen xl:[calc(100vh-20px)]) h(full xl:fit)"
      radius="rounded-r-2xl xl:rounded-2xl"
      padding="p-0"
    >
      <Box customStyle="flex flex-row justify-items-stretch p-4 border-b-1 border(grey9 dark:grey3)">
        <Box customStyle="w-fit h-fit mr-2">
          <Avatar
            profileId={loginQuery.data?.id}
            avatar={getProfileImageVersionsWithMediaUrl(myProfileQuery.data?.akashaProfile?.avatar)}
            isClickable={!!loginQuery.data?.id}
            onClick={() => handleAvatarClick(loginQuery.data?.id)}
          />
        </Box>

        {isLoading ? (
          <Stack direction="column" spacing="gap-y-1" customStyle="w-fit flex-grow ">
            <TextLine title="tagName" animated={true} width="w-[40px]" />

            <TextLine title="tagName" animated={true} width="w-[100px]" />
          </Stack>
        ) : (
          <Box customStyle="w-fit flex flex-grow flex-col justify-center">
            {profileName && <Text variant="button-md">{profileName}</Text>}
            {loginQuery.data?.id && (
              <DidField
                did={loginQuery.data?.id}
                textColor="grey7"
                copyLabel={t('Copy to clipboard')}
                copiedLabel={t('Copied')}
              />
            )}

            {!loginQuery.data?.id && (
              <Text
                variant="footnotes2"
                color="grey7"
                customStyle="whitespace-normal"
                truncate
                breakWord
              >
                {t('Connect to see member only features.')}
              </Text>
            )}
          </Box>
        )}

        <Box customStyle="w-fit h-fit ml-6 self-start">
          {isLoading && <Button size="sm" loading onClick={handleLogoutClick} />}
          {!isLoading && (
            <>
              {loginQuery.data?.id && (
                <Button icon="PowerIcon" size="xs" iconOnly={true} onClick={handleLogoutClick} />
              )}
              {!loginQuery.data?.id && loginQuery.isStale && (
                <Button size="sm" variant="primary" label="Connect" onClick={handleLoginClick} />
              )}
            </>
          )}
        </Box>
      </Box>

      {/*
          this container will grow up to a max height of 68vh, 32vh currently accounts for the height of other sections and paddings. Adjust accordingly, if necessary.
        */}
      <Stack direction="column" customStyle="overflow-auto">
        {/* container for world apps */}
        {worldApps?.length > 0 && (
          <ListSidebarApps
            list={worldApps}
            activeOption={activeOption}
            onOptionClick={handleOptionClick}
            onClickMenuItem={handleAppIconClick}
          />
        )}

        {/* container for user-installed apps */}
        {userInstalledApps?.length > 0 && (
          <ListSidebarApps
            list={userInstalledApps}
            activeOption={activeOption}
            hasBorderTop={true}
            onOptionClick={handleOptionClick}
            onClickMenuItem={handleAppIconClick}
          />
        )}
      </Stack>

      {!dismissed && (
        <SidebarCTACard onClickCTAButton={handleClickExplore} onDismissCard={dismissCard} />
      )}

      {socialLinks.length > 0 && (
        <Box customStyle="flex flex-col px-8 py-4 border-t-1 border(grey9 dark:grey3)">
          <Text variant="footnotes2">{t('Get in touch')}</Text>

          <Box customStyle="flex w-fit h-fit mt-6">
            {socialLinks.map((socialLink, idx) => (
              <Anchor
                key={socialLink.icon + idx}
                href={socialLink.link}
                target="_blank"
                rel="noreferrer noopener"
                customStyle="mr-4"
              >
                <Button icon={socialLink.icon} variant="primary" greyBg={true} iconOnly={true} />
              </Anchor>
            ))}
          </Box>
        </Box>
      )}
    </Card>
  );
};
export default SidebarComponent;
