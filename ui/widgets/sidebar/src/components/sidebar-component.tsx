import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, EventTypes, MenuItemAreaType, IMenuItem } from '@akashaorg/typings/ui';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ListSidebarApps from './list-sidebar-apps';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import { useGetLogin, useLogout } from '@akashaorg/ui-awf-hooks';

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const {
    uiEvents,
    plugins,
    worldConfig: { defaultApps, socialLinks },
  } = props;
  const [routeData, setRouteData] = useState(null);
  const [activeOption, setActiveOption] = useState<IMenuItem | null>(null);
  const { t } = useTranslation('ui-widget-sidebar');

  const myProfileQuery = useGetMyProfileQuery(null, {
    select: data => data.viewer?.profile,
  });
  const loginQuery = useGetLogin();
  const logoutQuery = useLogout();

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

  const handleClickExplore = () => {
    routing?.navigateTo({
      appName: '@akashaorg/app-akasha-verse',
      getNavigationUrl: routes => routes.explore,
    });
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
  };
  const handleLogoutClick = () => {
    logoutQuery.mutate();
  };
  const handleAppIconClick = (menuItem: IMenuItem, isMobile?: boolean) => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      setActiveOption(null);
      handleNavigation(menuItem.name, menuItem.route);
      if (isMobile) {
        handleSidebarClose();
      }
    }
  };

  const handleOptionClick = (
    menuItem: IMenuItem,
    subrouteMenuItem: IMenuItem,
    isMobile?: boolean,
  ) => {
    setActiveOption(subrouteMenuItem);
    handleNavigation(menuItem.name, subrouteMenuItem.route);
    if (isMobile) {
      handleSidebarClose();
    }
  };

  const subtitleUi = useMemo(
    () => (
      <Text
        variant="footnotes1"
        customStyle={`text-grey5 ${myProfileQuery.data?.did?.id ? 'w-48' : 'whitespace-normal'}`}
        truncate
        breakWord
      >
        {myProfileQuery.data?.did.id ?? t('Connect to see exclusive member only features.')}
      </Text>
    ),
    [myProfileQuery],
  );

  return (
    <BasicCardBox
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h-[calc(100vh-20px)]"
      round="rounded-r-2xl xl:rounded-2xl"
      pad="p-0"
    >
      <Box customStyle="flex flex-row justify-items-stretch p-4 border-b-1 border(grey9 dark:grey3)">
        <Box customStyle="w-fit h-fit mr-2">
          <Avatar
            profileId={myProfileQuery.data?.did?.id}
            avatar={myProfileQuery.data?.avatar?.default.src}
          />
        </Box>
        <Box customStyle="w-fit flex flex-grow flex-col">
          <Text variant="button-md">{myProfileQuery.data?.name || t('Guest')}</Text>
          {myProfileQuery.data?.did?.id ? (
            <CopyToClipboard value={myProfileQuery.data.did.id}>{subtitleUi}</CopyToClipboard>
          ) : (
            subtitleUi
          )}
        </Box>
        <Box customStyle="w-fit h-fit ml-6 self-center">
          {loginQuery.data?.id && (
            <Button icon="PowerIcon" size="xs" iconOnly={true} onClick={handleLogoutClick} />
          )}
          {!loginQuery.data?.id && loginQuery.isStale && (
            <Button
              icon="BoltIcon"
              size="xs"
              variant="primary"
              iconOnly={true}
              onClick={handleLoginClick}
            />
          )}
          {loginQuery.isLoading && !loginQuery.isStale && <Spinner size="sm" />}
        </Box>
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
        <Box customStyle="w-fit h-fit mt-6">
          <Button onClick={handleClickExplore} label={t('Check them out!')} variant="primary" />
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
