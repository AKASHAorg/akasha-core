import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, EventTypes, MenuItemAreaType, IMenuItem } from '@akashaorg/typings/ui';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ListSidebarApps from './list-sidebar-apps';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import { startMobileSidebarHidingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';
import {
  getProfileImageVersionsWithMediaUrl,
  useGetLogin,
  useLogout,
} from '@akashaorg/ui-awf-hooks';
import { useQueryClient } from '@tanstack/react-query';

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const [isMobile, setIsMobile] = React.useState(
    window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );

  React.useEffect(() => {
    setIsMobile(window.matchMedia(startMobileSidebarHidingBreakpoint).matches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.matchMedia(startMobileSidebarHidingBreakpoint).matches]);

  const {
    uiEvents,
    plugins,
    worldConfig: { defaultApps, socialLinks },
  } = props;
  const [routeData, setRouteData] = useState(null);
  const [activeOption, setActiveOption] = useState<IMenuItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileName, setProfileName] = React.useState('Guest');
  const { t } = useTranslation('ui-widget-sidebar');

  const loginQuery = useGetLogin();
  const logoutQuery = useLogout();
  const queryClient = useQueryClient();

  const myProfileQuery = useGetMyProfileQuery(null, {
    enabled: !!loginQuery.data?.id,
    select: data => data.viewer?.profile,
    onSuccess: () => setIsLoading(false),
  });

  useEffect(() => {
    const invalidateQuery = async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetMyProfileQuery.getKey(),
      });
      return;
    };

    if (!loginQuery.data?.id) {
      invalidateQuery();
      myProfileQuery.refetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginQuery.data?.id]);

  useEffect(() => {
    if (myProfileQuery.isFetching && !myProfileQuery.data?.did) {
      setIsLoading(true);
    }
  }, [myProfileQuery.isFetching, myProfileQuery.data?.did]);

  useEffect(() => {
    if (logoutQuery.status === 'success') {
      setIsLoading(false);
    }
  }, [logoutQuery.status]);

  const routing = plugins['@akashaorg/app-routing']?.routing;

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

  // const allApps = React.useMemo(() => {
  //   return [...(worldApps || []), ...(userInstalledApps || [])];
  // }, [worldApps, userInstalledApps]);
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

  const handleLoginClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: () => '/',
    });

    if (isMobile) {
      handleSidebarClose();
    }
  };
  const handleLogoutClick = () => {
    setIsLoading(true);
    logoutQuery.mutateAsync();
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

  const subtitleUi = React.useRef(null);
  // const subtitleUi = React.useCallback(
  //   () =>
  //     myProfileQuery.data?.did?.id ? (
  //       <DidField
  //         did={myProfileQuery.data?.did?.id}
  //         textColor="grey7"
  //         copyLabel={t('Copy to clipboard')}
  //         copiedLabel={t('Copied')}
  //       />
  //     ) : (
  //       <Text variant="footnotes1" customStyle="text-grey5 whitespace-normal" truncate breakWord>
  //         {t('Connect to see exclusive member only features.')}
  //       </Text>
  //     ),

  //   [myProfileQuery.data?.did?.id, t],
  // );

  React.useEffect(() => {
    if (myProfileQuery.data?.did?.id) {
      subtitleUi.current = (
        <DidField
          did={myProfileQuery.data?.did?.id}
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
  }, [myProfileQuery.data?.did?.id, t]);

  React.useEffect(() => {
    if (myProfileQuery.data?.did?.id) {
      setProfileName(myProfileQuery.data?.name);
    } else {
      setProfileName('Guest');
    }
  }, [myProfileQuery.data?.did?.id, myProfileQuery.data?.name]);

  const ConnectButton = useMemo(
    () =>
      isLoading ? (
        <Button size="sm" loading />
      ) : (
        <>
          {myProfileQuery.data?.did?.id && (
            <Button icon="PowerIcon" size="xs" iconOnly={true} onClick={handleLogoutClick} />
          )}
          {!myProfileQuery.data?.did?.id /* !loginQuery.data?.id */ && loginQuery.isStale && (
            <Button size="sm" variant="primary" label="Connect" onClick={handleLoginClick} />
          )}
        </>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, loginQuery.isStale, myProfileQuery.data?.did?.id],
  );

  return (
    <BasicCardBox
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h-screen min-[1440px]:max-h-[calc(100vh-20px)]"
      round="rounded-r-2xl xl:rounded-2xl"
      pad="p-0"
    >
      <Box customStyle="flex flex-row justify-items-stretch p-4 border-b-1 border(grey9 dark:grey3)">
        <Box customStyle="w-fit h-fit mr-2">
          <Avatar
            profileId={myProfileQuery.data?.did?.id}
            avatar={getProfileImageVersionsWithMediaUrl(myProfileQuery.data?.avatar)}
            isClickable={!!myProfileQuery.data?.did?.id}
            onClick={() => handleAvatarClick(myProfileQuery.data?.did?.id)}
          />
        </Box>
        <Box customStyle="w-fit flex flex-grow flex-col">
          <Text variant="button-md">{profileName}</Text>
          {subtitleUi.current}
        </Box>
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
      <Box customStyle="flex flex-col px-8 py-4 bg-grey9 dark:bg-grey3">
        <Text variant="footnotes2" customStyle="text-grey5">
          {t('Add magic to your world by installing cool apps developed by the community')}
        </Text>
        <Box customStyle="w-fit h-fit mt-6 self-end">
          <Button onClick={handleClickExplore} label={t('Check them out!')} variant="secondary" />
        </Box>
      </Box>
      {socialLinks.length > 0 && (
        <Box customStyle="flex flex-col px-8 py-4">
          <Text variant="footnotes2" customStyle="text-grey5">
            {t('Get in touch')}
          </Text>
          <Box customStyle="flex w-fit h-fit mt-6">
            {socialLinks.map((socialLink, idx) => (
              <Box key={socialLink.icon + idx} customStyle="mr-4">
                <a href={socialLink.link} target="_blank" rel="noreferrer noopener">
                  <Button icon={socialLink.icon} variant="primary" greyBg={true} iconOnly={true} />
                </a>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </BasicCardBox>
  );
};
export default SidebarComponent;
