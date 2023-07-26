import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
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
  const [isLoading, setIsLoading] = useState(false);
  const [profileName, setProfileName] = useState('Guest');

  const subtitleUi = useRef(null);

  const { t } = useTranslation('ui-widget-sidebar');

  const loginQuery = useGetLogin();
  const logoutQuery = useLogout();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useDismissedCard();
  const myProfileQuery = useGetMyProfileQuery(null, {
    enabled: !!loginQuery.data?.id,
    select: data => data.viewer,
    onSuccess: data => {
      if (data) setIsLoading(false);
    },
  });

  const sdk = getSDK();
  const routing = plugins['@akashaorg/app-routing']?.routing;

  const dismissedCardId = 'dismiss-sidebar-cta-card';

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
        if (
          eventData.event === AUTH_EVENTS.WAIT_FOR_AUTH ||
          eventData.event === AUTH_EVENTS.CONNECT_ADDRESS
        ) {
          setIsLoading(true);
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

  // const allApps = useMemo(() => {
  //   return [...(worldApps || []), ...(userInstalledApps || [])];
  // }, [worldApps, userInstalledApps]);

  useEffect(() => {
    if (loginQuery.data?.id) {
      subtitleUi.current = (
        <DidField
          did={loginQuery.data?.id}
          textColor="grey7"
          copyLabel={t('Copy to clipboard')}
          copiedLabel={t('Copied')}
        />
      );
    } else {
      subtitleUi.current = (
        <Text variant="footnotes1" customStyle="text-grey5 whitespace-normal" truncate breakWord>
          {t('Connect to see exclusive member only features.')}
        </Text>
      );
    }
  }, [isLoading, loginQuery.data?.id, t]);

  useEffect(() => {
    if (myProfileQuery.data?.profile?.did?.id) {
      setProfileName(myProfileQuery.data?.profile?.name);
    } else if (loginQuery.data?.id) {
      setProfileName('Logged-in User');
    } else {
      setProfileName('Guest');
    }
  }, [
    isLoading,
    loginQuery.data?.id,
    myProfileQuery.data?.profile?.did?.id,
    myProfileQuery.data?.profile?.name,
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

  const ConnectButton = useMemo(
    () =>
      isLoading ? (
        <Button size="sm" loading onClick={handleLogout} />
      ) : (
        <>
          {
            /* myProfileQuery.data */ loginQuery.data?.id && (
              <Button icon="PowerIcon" size="xs" iconOnly={true} onClick={handleLogoutClick} />
            )
          }
          {
            /* !myProfileQuery.data?.profile?.did?.id */ !loginQuery.data?.id &&
              loginQuery.isStale && (
                <Button size="sm" variant="primary" label="Connect" onClick={handleLoginClick} />
              )
          }
        </>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, loginQuery.isStale, myProfileQuery.data?.profile?.did?.id],
  );

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

  const handleAppIconClick = (menuItem: IMenuItem) => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      setActiveOption(null);
      handleNavigation(menuItem.name, menuItem.route);
      if (isMobile) {
        handleSidebarClose();
      }
    }
  };

  const handleOptionClick = (menuItem: IMenuItem, subrouteMenuItem: IMenuItem) => {
    setActiveOption(subrouteMenuItem);
    handleNavigation(menuItem.name, subrouteMenuItem.route);
    if (isMobile) {
      handleSidebarClose();
    }
  };

  const handleDismissCTACard = useCallback(() => {
    setDismissed(dismissedCardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissed]);

  return (
    <BasicCardBox
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h-screen min-[1440px]:max-h-[calc(100vh-20px)]"
      round="rounded-r-2xl xl:rounded-2xl"
      pad="p-0"
    >
      <Box customStyle="flex flex-row justify-items-stretch p-4 border-b-1 border(grey9 dark:grey3)">
        <Box customStyle="w-fit h-fit mr-2">
          <Avatar
            profileId={loginQuery.data?.id}
            avatar={getProfileImageVersionsWithMediaUrl(myProfileQuery.data?.profile?.avatar)}
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
          <Box customStyle="w-fit flex flex-grow flex-col">
            <Text variant="button-md">{profileName}</Text>
            {subtitleUi.current}
          </Box>
        )}

        <Box customStyle="w-fit h-fit ml-6 self-start">{ConnectButton}</Box>
      </Box>

      {/*
          this container will grow up to a max height of 68vh, 32vh currently accounts for the height of other sections and paddings. Adjust accordingly, if necessary.
        */}
      <Box customStyle="flex flex-col max-h-[68vh] overflow-auto">
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
      </Box>

      {!dismissed.includes(dismissedCardId) && (
        <SidebarCTACard
          ctaText={`🪄${t(
            'Add magic to your world by installing cool apps developed by the community',
          )}`}
          ctaButtonLabel={t('Check them out')}
          onClickCTAButton={handleClickExplore}
          onDismissCard={handleDismissCTACard}
        />
      )}

      {socialLinks.length > 0 && (
        <Box customStyle="flex flex-col px-8 py-4 border-t-1 border(grey9 dark:grey3)">
          <Text variant="footnotes2" customStyle="text-grey5">
            {t('Get in touch')}
          </Text>

          <Box customStyle="flex w-fit h-fit mt-6">
            {socialLinks.map((socialLink, idx) => (
              <Box key={socialLink.icon + idx} customStyle="mr-4">
                <Anchor href={socialLink.link} target="_blank" rel="noreferrer noopener">
                  <Button icon={socialLink.icon} variant="primary" greyBg={true} iconOnly={true} />
                </Anchor>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </BasicCardBox>
  );
};
export default SidebarComponent;
